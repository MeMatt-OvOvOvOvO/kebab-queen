"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Search, Plus, CheckCircle, AlertCircle, Star, Crown } from "lucide-react";
import apiClient from "@/lib/apiClient";

type FoundUser = { id: string; phone: string; name: string | null; balance: number; tier: number };
type PointsForm = { amount: number; description: string };

function tierLabel(tier: number) {
  if (tier >= 4) return "Diamentowa Królowa";
  if (tier === 3) return "Złota Elita";
  if (tier === 2) return "Srebrna Gwardia";
  return "Brązowa Adeptka";
}

export default function AdminPage() {
  const [phone, setPhone] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null);
  const [searchError, setSearchError] = useState("");
  const [result, setResult] = useState<{ earned: number; multiplier: number } | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PointsForm>({
    defaultValues: { amount: 0, description: "Zakup" },
  });

  const handleSearch = async () => {
    if (phone.replace(/\D/g, "").length < 9) {
      setSearchError("Podaj poprawny numer (min. 9 cyfr)");
      return;
    }
    setSearching(true);
    setSearchError("");
    setFoundUser(null);
    setResult(null);
    try {
      const { data } = await apiClient.get<FoundUser>(`/admin/find-user?phone=${phone.replace(/\s/g, "")}`);
      setFoundUser(data);
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : "Nie znaleziono użytkownika");
    } finally {
      setSearching(false);
    }
  };

  const onAddPoints = async (values: PointsForm) => {
    if (!foundUser) return;
    try {
      const { data } = await apiClient.post<{ earned: number; multiplier: number }>("/transactions", {
        userId: foundUser.id,
        points: Number(values.amount),
        description: values.description || "Zakup",
      });
      setResult(data);
      setFoundUser({ ...foundUser, balance: foundUser.balance + data.earned });
      reset({ amount: 0, description: "Zakup" });
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Błąd przy dodawaniu punktów");
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-16 px-4" style={{ background: "#F8F5F7" }}>
      <div className="w-full max-w-md flex flex-col gap-6">

        {/* Nagłówek */}
        <div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "#F0147A" }}
          >
            <Crown size={22} className="text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Panel Kasjera</h1>
          <p className="text-gray-500 text-sm mt-1">Znajdź klienta i nabij Kule Mocy</p>
        </div>

        {/* Wyszukiwarka */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-700">Numer telefonu klienta</label>
          <div className="flex gap-2">
            <div
              className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border-2 transition-colors"
              style={{ borderColor: searchError ? "#F0147A" : "#E5E7EB" }}
            >
              <span className="text-gray-400 text-sm shrink-0">+48</span>
              <div className="w-px h-4 bg-gray-200" />
              <input
                type="tel"
                inputMode="numeric"
                placeholder="123 456 789"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setSearchError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 outline-none text-sm bg-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-4 py-3 rounded-xl text-white font-semibold flex items-center gap-2 transition-opacity disabled:opacity-60"
              style={{ background: "#F0147A" }}
            >
              <Search size={16} />
              {searching ? "…" : "Szukaj"}
            </button>
          </div>
          {searchError && (
            <p className="text-sm flex items-center gap-1" style={{ color: "#F0147A" }}>
              <AlertCircle size={14} /> {searchError}
            </p>
          )}
        </div>

        {/* Znaleziony klient */}
        {foundUser && (
          <>
            <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#FADADF" }}
              >
                <span className="text-lg font-bold" style={{ color: "#F0147A" }}>
                  {(foundUser.name ?? foundUser.phone).charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900">{foundUser.name ?? foundUser.phone}</p>
                <p className="text-xs text-gray-500">{tierLabel(foundUser.tier)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-lg" style={{ color: "#B8860B" }}>
                  {foundUser.balance.toLocaleString("pl-PL")}
                </p>
                <p className="text-xs text-gray-400">Kul Mocy</p>
              </div>
            </div>

            {/* Formularz punktów */}
            <form onSubmit={handleSubmit(onAddPoints)} className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-gray-900">Dodaj Kule Mocy</h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Liczba punktów</label>
                <input
                  type="number"
                  min={1}
                  placeholder="np. 50"
                  className="px-4 py-3 rounded-xl border-2 border-gray-200 text-base outline-none focus:border-pink-400 transition-colors"
                  {...register("amount", {
                    required: "Podaj liczbę punktów",
                    min: { value: 1, message: "Minimum 1 punkt" },
                  })}
                />
                {errors.amount && (
                  <p className="text-xs" style={{ color: "#F0147A" }}>{errors.amount.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Opis (opcjonalnie)</label>
                <input
                  type="text"
                  placeholder="np. Kebab klasyczny"
                  className="px-4 py-3 rounded-xl border-2 border-gray-200 text-base outline-none focus:border-pink-400 transition-colors"
                  {...register("description")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #F0147A 0%, #C4006A 100%)" }}
              >
                <Plus size={18} />
                {isSubmitting ? "Dodawanie…" : "Nabij punkty"}
              </button>
            </form>
          </>
        )}

        {/* Sukces */}
        {result && (
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: "#F0FFF4", border: "1.5px solid #86EFAC" }}
          >
            <CheckCircle size={28} className="text-green-500 shrink-0" />
            <div>
              <p className="font-bold text-green-800">Punkty nabite!</p>
              <p className="text-sm text-green-700">
                +{result.earned} Kul Mocy
                {result.multiplier > 1 && (
                  <span className="ml-1 font-bold">
                    (×{result.multiplier} Happy Hours! 🎉)
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 pb-8">
          Panel dostępny tylko dla pracowników Kebab Queen 👑
        </p>
      </div>
    </div>
  );
}
