"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UtensilsCrossed,
  QrCode,
  Gift,
  ClipboardList,
} from "lucide-react";

const leftTabs = [
  { href: "/", label: "Start", icon: Home },
  { href: "/nagrody", label: "Nagrody", icon: Gift },
];

const rightTabs = [
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/zamowienia", label: "Zamówienia", icon: ClipboardList },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Elevated center button — osobny fixed element, z-index wyższy niż pasek */}
      <Link
        href="/karta"
        className="fixed bottom-8 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-51 md:hidden transition-transform active:scale-95  border-white border-4 shadow-pink/30"
        style={{
          background: "linear-gradient(135deg, #F0147A 0%, #FF6DAE 100%)",
        }}
        aria-label="Karta lojalnościowa"
      >
        <QrCode size={24} className="text-white" strokeWidth={1.8} />
      </Link>

      {/* Pasek nawigacji */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:hidden">
        <div className="flex items-center h-16 max-w-lg mx-auto px-2">
          {leftTabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 flex-1 py-3 text-xs transition-colors ${
                  active ? "text-pink" : "text-gray-400"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}

          {/* Puste miejsce na środkowy button */}
          <div className="flex-1" />

          {rightTabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 flex-1 py-3 text-xs transition-colors ${
                  active ? "text-pink" : "text-gray-400"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
