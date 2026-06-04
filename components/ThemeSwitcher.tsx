"use client";

import { useEffect, useState } from "react";

type Theme = "rozowy" | "pudrowy" | "fuksja";

const themes: { id: Theme; label: string; color: string; desc: string }[] = [
  { id: "rozowy",  label: "Różowy",  color: "#F0147A", desc: "Klasyczny hot pink" },
  { id: "pudrowy", label: "Pudrowy", color: "#E8769A", desc: "Delikatny pastelowy" },
  { id: "fuksja",  label: "Fuksja",  color: "#D6006E", desc: "Intensywna fuksja" },
];

export default function ThemeSwitcher() {
  const [current, setCurrent] = useState<Theme>("rozowy");

  useEffect(() => {
    const saved = (localStorage.getItem("kq-theme") as Theme) ?? "rozowy";
    setCurrent(saved);
    document.documentElement.dataset.theme = saved === "rozowy" ? "" : saved;
  }, []);

  const apply = (t: Theme) => {
    setCurrent(t);
    localStorage.setItem("kq-theme", t);
    document.documentElement.dataset.theme = t === "rozowy" ? "" : t;
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-gray-700">Stopień Różowości</p>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => apply(t.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
              current === t.id ? "border-current shadow-sm" : "border-gray-100"
            }`}
            style={{ borderColor: current === t.id ? t.color : undefined }}
          >
            <div
              className="w-8 h-8 rounded-full shadow-sm"
              style={{ background: t.color }}
            />
            <div className="text-center">
              <p className="text-xs font-bold text-gray-900">{t.label}</p>
              <p className="text-xs text-gray-400 leading-tight">{t.desc}</p>
            </div>
            {current === t.id && (
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: t.color }}
              >
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
