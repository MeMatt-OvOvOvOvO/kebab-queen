"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useLogin } from "@/hooks/mutations/useLogin";
import { Crown } from "lucide-react";

type FormValues = { phone: string };

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = ({ phone }: FormValues) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 9) {
      setError("phone", { message: "Podaj poprawny numer telefonu (min. 9 cyfr)." });
      return;
    }
    login.mutate(digits, {
      onSuccess: () => router.push("/"),
      onError: () => setError("phone", { message: "Coś poszło nie tak. Spróbuj ponownie." }),
    });
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F8F5F7" }}>

      {/* ── Lewa kolumna — branding ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[520px] shrink-0"
        style={{ background: "linear-gradient(160deg, #F0147A 0%, #C4006A 100%)" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20">
            <Crown size={20} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-xl text-white">
            Kebab <span className="text-white/80">Queen</span>
          </span>
        </Link>

        <div className="flex flex-col gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-white/20">
            <span className="text-4xl">★</span>
          </div>
          <div className="text-white">
            <h2 className="text-4xl font-bold leading-tight mb-3">
              Twoja królewski<br />paszport do smaku
            </h2>
            <p className="text-white/75 text-lg leading-relaxed">
              Zbieraj Kule Mocy przy każdym zamówieniu i wymieniaj je na ekskluzywne nagrody.
            </p>
          </div>
          <div className="flex gap-6">
            {[
              { value: "10k+", label: "Królowych" },
              { value: "7", label: "Poziomów" },
              { value: "24/7", label: "Wsparcie" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-white/60 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/50 text-sm">© 2026 Kebab Queen. Wszelkie prawa zastrzeżone.</p>
      </div>

      {/* ── Prawa kolumna — formularz ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm flex flex-col gap-8">

          <Link href="/" className="flex items-center gap-3 lg:hidden">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "#F0147A" }}
            >
              <Crown size={16} className="text-white" strokeWidth={2} />
            </div>
            <span className="font-bold text-xl">
              <span className="text-gray-900">Kebab</span>{" "}
              <span style={{ color: "#F0147A" }}>Queen</span>
            </span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Witaj, Królowo!</h1>
            <p className="text-gray-500">
              Podaj swój numer telefonu. Jeśli nie masz jeszcze konta — utworzymy je automatycznie.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Numer telefonu
              </label>
              <div
                className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border-2 transition-colors"
                style={{ borderColor: errors.phone ? "#F0147A" : "#E5E7EB" }}
              >
                <span className="text-gray-400 text-sm font-medium shrink-0">+48</span>
                <div className="w-px h-5 bg-gray-200 shrink-0" />
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="123 456 789"
                  autoComplete="tel"
                  autoFocus
                  className="flex-1 outline-none text-base bg-transparent placeholder-gray-300"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-sm font-medium" style={{ color: "#F0147A" }}>
                  {errors.phone.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-3.5 rounded-2xl text-white font-semibold text-base transition-opacity disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #F0147A 0%, #C4006A 100%)" }}
            >
              {login.isPending ? "Logowanie…" : "Zaloguj się"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Logując się, akceptujesz{" "}
            <span className="underline cursor-pointer" style={{ color: "#F0147A" }}>Regulamin</span>
            {" "}oraz{" "}
            <span className="underline cursor-pointer" style={{ color: "#F0147A" }}>Politykę Prywatności</span>.
          </p>

        </div>
      </div>
    </div>
  );
}
