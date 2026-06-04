"use client";

import { useEffect, useState } from "react";
import { useHappyHours } from "@/hooks/queries/useHappyHours";
import { Zap } from "lucide-react";

function useCountdown(endHour: number | null, endMin: number | null) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (endHour === null || endMin === null) return;

    const tick = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(endHour, endMin ?? 0, 0, 0);
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) { setTimeLeft(""); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${String(s).padStart(2, "0")}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endHour, endMin]);

  return timeLeft;
}

export default function HappyHoursBanner() {
  const { data } = useHappyHours();
  const timeLeft = useCountdown(
    data?.active?.endHour ?? null,
    data?.active?.endMin ?? null,
  );

  if (!data?.active) return null;

  return (
    <div
      className="rounded-2xl px-5 py-4 flex items-center justify-between gap-4"
      style={{ background: "linear-gradient(135deg, #1E1B2E 0%, #3D1A4F 100%)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "#F0147A" }}
        >
          <Zap size={18} className="text-white" fill="white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-white font-bold text-sm">⚡ Happy Hours!</p>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: "#F0147A", color: "white" }}
            >
              ×{data.active.multiplier}
            </span>
          </div>
          <p className="text-gray-300 text-xs mt-0.5">
            {data.active.label ?? `1 zł = ${data.active.multiplier * 4} Kul Mocy`}
          </p>
        </div>
      </div>
      {timeLeft && (
        <div className="text-right shrink-0">
          <p className="text-gray-400 text-xs mb-0.5">kończy się za</p>
          <p className="text-white font-bold text-lg font-mono">{timeLeft}</p>
        </div>
      )}
    </div>
  );
}
