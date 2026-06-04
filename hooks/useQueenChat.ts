"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/types/ChatMessage.type";

type Coords = { lat: number; lng: number };

export function useQueenChat(greeting: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: greeting },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const coordsRef = useRef<Coords | null>(null);

  // Najlepszy wysiłek — pobierz lokalizację raz; odmowa jest ignorowana.
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        coordsRef.current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      },
      () => {},
      { timeout: 5000, maximumAge: 600_000 },
    );
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);
      setIsStreaming(true);

      const history: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      // Wiadomość użytkownika + pusty bąbel asystenta do strumieniowania.
      setMessages([...history, { role: "assistant", content: "" }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            messages: history,
            coords: coordsRef.current,
          }),
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? "Błąd połączenia z AI Queen.");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages([...history, { role: "assistant", content: acc }]);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Coś poszło nie tak.";
        setError(msg);
        // Usuń pusty bąbel asystenta, by nie wisiał w rozmowie.
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return last?.role === "assistant" && last.content === ""
            ? prev.slice(0, -1)
            : prev;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, isStreaming],
  );

  return { messages, send, isStreaming, error };
}
