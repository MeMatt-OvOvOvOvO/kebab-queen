import Link from "next/link";
import { MapPin, Navigation, Search } from "lucide-react";

// Tymczasowe dane — potem z bazy
const offers = [
  {
    id: 1,
    title: "Specjał Środka Tygodnia",
    badge: "25% TANIEJ",
    description:
      "Odbierz 25% zniżki na wszystkie Platynowe Półmiski w każdy wtorek i środę. Oferta ograniczona czasowo!",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80",
  },
  {
    id: 2,
    title: "Królewska Uczta",
    badge: "GRATIS",
    description:
      "Dodaj porcję frytek truflowych do dowolnego wrapa zupełnie za darmo w ten piątek.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
  },
];

export default function Home() {
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
                Witaj ponownie,<br />Królowo!
              </h1>
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

        {/* Oferty */}
        <div>
          <h2 className="text-xl font-bold mb-4">Ekskluzywne oferty dla Królowej</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Zdjęcie */}
                <div className="h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Treść */}
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base">{offer.title}</h3>
                    <span
                      className="text-sm font-bold shrink-0"
                      style={{ color: "#F0147A" }}
                    >
                      {offer.badge}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {offer.description}
                  </p>
                  <button
                    className="w-full py-2.5 rounded-full text-sm font-semibold transition-colors"
                    style={{ background: "#FADADF", color: "#F0147A" }}
                  >
                    Odbierz ofertę
                  </button>
                </div>
              </div>
            ))}
          </div>
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

          {/* Pole wyszukiwania */}
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

          {/* Placeholder mapy */}
          <div
            className="h-36 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{ background: "#E8E8F0" }}
          >
            <div className="text-center">
              <MapPin size={28} style={{ color: "#F0147A" }} className="mx-auto mb-1" />
              <p className="text-xs text-gray-500 font-medium">Centrum, 1.2km</p>
            </div>
          </div>

          {/* Prowadź do mnie */}
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
          className="rounded-2xl p-5 flex flex-col gap-2 overflow-hidden relative"
          style={{ background: "#1E1B2E" }}
        >
          <p className="text-white font-bold text-lg">Nowość!</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Spróbuj naszych Wrapów Dragon Fire z pikantnym miodem ghost pepper.
          </p>
          <button
            className="text-sm font-semibold mt-1 text-left"
            style={{ color: "#F0147A" }}
          >
            Dowiedz się więcej →
          </button>
        </div>
      </div>
    </div>
  );
}
