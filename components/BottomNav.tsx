"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, QrCode, Gift, MessageCircle } from "lucide-react";

const tabs = [
  { href: "/",        label: "Główna",  icon: Home },
  { href: "/menu",    label: "Menu",    icon: UtensilsCrossed },
  { href: "/karta",   label: "Karta",   icon: QrCode },
  { href: "/nagrody", label: "Nagrody", icon: Gift },
  { href: "/czat",    label: "AI Queen",icon: MessageCircle },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-light z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 flex-1 py-2 text-xs transition-colors ${
                active ? "text-pink-dark" : "text-gray-400"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
