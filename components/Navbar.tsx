"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { UserCircle, LogIn, LogOut, Star } from "lucide-react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useLogout } from "@/hooks/mutations/useLogout";

const links = [
  { href: "/", label: "Start" },
  { href: "/nagrody", label: "Nagrody" },
  { href: "/menu", label: "Menu" },
  { href: "/zamowienia", label: "Zamówienia" },
  { href: "/czat", label: "Czat AI" },
  { href: "/wsparcie", label: "Wsparcie" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, setUser } = useGlobalState();
  const logout = useLogout();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout.mutate(undefined, {
      onSuccess: () => {
        setUser(null);
        router.push("/login");
      },
    });
  };

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
                  active ? { color: "#F0147A", background: "#FADADF" } : {}
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
          {isLoading ? (
            <div
              className="h-8 w-36 rounded-full animate-pulse"
              style={{ background: "#F5E9A0" }}
            />
          ) : (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold"
              style={{ borderColor: "#F5C518", color: "#B8860B" }}
            >
              <span style={{ color: "#F5C518" }}>⊕</span>
              <span>
                {user
                  ? `${user.loyalty.balance.toLocaleString("pl-PL")} Kul Mocy`
                  : "Zaloguj się"}
              </span>
            </div>
          )}

          {/* Avatar + dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Menu użytkownika"
            >
              <UserCircle size={32} strokeWidth={1.5} />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name ?? user.phone}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={12} style={{ color: "#F5C518" }} />
                        <p className="text-xs text-gray-500">
                          Poziom {user.loyalty.tier} &middot;{" "}
                          {user.loyalty.balance.toLocaleString("pl-PL")} KM
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={logout.isPending}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <LogOut size={16} className="text-gray-400" />
                      {logout.isPending ? "Wylogowywanie…" : "Wyloguj się"}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors"
                    style={{ color: "#F0147A" }}
                  >
                    <LogIn size={16} />
                    Zaloguj się
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
