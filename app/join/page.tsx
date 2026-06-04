"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function JoinInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const ref = params.get("ref");
    if (ref) {
      document.cookie = `kq_ref=${ref}; path=/; max-age=${60 * 60 * 24 * 7}`;
    }
    router.replace("/login");
  }, [params, router]);

  return null;
}

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8F5F7" }}>
    <div className="text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: "#F0147A" }}
      >
        <span className="text-white text-3xl">👑</span>
      </div>
      <p className="font-semibold text-gray-700">Przekierowuję do logowania…</p>
    </div>
  </div>
);

export default function JoinPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Loader />
      <JoinInner />
    </Suspense>
  );
}
