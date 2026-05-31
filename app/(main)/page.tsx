"use client";

import Link from "next/link";
import { MapPin, Navigation, Search } from "lucide-react";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { useProducts } from "@/hooks/queries/useProducts";

export default function Home() {
  const { data: user } = useCurrentUser();
  const { data: products, isLoading } = useProducts();

  const featured = products?.filter((p) => p.isAvailable).slice(0, 2) ?? [];

  return (
    <div className="flex gap-6 items-start">

      {/* ── Kolumna lewa (główna) ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">

        {/* Hero banner */}
        <div
          className="rounded-3xl p-8 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #F0147A 0%, #FF6DAE 100%)" }}
        >
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.25)" }}
            >
              <span className="text-white text-2xl">★</span>
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold leading-tight">
                {user?.name ? `Witaj, ${user.name}!` : "Witaj ponownie,"}<br />
                {user?.name ? "" : "Królowo!"}
              </h1>
              {user?.loyalty && (
                <p className="text-white/80 text-sm mt-1">
                  Saldo: <strong>{user.loyalty.balance.toLocaleString("pl-PL")} Kul Mocy</strong>
                </p>
              )}
            </div>
          </div>
          <Link
            href="/nagrody"
            className="shrink-0 px-6 py-3 rounded-full font-semibold text-sm transition-colors"
            style={{ background: "rgba(255,255,255,0.9)", color: "#F0147A" }}
          >
            Zobacz wszystkie nagrody
          </Link>
        </div>

        {/* Polecane produkty */}
        <div>
          <h2 className="text-xl font-bold mb-4">Polecane dla Królowej</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="h-44 bg-gray-100" />
                  <div className="p-4 flex flex-col gap-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-8 bg-gray-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featured.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="h-44 overflow-hidden bg-gray-50">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">
                        🥙
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-base">{product.name}</h3>
                      <span className="text-sm font-bold shrink-0 text-gray-700">
                        {product.price.toFixed(2)} PLN
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                    <Link
                      href="/menu"
                      className="w-full py-2.5 rounded-full text-sm font-semibold text-center transition-colors"
                      style={{ background: "#FADADF", color: "#F0147A" }}
                    >
                      Zobacz w menu
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Kolumna prawa (sidebar) ── */}
      <div className="w-80 shrink-0 flex flex-col gap-4">

        {/* Znajdź Kebab Queen */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <MapPin size={18} style={{ color: "#F0147A" }} />
            <h3 className="font-bold">Znajdź Kebab Queen</h3>
          </div>
          <p className="text-sm text-gray-400">Wyszukaj najbliższą lokalizację</p>

          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border"
            style={{ borderColor: "#F0147A" }}
          >
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Wpisz miasto lub kod..."
              className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
            />
          </div>

          <div
            className="h-36 rounded-xl flex items-center justify-center"
            style={{ background: "#E8E8F0" }}
          >
            <div className="text-center">
              <MapPin size={28} style={{ color: "#F0147A" }} className="mx-auto mb-1" />
              <p className="text-xs text-gray-500 font-medium">Centrum, 1.2km</p>
            </div>
          </div>

          <button
            className="w-full py-3 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: "#F0147A" }}
          >
            <Navigation size={16} />
            Prowadź do mnie
          </button>
        </div>

        {/* Nowość! */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-2"
          style={{ background: "#1E1B2E" }}
        >
          <p className="text-white font-bold text-lg">Nowość!</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Spróbuj naszych Wrapów Dragon Fire z pikantnym miodem ghost pepper.
          </p>
          <Link
            href="/menu"
            className="text-sm font-semibold mt-1 text-left"
            style={{ color: "#F0147A" }}
          >
            Dowiedz się więcej →
          </Link>
        </div>
      </div>
    </div>
  );
}
