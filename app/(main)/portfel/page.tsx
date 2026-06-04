"use client";

import { useState } from "react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { Star, TrendingUp, TrendingDown, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TRANSACTION_TYPE } from "@/types/TransactionType.enum";
import type { TransactionTypeEnum } from "@/types/TransactionType.enum";

function tierLabel(tier: number) {
  if (tier >= 4) return "Diamentowa Królowa";
  if (tier === 3) return "Złota Elita";
  if (tier === 2) return "Srebrna Gwardia";
  return "Brązowa Adeptka";
}

// Punkty do następnego tier (co 200 pkt kolejny poziom, max 7)
function tierProgress(balance: number, tier: number) {
  if (tier >= 7) return { current: 100, needed: 0, percent: 100 };
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2100];
  const next = thresholds[tier] ?? 2100;
  const prev = thresholds[tier - 1] ?? 0;
  const current = balance - prev;
  const needed = next - prev;
  return { current, needed, percent: Math.min(100, Math.round((current / needed) * 100)) };
}

function txIcon(type: TransactionTypeEnum) {
  if (type === TRANSACTION_TYPE.Redeem) return <TrendingDown size={16} className="text-red-400" />;
  if (type === TRANSACTION_TYPE.Referral) return <Gift size={16} style={{ color: "#F0147A" }} />;
  return <TrendingUp size={16} className="text-green-500" />;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pl-PL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function PortfelPage() {
  const { user, isLoading: userLoading } = useGlobalState();
  const [page, setPage] = useState(1);
  const { data, isLoading: txLoading } = useTransactions(page, 10);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "#F0147A", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <p className="text-gray-500">Zaloguj się, żeby zobaczyć swój portfel.</p>
        <Link href="/login" className="px-6 py-3 rounded-full text-white font-semibold" style={{ background: "#F0147A" }}>
          Zaloguj się
        </Link>
      </div>
    );
  }

  const { current, needed, percent } = tierProgress(user.loyalty.balance, user.loyalty.tier);
  const toNextTier = needed - current;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-8">

      <h1 className="text-2xl font-bold text-gray-900">Portfel Kul Mocy</h1>

      {/* Karta salda */}
      <div
        className="rounded-3xl p-6 text-white"
        style={{ background: "linear-gradient(135deg, #F0147A 0%, #C4006A 100%)" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/70 text-sm mb-1">Twoje saldo</p>
            <p className="text-5xl font-bold">{user.loyalty.balance.toLocaleString("pl-PL")}</p>
            <p className="text-white/80 text-sm mt-1">Kul Mocy</p>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs mb-2">{tierLabel(user.loyalty.tier)}</p>
            <div className="flex gap-1 justify-end">
              {Array.from({ length: 7 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < user.loyalty.tier ? "#F5C518" : "transparent"}
                  stroke={i < user.loyalty.tier ? "#F5C518" : "rgba(255,255,255,0.3)"}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pasek postępu do następnego tier */}
        {user.loyalty.tier < 7 && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-white/70 mb-1.5">
              <span>Postęp do następnego poziomu</span>
              <span>{toNextTier > 0 ? `jeszcze ${toNextTier} KM` : "Osiągnięto!"}</span>
            </div>
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percent}%`, background: "#F5C518" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Skróty */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/karta"
          className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#FADADF" }}>
            <span style={{ color: "#F0147A" }}>📱</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Moja karta</p>
            <p className="text-xs text-gray-400">Pokaż QR</p>
          </div>
        </Link>
        <Link
          href="/nagrody"
          className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#FADADF" }}>
            <span style={{ color: "#F0147A" }}>🎁</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Nagrody</p>
            <p className="text-xs text-gray-400">Wymień KM</p>
          </div>
        </Link>
      </div>

      {/* Historia transakcji */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Historia transakcji</h2>
        </div>

        {txLoading ? (
          <div className="p-5 flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-gray-100 shrink-0" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 rounded w-40 mb-2" />
                  <div className="h-2 bg-gray-100 rounded w-24" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-16" />
              </div>
            ))}
          </div>
        ) : !data?.items.length ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-3xl mb-2">🥙</p>
            <p className="font-medium">Brak transakcji</p>
            <p className="text-sm mt-1">Odwiedź Kebab Queen i nabij pierwsze Kule Mocy!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {data.items.map((tx) => (
              <div key={tx.id} className="px-5 py-4 flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: tx.type === TRANSACTION_TYPE.Earn ? "#F0FFF4" : tx.type === TRANSACTION_TYPE.Referral ? "#FADADF" : "#FFF5F5" }}
                >
                  {txIcon(tx.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                  <p className="text-xs text-gray-400">{formatDate(tx.createdAt)}</p>
                </div>
                <span
                  className="font-bold text-sm shrink-0"
                  style={{ color: tx.type === TRANSACTION_TYPE.Redeem ? "#EF4444" : "#16A34A" }}
                >
                  {tx.type === TRANSACTION_TYPE.Redeem ? "-" : "+"}{Math.abs(tx.points)} KM
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Paginacja */}
        {data && data.total > 10 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-sm font-medium disabled:opacity-40 transition-opacity"
              style={{ color: "#F0147A" }}
            >
              ← Poprzednia
            </button>
            <span className="text-xs text-gray-400">
              Strona {page} z {Math.ceil(data.total / 10)}
            </span>
            <button
              disabled={page >= Math.ceil(data.total / 10)}
              onClick={() => setPage((p) => p + 1)}
              className="text-sm font-medium disabled:opacity-40 transition-opacity"
              style={{ color: "#F0147A" }}
            >
              Następna →
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
