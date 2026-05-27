export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Logo + opis */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: "#F0147A" }}
              >
                ✕
              </span>
              <span className="font-bold">
                <span className="text-gray-900">Kebab</span>{" "}
                <span style={{ color: "#F0147A" }}>Queen</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Podnosimy street food do rangi królewskiej w całej Polsce.
            </p>
          </div>

          {/* Eksploruj */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm">Eksploruj</h4>
            {["Nasza historia", "Pełne Menu", "Franchising", "Dla prasy"].map((item) => (
              <a key={item} href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Wsparcie */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm">Wsparcie</h4>
            {["Kontakt", "FAQ", "Karty podarunkowe", "Polityka prywatności"].map((item) => (
              <a key={item} href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-sm">Zapisz się do Newslettera</h4>
            <p className="text-sm text-gray-500">
              I uzyskaj 10% zniżki na następne zamówienie
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Adres email"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-pink-400"
              />
              <button
                className="px-4 py-2 rounded-lg text-white text-sm font-semibold shrink-0"
                style={{ background: "#F0147A" }}
              >
                Dołącz
              </button>
            </div>
          </div>
        </div>

        {/* Dolny pasek */}
        <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
              style={{ background: "#ccc" }}
            >
              ✕
            </span>
            <span className="text-sm text-gray-400">Kebab Queen © 2026</span>
          </div>
          <div className="flex gap-6">
            {["Instagram", "TikTok", "Twitter"].map((s) => (
              <a key={s} href="#" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
