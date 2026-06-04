"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  UserCircle,
  LogOut,
  Star,
  X,
  MessageCircle,
  LifeBuoy,
  ArrowRight,
  QrCode,
  Wallet,
  Gift,
  Crown,
} from "lucide-react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { useLogout } from "@/hooks/mutations/useLogout";

const desktopLinks = [
  { href: "/", label: "Start" },
  { href: "/nagrody", label: "Nagrody" },
  { href: "/menu", label: "Menu" },
  { href: "/zamowienia", label: "Zamówienia" },
  { href: "/czat", label: "Czat AI" },
  { href: "/wsparcie", label: "Wsparcie" },
];

function tierLabel(tier: number): string {
  if (tier >= 4) return "Diamentowa Królowa";
  if (tier === 3) return "Złota Elita";
  if (tier === 2) return "Srebrna Gwardia";
  return "Brązowa Adeptka";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, setUser } = useGlobalState();
  const logout = useLogout();

  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDesktopDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setProfileDrawerOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setDesktopDropdownOpen(false);
    setProfileDrawerOpen(false);
    logout.mutate(undefined, {
      onSuccess: () => {
        setUser(null);
        router.push("/login");
      },
    });
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "#F0147A" }}
            >
              <Crown size={16} className="text-white" strokeWidth={2} />
            </span>
            <span className="font-bold text-lg">
              <span className="text-gray-900">Kebab</span>{" "}
              <span style={{ color: "#F0147A" }}>Queen</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {desktopLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "font-semibold"
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

          {/* Right side */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Kule Mocy badge — desktop only */}
            <div className="hidden md:block">
              {isLoading ? (
                <div
                  className="h-8 w-36 rounded-full animate-pulse"
                  style={{ background: "#F5E9A0" }}
                />
              ) : user ? (
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold"
                  style={{ borderColor: "#F5C518", color: "#B8860B" }}
                >
                  <span style={{ color: "#F5C518" }}>⊕</span>
                  <span>{user.loyalty.balance.toLocaleString("pl-PL")} Kul Mocy</span>
                </div>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ borderColor: "#F0147A", color: "#F0147A" }}
                >
                  <ArrowRight size={14} />
                  <span>Zaloguj się</span>
                </button>
              )}
            </div>

            {/* Desktop avatar + dropdown */}
            <div ref={dropdownRef} className="relative hidden md:block">
              <button
                onClick={() => setDesktopDropdownOpen((v) => !v)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Menu użytkownika"
              >
                <UserCircle size={32} strokeWidth={1.5} />
              </button>

              {desktopDropdownOpen && (
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
                            {tierLabel(user.loyalty.tier)} &middot;{" "}
                            {user.loyalty.balance.toLocaleString("pl-PL")} KM
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/portfel"
                        onClick={() => setDesktopDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Wallet size={16} className="text-gray-400" />
                        Portfel Kul Mocy
                      </Link>
                      <Link
                        href="/zaproszenia"
                        onClick={() => setDesktopDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Gift size={16} className="text-gray-400" />
                        Zaproś koleżankę
                      </Link>
                      <Link
                        href="/karta"
                        onClick={() => setDesktopDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        <QrCode size={16} className="text-gray-400" />
                        Moja karta QR
                      </Link>
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
                    <button
                      onClick={() => {
                        setDesktopDropdownOpen(false);
                        router.push("/login");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium"
                      style={{ color: "#F0147A" }}
                    >
                      <ArrowRight size={16} />
                      Zaloguj się
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile: UserCircle otwiera panel profilu */}
            <button
              onClick={() => setProfileDrawerOpen(true)}
              className="md:hidden text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Otwórz profil"
            >
              <UserCircle size={30} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile profile drawer overlay */}
      <aside
        className={`fixed inset-0 bg-black/40 z-52 md:hidden transition-opacity duration-300  ${
          profileDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setProfileDrawerOpen(false)}
      />

      {/* Mobile profile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-53 shadow-2xl flex flex-col md:hidden transform transition-transform duration-300 ${
          profileDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
          <span className="font-bold text-sm text-gray-500 uppercase tracking-wide">
            Moje konto
          </span>
          <button
            onClick={() => setProfileDrawerOpen(false)}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Zamknij"
          >
            <X size={22} />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-5 border-b border-gray-100 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0"
                style={{ borderColor: "#F0147A" }}
              >
                <UserCircle
                  size={28}
                  strokeWidth={1.5}
                  className="text-gray-400"
                />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">
                  {user.name ?? user.phone}
                </p>
                <p className="text-sm font-medium" style={{ color: "#F0147A" }}>
                  {tierLabel(user.loyalty.tier)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span style={{ color: "#F5C518", fontSize: "13px" }}>⊕</span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#B8860B" }}
                  >
                    {user.loyalty.balance.toLocaleString("pl-PL")} Kul Mocy
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <UserCircle
                  size={28}
                  strokeWidth={1.5}
                  className="text-gray-300"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Gość</p>
                <p className="text-xs text-gray-400">
                  Zaloguj się, by zbierać Kule Mocy
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Secondary links */}
        <div className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          <Link
            href="/portfel"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Wallet size={18} style={{ color: "#F0147A" }} />
            Portfel Kul Mocy
          </Link>
          <Link
            href="/zaproszenia"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Gift size={18} style={{ color: "#F0147A" }} />
            Zaproś koleżankę
          </Link>
          <Link
            href="/karta"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <QrCode size={18} style={{ color: "#F0147A" }} />
            Moja karta QR
          </Link>
          <div className="h-px bg-gray-100 my-1" />
          <Link
            href="/czat"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <MessageCircle size={18} className="text-gray-400" />
            Czat AI
          </Link>
          <Link
            href="/wsparcie"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LifeBuoy size={18} className="text-gray-400" />
            Wsparcie
          </Link>
        </div>

        {/* Login / Logout */}
        <div className="px-3 py-4 border-t border-gray-100 shrink-0">
          {user ? (
            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <LogOut size={16} />
              {logout.isPending ? "Wylogowywanie…" : "Wyloguj się"}
            </button>
          ) : (
            <button
              onClick={() => {
                setProfileDrawerOpen(false);
                router.push("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ color: "#F0147A" }}
            >
              <ArrowRight size={16} />
              Zaloguj się
            </button>
          )}
        </div>
      </div>
    </>
  );
}
