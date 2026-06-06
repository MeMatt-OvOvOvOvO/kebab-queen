import { prisma } from "@/lib/db";

export type QueenLocation = {
  name: string;
  address: string;
  hours: string;
  lat: number;
  lng: number;
};

/** Hardkodowane lokalizacje Kebab Queen w okolicach Wieliczki. */
export const LOCATIONS: QueenLocation[] = [
  {
    name: "Kebab Queen — Rynek Górny",
    address: "Rynek Górny 12, 32-020 Wieliczka",
    hours: "pn-czw 10:00–22:00, pt-sb 10:00–02:00, nd 11:00–22:00",
    lat: 49.9874,
    lng: 20.0644,
  },
  {
    name: "Kebab Queen — Kopalnia",
    address: "ul. Dembowskiego 2, 32-020 Wieliczka",
    hours: "codziennie 10:00–24:00",
    lat: 49.9831,
    lng: 20.0556,
  },
  {
    name: "Kebab Queen — Park Kingi",
    address: "ul. Kościuszki 41, 32-020 Wieliczka",
    hours: "pn-nd 11:00–23:00",
    lat: 49.9902,
    lng: 20.0598,
  },
  {
    name: "Kebab Queen — Kraków Bieżanów",
    address: "ul. Bieżanowska 100, 30-826 Kraków",
    hours: "pn-nd 10:00–24:00",
    lat: 50.0192,
    lng: 20.0421,
  },
];

/** Najczęstsze pytania — wiedza ogólna, której nie ma w bazie produktów. */
export const FAQ = `Program lojalnościowy: za zakupy zbierasz Kule Mocy (KM). 1 zł = 1 KM (a w Happy Hours nawet 1 zł = 8 KM). KM wymieniasz na nagrody w zakładce Nagrody. Poziomy lojalności: od Brązowej Adeptki, przez Srebrną Gwardię i Złotą Elitę, po Diamentową Królową.
Happy Hours: każdego dnia 12:00–14:00 naliczamy podwójne KM (Lunch Queen), a w piątki 20:00–23:00 potrójne KM.
Płatności: gotówka, karta, BLIK.
Polecenia: za zaproszenie koleżanki przez link obie strony dostają po 20 KM.
Alergeny ogólne: pita i tortilla zawierają gluten (mamy też opcję bezglutenową w ryżowej tortilli). Sosy czosnkowy i jogurtowy zawierają nabiał. Sos tahini zawiera sezam. W kuchni używamy orzechów i glutenu, więc o ślady tych składników pytaj obsługę przy kasie.`;

type Opts = {
  userName?: string | null;
  coords?: { lat: number; lng: number } | null;
};

/** Buduje system prompt dla AI Queen na podstawie aktualnego menu z bazy + FAQ + lokalizacji. */
export async function buildSystemPrompt(opts: Opts = {}): Promise<string> {
  const products = await prisma.product.findMany({
    where: { isAvailable: true },
    orderBy: { name: "asc" },
  });

  const menu = products
    .map((p) => {
      const tags = (JSON.parse(p.tags) as string[]).join(", ") || "brak";
      return `- ${p.name} — ${p.price.toFixed(2)} zł, ${p.calories} kcal, tagi: ${tags}. ${p.description}`;
    })
    .join("\n");

  const locations = LOCATIONS.map(
    (l) => `- ${l.name}, ${l.address} (godziny: ${l.hours}) [${l.lat}, ${l.lng}]`,
  ).join("\n");

  const greeting = opts.userName
    ? `Rozmawiasz z zalogowaną klientką o imieniu ${opts.userName}.`
    : `Rozmawiasz z klientką (gość lub zalogowana).`;

  const geo = opts.coords
    ? `Klientka udostępniła lokalizację GPS: [${opts.coords.lat}, ${opts.coords.lng}]. Gdy pyta o najbliższą Queen, policz najbliższy punkt z listy lokalizacji (na podstawie współrzędnych) i podaj go w pierwszej kolejności, z adresem i godzinami.`
    : `Klientka NIE udostępniła lokalizacji GPS. Gdy pyta o najbliższą Queen, wymień dostępne lokalizacje z adresami i godzinami i zaproponuj udostępnienie lokalizacji dla dokładniejszej odpowiedzi.`;

  return `Jesteś "AI Queen" — doradczynią smaku i konsjerżką sieci kebabów Kebab Queen z Wieliczki. Mówisz po polsku, ciepło i z lekkim, królewskim charakterem (bez przesady i bez emoji-spamu). ${greeting}

Twoje zadania:
1. Doradzasz w wyborze dania na podstawie intencji smakowych klientki (np. "coś lekkiego", "bez cebuli", "ostre", "wegetariańskie", "bezglutenowe", "na kaca"). Dobieraj pozycje z MENU poniżej i krótko uzasadniaj.
2. Odpowiadasz na pytania o składniki, alergeny i wartości odżywcze WYŁĄCZNIE na podstawie poniższych danych. Jeśli czegoś nie ma w danych (np. dokładny skład sosu) — powiedz, że najlepiej dopytać obsługę przy kasie. Nie zmyślaj kalorii, cen ani składników.
3. Odpowiadasz na pytanie "Gdzie najbliższa Queen?". ${geo}
4. Tłumaczysz program Kule Mocy, Happy Hours i nagrody na podstawie sekcji FAQ.

Zasady: Odpowiadaj zwięźle (zwykle 1–4 zdania), konkretnie i bez ujawniania swojego toku rozumowania. Trzymaj się tematu Kebab Queen. Ceny podawaj w zł.

=== MENU (aktualne, z bazy) ===
${menu}

=== FAQ ===
${FAQ}

=== LOKALIZACJE ===
${locations}`;
}

