"use client";

import { useState } from "react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Copy, Check, Gift } from "lucide-react";
import Link from "next/link";

export default function ZaproszeniePage() {
  const { user } = useGlobalState();
  const [copied, setCopied] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <p className="text-gray-500">Zaloguj się, żeby zaprosić koleżankę.</p>
        <Link href="/login" className="px-6 py-3 rounded-full text-white font-semibold" style={{ background: "#F0147A" }}>
          Zaloguj się
        </Link>
      </div>
    );
  }

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/join?ref=${user.id}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-sm mx-auto flex flex-col gap-6 pb-8">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Zaproś koleżankę</h1>
        <p className="text-gray-500 text-sm mt-1">Za każdą osobę która dołączy przez Twój link obie dostajecie po 20 Kul Mocy!</p>
      </div>

      {/* Ilustracja */}
      <div
        className="rounded-3xl p-8 flex flex-col items-center gap-4 text-center"
        style={{ background: "linear-gradient(135deg, #F0147A 0%, #C4006A 100%)" }}
      >
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">👑</div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">👑</div>
        </div>
        <div className="text-white">
          <p className="font-bold text-xl">+20 Kul Mocy</p>
          <p className="text-white/80 text-sm">dla Ciebie i dla niej</p>
        </div>
      </div>

      {/* Link polecający */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <p className="text-sm font-semibold text-gray-700">Twój link polecający</p>
        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "#F8F5F7" }}>
          <p className="flex-1 text-xs text-gray-500 truncate font-mono">{referralLink}</p>
          <button
            onClick={handleCopy}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ background: copied ? "#16A34A" : "#F0147A" }}
          >
            {copied
              ? <Check size={14} className="text-white" />
              : <Copy size={14} className="text-white" />
            }
          </button>
        </div>
        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          style={{ background: "#F0147A" }}
        >
          <Gift size={16} />
          {copied ? "Skopiowano! 🎉" : "Kopiuj link i wyślij koleżance"}
        </button>
      </div>

      {/* Jak to działa */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <p className="font-semibold text-gray-900">Jak to działa?</p>
        {[
          { n: "1", text: "Skopiuj swój link polecający" },
          { n: "2", text: "Wyślij go koleżance (WhatsApp, SMS...)" },
          { n: "3", text: "Ona rejestruje się przez ten link" },
          { n: "4", text: "Obie dostajecie po 20 Kul Mocy! 🎉" },
        ].map(({ n, text }) => (
          <div key={n} className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: "#F0147A" }}
            >
              {n}
            </div>
            <p className="text-sm text-gray-600">{text}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
