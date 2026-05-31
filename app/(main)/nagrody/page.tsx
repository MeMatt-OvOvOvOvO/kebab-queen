"use client";

import { useState } from "react";
import { useRewards } from "@/hooks/queries/useRewards";
import { useRedeemReward } from "@/hooks/mutations/useRedeemReward";
import { useGlobalState } from "@/context/GlobalStateContext";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import {
  UserCircle,
  Star,
  ShoppingBag,
  Trophy,
  ChefHat,
  Truck,
  ShieldCheck,
  Gift,
  PartyPopper,
  Frown,
} from "lucide-react";
import type { Reward } from "@/types/Reward.type";

// --- Tier helpers ---
const TIER_LABELS: Record<number, string> = {
  1: "Brązowa Adeptka",
  2: "Srebrna Gwardia",
  3: "Złota Elita",
  4: "Legendarna Elita",
};

const TIER_NEXT_LABEL: Record<number, string> = {
  1: "Srebrna Gwardia",
  2: "Złota Elita",
  3: "Legendarna Elita",
};

const TIER_THRESHOLD: Record<number, number> = {
  1: 100,
  2: 500,
  3: 2000,
};

function getTierLabel(tier: number) {
  return TIER_LABELS[tier] ?? "Legendarna Elita";
}

function getTierProgress(tier: number, balance: number) {
  const threshold = TIER_THRESHOLD[tier];
  if (!threshold) return 100;
  const prevThreshold = TIER_THRESHOLD[tier - 1] ?? 0;
  return Math.min(
    100,
    Math.max(
      0,
      ((balance - prevThreshold) / (threshold - prevThreshold)) * 100,
    ),
  );
}

function getTierPointsLeft(tier: number, balance: number) {
  const threshold = TIER_THRESHOLD[tier];
  if (!threshold) return null;
  return Math.max(0, threshold - balance);
}

// --- Reward card ---
const PREMIUM_THRESHOLD = 500;

type RedeemResult = { type: "success" | "error"; msg: string };

