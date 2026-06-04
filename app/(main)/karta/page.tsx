"use client";

import { QRCodeSVG } from "qrcode.react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { Star, RefreshCw } from "lucide-react";
import Link from "next/link";

function tierLabel(tier: number) {
  if (tier >= 4) return "Diamentowa Królowa";
  if (tier === 3) return "Złota Elita";
  if (tier === 2) return "Srebrna Gwardia";
  return "Brązowa Adeptka";
}

export default function KartaPage() {
  const { user, isLoading } = useGlobalState();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#F0147A", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <p className="text-gray-500">Zaloguj się, żeby zobaczyć swoją kartę.</p>
        <Link href="/login" className="px-6 py-3 rounded-full text-white font-semibold" style={{ background: "#F0147A" }}>
          Zaloguj się
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto flex flex-col gap-6 pb-8">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Twoja Karta</h1>
        <p className="text-gray-500 text-sm mt-1">Pokaż ten kod przy kasie, żeby nabić punkty</p>
      </div>

      {/* Karta lojalnościowa */}
      <div
        className="rounded-3xl overflow-hidden shadow-xl"
        style={{ background: "linear-gradient(145deg, #F0147A 0%, #C4006A 50%, #8B0042 100%)" }}
      >
        {/* Górna część karty */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest">Kebab Queen</p>
            <p className="text-white font-bold text-lg mt-0.5">{user.name ?? user.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs">Poziom</p>
            <p className="text-white font-bold text-sm">{tierLabel(user.loyalty.tier)}</p>
          </div>
        </div>

        {/* QR kod */}
        <div className="mx-6 mb-4 bg-white rounded-2xl p-5 flex flex-col items-center gap-3">
          <QRCodeSVG
            value={user.id}
            size={180}
            level="M"
            includeMargin={false}
            fgColor="#1A1A1A"
          />
          <p className="text-xs text-gray-400 font-mono tracking-wider">
            {user.id.slice(0, 8).toUpperCase()}…
          </p>
        </div>

        {/* Dolna część karty */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs">Kule Mocy</p>
            <p className="text-white font-bold text-2xl">{user.loyalty.balance.toLocaleString("pl-PL")}</p>
          </div>
          {/* Gwiazdki tier */}
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < user.loyalty.tier ? "#F5C518" : "transparent"}
                stroke={i < user.loyalty.tier ? "#F5C518" : "rgba(255,255,255,0.3)"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Instrukcja */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#FADADF" }}>
          <span style={{ color: "#F0147A", fontSize: "16px" }}>ℹ</span>
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900 mb-1">Jak używać?</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Pokaż ten kod kasjerowi przy kasie przed zamówieniem. Zeskanuje go i naliczy Ci Kule Mocy za zakup.
          </p>
        </div>
      </div>

      {/* Link do historii */}
      <Link
        href="/portfel"
        className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#FADADF" }}>
            <RefreshCw size={16} style={{ color: "#F0147A" }} />
          </div>
          <div>
            <p className="font-semibold text-sm">Historia transakcji</p>
            <p className="text-xs text-gray-400">Zobacz ostatnie nabicia punktów</p>
          </div>
        </div>
        <span className="text-gray-300 text-lg">›</span>
      </Link>

    </div>
  );
}
