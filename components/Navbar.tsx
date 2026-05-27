"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle } from "lucide-react";

const links = [
  { href: "/",           label: "Start" },
  { href: "/nagrody",    label: "Nagrody" },
  { href: "/menu",       label: "Menu" },
  { href: "/zamowienia", label: "Zamówienia" },
  { href: "/czat",       label: "Czat AI" },
  { href: "/wsparcie",   label: "Wsparcie" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "#F0147A" }}
          >
            ✕
          </span>
          <span className="font-bold text-lg">
            <span className="text-gray-900">Kebab</span>{" "}
            <span style={{ color: "#F0147A" }}>Queen</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? "text-pink font-semibold bg-pink-light"
                    : "text-gray-600 hover:text-pink hover:bg-pink-light"
                }`}
                style={
                  active
                    ? { color: "#F0147A", background: "#FADADF" }
                    : {}
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Prawa strona */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Kule Mocy badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold"
            style={{ borderColor: "#F5C518", color: "#B8860B" }}
          >
            <span style={{ color: "#F5C518" }}>⊕</span>
            <span>150k Kul Mocy</span>
          </div>

          {/* Avatar */}
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <UserCircle size={32} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