function RewardCard({
  reward,
  userBalance,
}: {
  reward: Reward;
  userBalance: number;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState<RedeemResult | null>(null);
  const redeem = useRedeemReward();

  const isPremium = reward.pointsCost >= PREMIUM_THRESHOLD;
  const canAfford = userBalance >= reward.pointsCost;
  const missing = reward.pointsCost - userBalance;

  function handleRedeemClick() {
    if (!canAfford) {
      setResult({
        type: "error",
        msg: `Za mało Kul Mocy! Brakuje Ci jeszcze ${missing.toLocaleString("pl-PL")} KM.`,
      });
      return;
    }
    setConfirmOpen(true);
  }

  function handleConfirm() {
    redeem.mutate(reward.id, {
      onSuccess: (data) => {
        setConfirmOpen(false);
        setResult({
          type: "success",
          msg: `Nagroda „${data.reward}" odebrana! Wydano ${data.spent.toLocaleString("pl-PL")} Kul Mocy.`,
        });
      },
      onError: (err: unknown) => {
        setConfirmOpen(false);
        const apiError = err as { response?: { data?: { error?: string } } };
        setResult({
          type: "error",
          msg:
            apiError?.response?.data?.error ?? "Nie udało się odebrać nagrody.",
        });
      },
    });
  }

  const cardContent = isPremium ? (
    <div className="rounded-3xl overflow-hidden flex flex-col bg-navy">
      {/* Image with overlay */}
      <div className="relative h-52 overflow-hidden shrink-0">
        {reward.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reward.imageUrl}
            alt={reward.name}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-navy-muted">
            <Trophy size={56} className="text-gold opacity-60" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="gold">Dostępne dla Złotej Elity</Badge>
        </div>
        {/* Name + cost overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end justify-between bg-linear-to-t from-navy/95 to-transparent">
          <h3 className="text-white font-bold text-base uppercase tracking-wide leading-tight">
            {reward.name}
          </h3>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 bg-gold/25 text-gold">
            <span>{reward.pointsCost.toLocaleString("pl-PL")}</span>
            <Star size={10} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <p className="text-sm italic text-gray-500">Kolekcja mistrzowska</p>
        <p className="text-gray-300 text-sm leading-relaxed">
          {reward.description}
        </p>
        <Button
          variant="gold"
          size="lg"
          className="w-full"
          onClick={handleRedeemClick}
          disabled={redeem.isPending}
        >
          <Trophy size={16} className="mr-2" />
          Odbierz Legendarną Nagrodę
        </Button>
        {!canAfford && (
          <p className="text-center text-xs text-gold/70">
            Brakuje Ci {missing.toLocaleString("pl-PL")} Kul Mocy
          </p>
        )}
      </div>
    </div>
  ) : (
    <Card className="overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden shrink-0 bg-gray-50">
        {reward.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={reward.imageUrl}
            alt={reward.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-pink-pale">
            <Gift size={56} className="text-pink opacity-40" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="pink">Edycja Limitowana</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <h3 className="font-bold text-base flex-1 leading-tight">
            {reward.name}
          </h3>
          <div className="flex items-center gap-1 text-sm font-bold shrink-0 text-gold">
            <span>{reward.pointsCost.toLocaleString("pl-PL")}</span>
            <Star size={13} fill="currentColor" />
          </div>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">
          {reward.description}
        </p>
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleRedeemClick}
          disabled={redeem.isPending}
        >
          <ShoppingBag size={16} className="mr-2" />
          Odbierz nagrodę
        </Button>
        {!canAfford && (
          <p className="text-center text-xs text-gray-400">
            Brakuje Ci {missing.toLocaleString("pl-PL")} Kul Mocy
          </p>
        )}
      </div>
    </Card>
  );

  return (
    <>
      {cardContent}

      {/* Confirm modal */}
      <Modal
        open={confirmOpen}
        onClose={() => !redeem.isPending && setConfirmOpen(false)}
      >
        <div className="p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Odbierz nagrodę?</h2>
          <p className="text-gray-600">
            Wymień{" "}
            <strong>
              {reward.pointsCost.toLocaleString("pl-PL")} Kul Mocy
            </strong>{" "}
            za: <strong>{reward.name}</strong>
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setConfirmOpen(false)}
              disabled={redeem.isPending}
            >
              Anuluj
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleConfirm}
              disabled={redeem.isPending}
            >
              {redeem.isPending ? "Wymieniam…" : "Potwierdź"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Result modal */}
      <Modal open={!!result} onClose={() => setResult(null)}>
        <div className="p-6 flex flex-col gap-4 text-center">
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto ${result?.type === "success" ? "bg-pink-light" : "bg-gray-100"}`}
          >
            {result?.type === "success" ? (
              <PartyPopper size={32} className="text-pink" />
            ) : (
              <Frown size={32} className="text-gray-400" />
            )}
          </div>
          <h2 className="text-xl font-bold">
            {result?.type === "success" ? "Nagroda odebrana!" : "Nie udało się"}
          </h2>
          <p className="text-gray-600">{result?.msg}</p>
          <Button
            variant={result?.type === "success" ? "primary" : "secondary"}
            size="lg"
            onClick={() => setResult(null)}
          >
            {result?.type === "success" ? "Super!" : "Rozumiem"}
          </Button>
        </div>
      </Modal>
    </>
  );
}

// --- Benefits ---
const BENEFITS = [
  {
    title: "Osobisty Mistrz Kebaba",
    desc: "Dostęp do dedykowanego szefa kuchni, który przygotuje Twoje zamówienie według naszej unikalnej receptury.",
    icon: ChefHat,
  },
  {
    title: "Dostawa VIP",
    desc: "Priorytetowa, darmowa dostawa realizowana przez naszych elitarnych kurierów.",
    icon: Truck,
  },
  {
    title: "Gwarancja Smaku",
    desc: "Gwarancja najwyższej jakości składników i satysfakcji przy każdym zamówieniu premium.",
    icon: ShieldCheck,
  },
];

// --- Page ---
export default function NagradyPage() {
  const { user, isLoading: userLoading } = useGlobalState();
  const { data: rewards, isLoading: rewardsLoading } = useRewards();

  const balance = user?.loyalty.balance ?? 0;
  const tier = user?.loyalty.tier ?? 1;
  const nextTierLabel = TIER_NEXT_LABEL[tier] ?? null;
  const pointsLeft = getTierPointsLeft(tier, balance);
  const progress = getTierProgress(tier, balance);

  return (
    <div className="flex flex-col gap-6 md:gap-12">
      {/* ── Mobile: profile header ── */}
      <div className="md:hidden flex flex-col items-center gap-3 pt-2">
        {userLoading ? (
          <div className="w-20 h-20 rounded-full bg-gray-100 animate-pulse" />
        ) : (
          <>
            {/* Avatar with tier border */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-gold">
                <UserCircle
                  size={52}
                  strokeWidth={1.2}
                  className="text-gray-300"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap bg-gold text-gold-dark">
                {getTierLabel(tier)}
              </div>
            </div>

            {/* Name + balance */}
            <div className="mt-4 text-center flex flex-col gap-1">
              <p className="font-bold text-xl">
                {user?.name ?? user?.phone ?? "Gość"}
              </p>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-gold text-lg">⊕</span>
                <span className="text-xl font-extrabold text-pink">
                  {balance.toLocaleString("pl-PL")} Kul Mocy
                </span>
              </div>
            </div>

            {/* Tier progress hint */}
            {nextTierLabel && pointsLeft !== null && (
              <p className="text-sm text-gray-500 text-center max-w-xs leading-relaxed">
                Jesteś w elicie! Zostało jeszcze{" "}
                <strong>{pointsLeft.toLocaleString("pl-PL")}</strong> punktów do
                poziomu <strong className="text-pink">{nextTierLabel}</strong>.
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Desktop: hero + loyalty widget ── */}
      <div className="hidden md:grid md:grid-cols-[1fr_300px] gap-8 items-start">
        {/* Hero text */}
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-5xl font-bold leading-tight text-gray-900">
              Witaj w
            </h1>
            <h1 className="text-5xl font-extrabold leading-tight text-pink">
              Królewskim skarbcu
            </h1>
          </div>
          <p className="text-gray-500 text-lg max-w-md leading-relaxed">
            Odblokuj wyjątkowe nagrody i profesjonalny sprzęt kulinarny.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="primary" size="lg" href="#nagrody">
              Odkryj Nagrody
            </Button>
            <Button variant="secondary" size="lg" href="#korzysci">
              Korzyści Członkowskie
            </Button>
          </div>
        </div>

        {/* Loyalty widget */}
        <Card padding="md" className="shrink-0">
          {userLoading ? (
            <div className="flex flex-col gap-3 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-7 bg-gray-100 rounded w-3/4" />
              <div className="h-2 bg-gray-100 rounded" />
              <div className="h-4 bg-gray-100 rounded w-full" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                    Aktualny Poziom
                  </p>
                  <p className="text-2xl font-extrabold mt-0.5 text-gold">
                    {getTierLabel(tier)}
                  </p>
                </div>
                <span className="text-gold">
                  <Star size={28} className="mt-1 opacity-50" />
                </span>
              </div>

              {nextTierLabel && pointsLeft !== null && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Następny Milowy Krok</span>
                    <span className="font-semibold text-pink">
                      {nextTierLabel}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-bg-subtle">
                    <div
                      className="h-full rounded-full transition-all bg-linear-to-r from-pink to-gold"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Zostało tylko{" "}
                    <strong>{pointsLeft.toLocaleString("pl-PL")}</strong>{" "}
                    punktów do Poziomu Legendarnego
                  </p>
                </>
              )}

              {user && (
                <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold bg-gold-pale text-gold-warm">
                  <span className="text-gold">⊕</span>
                  <span>{balance.toLocaleString("pl-PL")} Kul Mocy</span>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* ── Rewards section ── */}
      <section id="nagrody" className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              Wyróżnione <span className="text-pink">Nagrody</span>
            </h2>
            <p className="text-gray-500 text-sm mt-0.5 hidden md:block">
              Starannie dobrane luksusowe przedmioty dla Twojego poziomu
            </p>
          </div>
        </div>

        {rewardsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-100" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-5 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-12 bg-gray-100 rounded-2xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : rewards?.length === 0 ? (
          <div className="text-center py-16 text-gray-400 flex flex-col items-center gap-3">
            <Gift size={48} className="opacity-40" />
            <p className="font-medium">Brak dostępnych nagród.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {rewards?.map((reward: Reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userBalance={balance}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Benefits section (desktop only) ── */}
      <section id="korzysci" className="hidden md:grid md:grid-cols-3 gap-6">
        {BENEFITS.map(({ title, desc, icon: Icon }) => (
          <Card
            key={title}
            padding="md"
            className="flex flex-col items-center text-center gap-3"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-pink-light">
              <Icon size={30} className="text-pink" />
            </div>
            <h3 className="font-bold text-base">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
