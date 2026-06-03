"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useQueenChat } from "@/hooks/useQueenChat";
import Button from "@/components/ui/Button";

const SUGGESTIONS = [
  "Coś lekkiego, bez cebuli",
  "Gdzie najbliższa Queen?",
  "Ile kalorii ma kebab amerykański?",
  "Co polecasz na ostro?",
];

function QueenAvatar() {
  return (
    <span
      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm self-end"
      style={{ background: "linear-gradient(135deg, #F0147A 0%, #FF6DAE 100%)" }}
      aria-hidden
    >
      ✕
    </span>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1" aria-label="AI Queen pisze">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="w-2 h-2 rounded-full bg-pink/60 animate-bounce"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </span>
  );
}

export default function CzatPage() {
  const { user } = useGlobalState();
  const greeting = `Cześć${user?.name ? ` ${user.name}` : ""}! Jestem AI Queen — doradzę Ci w wyborze, opowiem o składnikach albo podpowiem, gdzie zjeść. Na co masz dziś ochotę?`;

  const { messages, send, isStreaming, error } = useQueenChat(greeting);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const submit = (text: string) => {
    send(text);
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(input);
  };

  const showSuggestions = messages.length <= 1 && !isStreaming;

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-4">
      {/* Nagłówek */}
      <div className="flex items-center gap-3">
        <QueenAvatar />
        <div>
          <h1 className="font-bold text-lg leading-tight">AI Queen</h1>
          <p className="text-xs text-gray-500">
            Twoja doradczyni smaku · zwykle odpowiada od razu
          </p>
        </div>
      </div>

      {/* Lista wiadomości */}
      <div
        ref={scrollRef}
        className="bg-white rounded-2xl shadow-sm p-4 h-[60vh] overflow-y-auto flex flex-col gap-3"
      >
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          const isStreamingBubble =
            !isUser && i === messages.length - 1 && isStreaming;
          return (
            <div
              key={i}
              className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && <QueenAvatar />}
              <div
                className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap rounded-2xl ${
                  isUser
                    ? "bg-gradient-to-br from-pink to-pink-dark text-white rounded-br-md"
                    : "bg-bg text-gray-800 rounded-bl-md"
                }`}
              >
                {m.content ? (
                  m.content
                ) : isStreamingBubble ? (
                  <TypingDots />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Podpowiedzi */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => submit(s)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-pink-light text-pink hover:opacity-90 transition-opacity"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500 px-1">{error}</p>}

      {/* Pole wpisywania */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napisz wiadomość…"
          className="flex-1 px-4 py-3 rounded-full bg-white shadow-sm text-sm outline-none focus:ring-2 focus:ring-pink/40"
          disabled={isStreaming}
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isStreaming || !input.trim()}
          className="!px-3.5 aspect-square"
          aria-label="Wyślij"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
