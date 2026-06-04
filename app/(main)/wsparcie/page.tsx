import Link from "next/link";
import { Mail, MessageCircle, MapPin, Clock, ChevronRight } from "lucide-react";

const faq = [
  {
    q: "Jak nabić Kule Mocy?",
    a: "Pokaż kasjerowi swoją kartę QR przed zamówieniem. Kasjer ją zeskanuje i naliczy punkty za zakup.",
  },
  {
    q: "Ile Kul Mocy dostaję za zakup?",
    a: "Standardowo 4 Kule Mocy za każdą złotówkę. W Happy Hours mnożnik może wynosić nawet ×2!",
  },
  {
    q: "Jak wymienić punkty na nagrodę?",
    a: 'Przejdź do sekcji "Nagrody", wybierz produkt i kliknij "Wymień". Pokaż kasjerowi potwierdzenie.',
  },
  {
    q: "Co to są poziomy lojalności?",
    a: "Im więcej Kul Mocy zbierzesz, tym wyższy poziom (1–7 gwiazdek). Wyższy poziom = ekskluzywne oferty.",
  },
  {
    q: "Jak działa system poleceń?",
    a: 'Wejdź w "Zaproś koleżankę", skopiuj swój link i wyślij znajomej. Gdy się zarejestruje, obie dostajecie po 20 KM.',
  },
  {
    q: "Zapomniałam numeru telefonu — co robić?",
    a: "Skontaktuj się z nami mailowo lub przyjdź do lokalu. Pomożemy odzyskać dostęp do konta.",
  },
];

export default function WsparciePage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wsparcie</h1>
        <p className="text-gray-500 text-sm mt-1">Jak możemy Ci pomóc, Królowo?</p>
      </div>

      {/* Kontakt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="mailto:kontakt@kebabqueen.pl"
          className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#FADADF" }}>
            <Mail size={22} style={{ color: "#F0147A" }} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Email</p>
            <p className="text-xs text-gray-400 mt-0.5">kontakt@kebabqueen.pl</p>
          </div>
        </a>

        <Link
          href="/czat"
          className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "#FADADF" }}>
            <MessageCircle size={22} style={{ color: "#F0147A" }} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">AI Queen</p>
            <p className="text-xs text-gray-400 mt-0.5">Czatbot 24/7</p>
          </div>
        </Link>
      </div>

      {/* Godziny */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Clock size={18} style={{ color: "#F0147A" }} />
          <h2 className="font-bold text-gray-900">Godziny otwarcia</h2>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { day: "Poniedziałek – Czwartek", hours: "11:00 – 22:00" },
            { day: "Piątek – Sobota", hours: "11:00 – 23:00" },
            { day: "Niedziela", hours: "12:00 – 21:00" },
          ].map(({ day, hours }) => (
            <div key={day} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600">{day}</span>
              <span className="text-sm font-semibold text-gray-900">{hours}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lokalizacje */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <MapPin size={18} style={{ color: "#F0147A" }} />
          <h2 className="font-bold text-gray-900">Nasze lokale</h2>
        </div>
        {[
          { name: "Kebab Queen Wieliczka Centrum", address: "ul. Górnicza 12, 32-020 Wieliczka" },
          { name: "Kebab Queen Wieliczka Galeria", address: "ul. Różana 5, 32-020 Wieliczka" },
        ].map(({ name, address }) => (
          <div key={name} className="flex items-start gap-3 py-1.5 border-b border-gray-50 last:border-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#FADADF" }}>
              <MapPin size={14} style={{ color: "#F0147A" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{address}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Najczęstsze pytania</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {faq.map(({ q, a }) => (
            <details key={q} className="group px-5 py-4 cursor-pointer">
              <summary className="flex items-center justify-between gap-3 list-none">
                <span className="font-medium text-sm text-gray-900">{q}</span>
                <ChevronRight size={16} className="text-gray-400 shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <p className="text-sm text-gray-500 leading-relaxed mt-3">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
