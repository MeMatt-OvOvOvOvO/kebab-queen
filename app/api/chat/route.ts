import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSession } from "@/lib/session";
import { buildSystemPrompt, buildMockReply } from "@/lib/queen-knowledge";
import { prisma } from "@/lib/db";
import type { ChatMessage } from "@/types/ChatMessage.type";

// Strumieniowanie wymaga środowiska Node (Anthropic SDK).
export const runtime = "nodejs";

const MAX_HISTORY = 20;

type ChatBody = {
  messages?: ChatMessage[];
  coords?: { lat: number; lng: number } | null;
};

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Wymagane logowanie" }, { status: 401 });

  const body = (await request.json()) as ChatBody;

  // Mapujemy historię na format SDK; wiadomości muszą zaczynać się od roli "user".
  const incoming = (body.messages ?? [])
    .filter((m) => m.content?.trim())
    .slice(-MAX_HISTORY);
  const firstUser = incoming.findIndex((m) => m.role === "user");
  const history = firstUser === -1 ? [] : incoming.slice(firstUser);

  if (history.length === 0)
    return NextResponse.json({ error: "Brak wiadomości" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true },
  });

  const encoder = new TextEncoder();

  // Tryb demo: bez klucza API strumieniujemy deterministyczną odpowiedź z bazy wiedzy.
  if (!process.env.ANTHROPIC_API_KEY) {
    const lastUser = [...history].reverse().find((m) => m.role === "user");
    const reply = await buildMockReply(lastUser?.content ?? "", {
      userName: user?.name,
      coords: body.coords ?? null,
    });

    const mockStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        // Naśladujemy strumieniowanie, dzieląc odpowiedź na drobne fragmenty.
        for (const chunk of reply.match(/[\s\S]{1,4}/g) ?? [reply]) {
          controller.enqueue(encoder.encode(chunk));
          await new Promise((r) => setTimeout(r, 12));
        }
        controller.close();
      },
    });

    return new Response(mockStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });
  }

  const systemPrompt = await buildSystemPrompt({
    userName: user?.name,
    coords: body.coords ?? null,
  });

  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const client = new Anthropic();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const completion = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 1024,
          thinking: { type: "disabled" },
          output_config: { effort: "low" },
          system: [
            {
              type: "text",
              text: systemPrompt,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages,
        });

        completion.on("text", (delta) => {
          controller.enqueue(encoder.encode(delta));
        });

        await completion.finalMessage();
        controller.close();
      } catch (err) {
        const message =
          err instanceof Anthropic.APIError
            ? "Przepraszam, AI Queen ma teraz przerwę. Spróbuj ponownie za chwilę."
            : "Coś poszło nie tak. Spróbuj ponownie.";
        controller.enqueue(encoder.encode(message));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
