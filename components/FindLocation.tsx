"use client";

import { useState } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";

const LOCATIONS = [
  {
    name: "KQ Wieliczka Centrum",
    address: "ul. Górnicza 12, 32-020 Wieliczka",
    lat: 49.9886,
    lng: 20.0658,
    dist: "1.2 km",
  },
  {
    name: "KQ Wieliczka Galeria",
    address: "ul. Różana 5, 32-020 Wieliczka",
    lat: 49.985,
    lng: 20.071,
    dist: "2.4 km",
  },
];

function mapsUrl(lat: number, lng: number, fromLat?: number, fromLng?: number) {
  if (fromLat && fromLng) {
    return `https://www.google.com/maps/dir/${fromLat},${fromLng}/${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function distKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

export function FindLocationButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      window.open(mapsUrl(LOCATIONS[0].lat, LOCATIONS[0].lng), "_blank");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: uLat, longitude: uLng } = pos.coords;
        // Znajdź najbliższy lokal
        const nearest = LOCATIONS.reduce((a, b) =>
          Number(distKm(uLat, uLng, a.lat, a.lng)) <
          Number(distKm(uLat, uLng, b.lat, b.lng))
            ? a
            : b,
        );
        window.open(mapsUrl(nearest.lat, nearest.lng, uLat, uLng), "_blank");
        setLoading(false);
      },
      () => {
        window.open(mapsUrl(LOCATIONS[0].lat, LOCATIONS[0].lng), "_blank");
        setLoading(false);
      },
      { timeout: 5000 },
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-2xl p-5 flex flex-col items-center gap-2 transition-transform active:scale-95 disabled:opacity-70"
      style={{ background: "linear-gradient(135deg, #F0147A 0%, #FF6DAE 100%)" }}
    >
      {loading ? (
        <Loader2 size={28} className="text-white animate-spin" />
      ) : (
        <MapPin size={28} className="text-white" />
      )}
      <span className="text-white font-bold text-sm">Znajdź lokal</span>
    </button>
  );
}

export function FindLocationSidebar() {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 5000 },
    );
  };

  const locsWithDist = LOCATIONS.map((loc) => ({
    ...loc,
    calcDist: userPos
      ? `${distKm(userPos.lat, userPos.lng, loc.lat, loc.lng)} km`
      : loc.dist,
  }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <MapPin size={18} style={{ color: "#F0147A" }} />
        <h3 className="font-bold">Znajdź Kebab Queen</h3>
      </div>

      {locsWithDist.map((loc) => (
        <a
          key={loc.name}
          href={mapsUrl(
            loc.lat,
            loc.lng,
            userPos?.lat,
            userPos?.lng,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "#FADADF" }}
          >
            <MapPin size={14} style={{ color: "#F0147A" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">{loc.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{loc.address}</p>
          </div>
          <span className="text-xs font-bold shrink-0 mt-1" style={{ color: "#F0147A" }}>
            {loc.calcDist}
          </span>
        </a>
      ))}

      <button
        onClick={locate}
        disabled={locating}
        className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: "#F0147A" }}
      >
        {locating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Navigation size={16} />
        )}
        {locating ? "Szukam…" : "Prowadź do mnie"}
      </button>
    </div>
  );
}
