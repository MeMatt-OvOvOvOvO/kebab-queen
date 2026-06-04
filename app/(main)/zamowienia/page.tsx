"use client";

import Link from "next/link";
import { useGlobalState } from "@/context/GlobalStateContext";
import { ShoppingBag, ArrowRight } from "lucide-react";

export default function ZamowieniaPage() {
  const { user } = useGlobalState();

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-8">
      <h1 className="text-2xl font-bold text-gray-900">Zamówienia</h1>

      {!user ? (
        /* Niezalogowany */
        <div className="bg-white rounded-3xl p-10 flex flex-col items-center gap-5 text-center shadow-sm">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: "#FADADF" }}
          >
            <ShoppingBag size={36} style={{ color: "#F0147A" }} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg">Zaloguj się</p>
            <p className="text-gray-500 text-sm mt-1">
              Zaloguj się, żeby zobaczyć historię zamówień i zbierać Kule Mocy.
            </p>
          </div>
          <Link
            href="/login"
            className="px-8 py-3 rounded-full text-white font-semibold"
            style={{ background: "#F0147A" }}
          >
            Zaloguj się
          </Link>
        </div>
      ) : (
        /* Zalogowany, brak zamówień */
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-10 flex flex-col items-center gap-5 text-center shadow-sm">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
              style={{ background: "#FADADF" }}
            >
              🥙
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">Brak zamówień</p>
              <p className="text-gray-500 text-sm mt-1 max-w-xs">
                Tu pojawi się historia Twoich zamówień. Czas na pierwszy kebab, Królowo!
              </p>
            </div>
            <Link
              href="/menu"
              className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold"
              style={{ background: "#F0147A" }}
            >
              Zobacz menu
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Podpowiedź o punktach */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: "linear-gradient(135deg, #F0147A 0%, #C4006A 100%)" }}
          >
            <span className="text-3xl shrink-0">⭐</span>
            <div className="text-white">
              <p className="font-bold text-sm">Zbieraj Kule Mocy!</p>
              <p className="text-white/80 text-xs mt-0.5">
                Przy każdym zamówieniu pokaż kasjerowi swoją{" "}
                <Link href="/karta" className="underline font-semibold">kartę QR</Link>{" "}
                i nabijaj punkty.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
