"use client";

import Link from "next/link";
import { MapPin, Navigation, Search, MessageCircle, Zap } from "lucide-react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useProducts } from "@/hooks/queries/useProducts";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import HappyHoursBanner from "@/components/HappyHoursBanner";

function tierLabel(tier: number): string {
  if (tier >= 4) return "Diamentowa Królowa";
  if (tier === 3) return "Złota Elita";
  if (tier === 2) return "Srebrna Gwardia";
  return "Brązowa Adeptka";
}

export default function Home() {
  const { user } = useGlobalState();
  const { data: products, isLoading } = useProducts();
  const { data: usualData } = useQuery<{ usual: string | null }>({
    queryKey: [{ resource: "user", scope: "usual" }],
    queryFn: async () => {
      const { data } = await apiClient.get("/user/usual");
      return data;
    },
    enabled: !!user,
  });

  const featured = products?.filter((p) => p.isAvailable).slice(0, 4) ?? [];
  const usual = usualData?.usual ?? null;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* ── Kolumna lewa (główna) ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">

        {/* Happy Hours baner */}
        <HappyHoursBanner />

        {/* "To co zwykle?" — tylko gdy user ma historię */}
        {user && usual && (
          <button
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-white font-semibold transition-opacity hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #D4A843 0%, #F0147A 100%)" }}
          >
            <div className="flex items-center gap-3">
              <Zap size={20} fill="white" />
              <div className="text-left">
                <p className="font-bold">To co zwykle?</p>
                <p className="text-white/80 text-xs font-normal">{usual}</p>
              </div>
            </div>
            <span className="text-white/70 text-xl">›</span>
          </button>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="rounded-2xl p-5 flex flex-col items-center gap-2 transition-transform active:scale-95"
            style={{
              background: "linear-gradient(135deg, #F0147A 0%, #FF6DAE 100%)",
            }}
          >
            <MapPin size={28} className="text-white" />
            <span className="text-white font-bold text-sm">Znajdź lokal</span>
          </button>
          <Link
            href="/czat"
            className="rounded-2xl p-5 flex flex-col items-center gap-2 bg-white border border-gray-100 shadow-sm transition-transform active:scale-95"
          >
            <MessageCircle size={28} style={{ color: "#F0147A" }} />
            <span className="font-bold text-sm text-gray-900">Czat AI</span>
          </Link>
        </div>

        {/* Featured offers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Wyjątkowe Oferty</h2>
            <Link
              href="/menu"
              className="text-sm font-semibold"
              style={{ color: "#F0147A" }}
            >
              Zobacz Wszystko
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 4].map((i) => (
                <Card
                  key={i}
                  className="overflow-hidden rounded-2xl animate-pulse"
                >
                  <div className="h-48 bg-gray-100" />
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="h-4 bg-gray-100 rounded w-32" />
                      <div className="h-3 bg-gray-100 rounded w-20" />
                    </div>
                    <div className="h-8 w-20 bg-gray-100 rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featured.map((product) => (
                <Card key={product.id} className="overflow-hidden rounded-2xl">
                  <div className="h-48 bg-gray-50 overflow-hidden">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200">
                        🥙
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {product.price.toFixed(2)} PLN
                      </p>
                    </div>
                    <Link
                      href="/menu"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full shrink-0 text-xs font-bold transition-colors"
                      style={{ background: "#FADADF", color: "#F0147A" }}
                    >
                      Szczegóły
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Kolumna prawa (sidebar) ── */}
      <div className="w-full lg:w-80 lg:shrink-0 flex flex-col gap-4">
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
            className="text-sm font-semibold mt-1"
            style={{ color: "#F0147A" }}
          >
            Dowiedz się więcej →
          </Link>
        </div>

        {/* Znajdź Kebab Queen */}
        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <MapPin size={18} style={{ color: "#F0147A" }} />
            <h3 className="font-bold">Znajdź Kebab Queen</h3>
          </div>
          <p className="text-sm text-gray-400">
            Wyszukaj najbliższą lokalizację
          </p>

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
              <MapPin
                size={28}
                style={{ color: "#F0147A" }}
                className="mx-auto mb-1"
              />
              <p className="text-xs text-gray-500 font-medium">
                Centrum, 1.2km
              </p>
            </div>
          </div>

          <Button variant="primary" size="md" className="w-full gap-2">
            <Navigation size={16} />
            Prowadź do mnie
          </Button>
        </Card>
      </div>
    </div>
  );
}