/**
 * Zapasowa, deterministyczna odpowiedź na wypadek braku klucza ANTHROPIC_API_KEY.
 * Dopasowuje proste słowa kluczowe do wiedzy z bazy/FAQ/lokalizacji — żeby czat
 * działał w trybie demo bez prawdziwego modelu.
 */
export async function buildMockReply(
  userText: string,
  opts: Opts = {},
): Promise<string> {
  const t = userText.toLowerCase();
  const hello = opts.userName ? ` ${opts.userName}` : "";

  // Lokalizacje
  if (/(najbli|gdzie|lokal|adres|dojad|otwart|godzin)/.test(t)) {
    const list = LOCATIONS.map((l) => `• ${l.name} — ${l.address} (${l.hours})`).join("\n");
    const lead = opts.coords
      ? "Oto nasze punkty (tryb demo nie liczy odległości po GPS):"
      : "Oto nasze punkty:";
    return `${lead}\n${list}`;
  }

  // Program lojalnościowy / FAQ
  if (/(kul[ae] mocy|\bkm\b|happy|lojaln|nagrod|płatno|blik|gotówk|kart)/.test(t)) {
    return "Za każde wydane 1 zł dostajesz 1 Kulę Mocy (w Happy Hours 12:00–14:00 podwójnie, w piątki 20:00–23:00 potrójnie!). Wymieniasz je na nagrody w zakładce Nagrody. Płacisz gotówką, kartą lub BLIK-iem.";
  }

  // Rekomendacja z menu
  if (/(lekk|wege|ostr|polec|kalori|bezglut|gluten|cebul|kebab|pita|co zje|głodn|smaczn|dani)/.test(t)) {
    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      orderBy: { name: "asc" },
    });
    type P = (typeof products)[number];
    const withTags = products.map((p) => ({
      p,
      tags: (JSON.parse(p.tags) as string[]).map((x) => x.toLowerCase()),
    }));
    const has = (w: string) => (x: { tags: string[] }) => x.tags.some((tag) => tag.includes(w));

    let picks: { p: P; tags: string[] }[] = [];
    if (/wege|wegetari/.test(t)) picks = withTags.filter(has("wege"));
    else if (/ostr/.test(t)) picks = withTags.filter(has("ostr"));
    else if (/bezglut|gluten/.test(t)) picks = withTags.filter(has("bezglut"));
    else if (/lekk/.test(t))
      picks = [...withTags].sort((a, b) => a.p.calories - b.p.calories).slice(0, 2);

    if (picks.length === 0) picks = withTags.slice(0, 2);

    const lines = picks
      .slice(0, 2)
      .map(({ p }) => `• ${p.name} (${p.price.toFixed(2)} zł, ${p.calories} kcal) — ${p.description}`)
      .join("\n");
    return `Z naszego menu polecam:\n${lines}`;
  }

  // Domyślnie
  return `Cześć${hello}! Jestem AI Queen. Mogę doradzić w wyborze dania, opowiedzieć o składnikach i kaloriach, wyjaśnić program Kule Mocy albo podpowiedzieć, gdzie nas znajdziesz. O co chcesz zapytać?`;
}
