"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/queries/useProducts";
import { useGlobalState } from "@/context/GlobalStateContext";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import type { Product } from "@/types/Product.type";

type Filter = { label: string; tag: string | null };

const FILTERS: Filter[] = [
  { label: "Wszystkie",      tag: null },
  { label: "Wegetariańskie", tag: "WEGE" },
  { label: "Ostre",          tag: "OSTRE" },
  { label: "Bez glutenu",    tag: "BEZ_GLUTENU" },
  { label: "Frytki z serem", tag: "FRYTKI_Z_SEREM" },
];

const TAG_BADGE: Record<string, { label: string; variant: "wege" | "hot" | "gluten" | "pink" }> = {
  WEGE:          { label: "Wege",        variant: "wege" },
  OSTRE:         { label: "Ostre",       variant: "hot" },
  BEZ_GLUTENU:   { label: "Bez glutenu", variant: "gluten" },
  FRYTKI_Z_SEREM:{ label: "Frytki z serem", variant: "pink" },
};

const STEPS_PER_KCAL = 1.3; // ~1.3 kroków/kcal przy średnim kroku 0.8m

function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden flex flex-col cursor-pointer group" onClick={() => setOpen(true)}>
        <div className="relative h-44 bg-gray-50 shrink-0 overflow-hidden">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">🥙</div>
          )}
          {product.tags.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {product.tags.map((tag) =>
                TAG_BADGE[tag] ? (
                  <Badge key={tag} variant={TAG_BADGE[tag].variant}>
                    {TAG_BADGE[tag].label}
                  </Badge>
                ) : null
              )}
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col gap-2 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base leading-tight">{product.name}</h3>
            <span className="text-sm font-bold shrink-0 text-gray-800">
              {product.price.toFixed(2)} PLN
            </span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-xs text-gray-400">{product.calories} kcal</span>
            <span className="text-xs font-medium" style={{ color: "#F0147A" }}>Zobacz więcej →</span>
          </div>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)}>
        {product.imageUrl && (
          <div className="h-56 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">{product.name}</h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {product.tags.map((tag) =>
                  TAG_BADGE[tag] ? (
                    <Badge key={tag} variant={TAG_BADGE[tag].variant}>
                      {TAG_BADGE[tag].label}
                    </Badge>
                  ) : null
                )}
              </div>
            </div>
            <span className="text-2xl font-bold shrink-0" style={{ color: "#F0147A" }}>
              {product.price.toFixed(2)} PLN
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-3 text-center" style={{ background: "#F8F5F7" }}>
              <p className="text-2xl font-bold text-gray-800">{product.calories}</p>
              <p className="text-xs text-gray-500 mt-0.5">kcal</p>
            </div>
            <div className="rounded-2xl p-3 text-center" style={{ background: "#F8F5F7" }}>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(product.calories * STEPS_PER_KCAL).toLocaleString("pl-PL")}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">kroków do spalenia</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function MenuPage() {
  const { user } = useGlobalState();
  const { data: products, isLoading } = useProducts();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = activeFilter
    ? products?.filter((p) => p.isAvailable && p.tags.includes(activeFilter))
    : products?.filter((p) => p.isAvailable);

  return (
    <div className="flex flex-col gap-6">

      {/* Nagłówek */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Królewskie <span style={{ color: "#F0147A" }}>Menu</span>
          </h1>
          <p className="text-gray-500 mt-1">
            Ręcznie robione kebaby z najwyższej jakości składników.
          </p>
        </div>

        {user?.loyalty && (
          <Card padding="sm" className="shrink-0 min-w-56">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500 font-medium">TWÓJ POSTĘP</span>
              <span className="font-bold" style={{ color: "#F0147A" }}>
                {user.loyalty.balance.toLocaleString("pl-PL")} ⊕
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  background: "linear-gradient(90deg, #F0147A, #FF6DAE)",
                  width: `${Math.min(100, (user.loyalty.balance / 1000) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Masz możliwość odebrania wybranej nagrody!
            </p>
          </Card>
        )}
      </div>

      {/* Filtry */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map(({ label, tag }) => {
          const active = activeFilter === tag;
          return (
            <button
              key={label}
              onClick={() => setActiveFilter(tag)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={
                active
                  ? { background: "#F0147A", color: "#fff" }
                  : { background: "#fff", color: "#374151", border: "1px solid #E5E7EB" }
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Siatka produktów */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-100" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🥙</div>
          <p className="font-medium">Brak produktów w tej kategorii.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
