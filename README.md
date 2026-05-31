# Kebab Queen

Aplikacja lojalnościowa dla sieci Kebab Queen. Next.js 16 (App Router) + Prisma 7 + SQLite + TailwindCSS v4.

## Stack

| Warstwa          | Technologia                                    |
| ---------------- | ---------------------------------------------- |
| Framework        | Next.js 16.2 (App Router, TypeScript)          |
| Stylowanie       | Tailwind CSS v4                                |
| Baza danych      | SQLite via Prisma 7 + `@prisma/adapter-libsql` |
| State / Requesty | TanStack React Query v5                        |
| HTTP client      | Axios (`lib/apiClient.ts`)                     |
| Sesja            | httpOnly cookie `kq_session` (userId)          |

## Pierwsze uruchomienie

```bash
npm install
npm run db:reset   # reset migracji + seed bazy
npm run dev
```

Konto demo: telefon **123456789** (350 Kul Mocy, tier 3).

## Przydatne komendy

```bash
npm run dev          # dev server
npm run build        # produkcyjny build
npm run db:reset     # wyczyść bazę, zastosuj migracje i seeduj od nowa
npx prisma studio    # GUI do bazy
```

## Struktura projektu

```
app/
  api/               # Route Handlers (Next.js 16)
    auth/login       # POST — logowanie numerem telefonu
    auth/logout      # POST — wylogowanie
    user/me          # GET  — dane zalogowanego + saldo KM
    user/transactions# GET  — historia (paginacja: ?page=&limit=)
    products         # GET  — lista produktów (?tag=WEGE&tag=OSTRE)
    transactions     # POST — dodaj punkty (panel admina)
    rewards          # GET  — lista nagród
    rewards/redeem   # POST — wymień KM na nagrodę
    happy-hours      # GET  — aktywny mnożnik + harmonogram
components/          # Navbar, Footer, BottomNav, QueryClientWrapper
hooks/
  queries/           # useMe, useProducts, useRewards, useTransactions, useHappyHours
  mutations/         # useLogin, useLogout, useRedeemReward, useAddPoints
lib/
  apiClient.ts       # instancja Axios (baseURL: /api)
  db.ts              # singleton PrismaClient z adapterem libsql
  session.ts         # createSession / getSession / deleteSession
  happy-hours.ts     # getActiveMultiplier() — logika mnożnika punktów
prisma/
  schema.prisma      # modele: User, LoyaltyAccount, Transaction, Product, Reward, HappyHour
  seed.ts            # dane startowe (10 produktów, 4 nagrody, 2 happy hours, 1 demo user)
prisma.config.ts     # konfiguracja Prisma 7 (URL bazy, komenda seed)
proxy.ts             # ochrona tras (Next.js 16 — odpowiednik middleware.ts)
types/               # typy TS w osobnych plikach (*.type.ts, *.enum.ts)
```

## Ważne konwencje (Next.js 16)

- **Proxy zamiast Middleware** — plik `proxy.ts` w rootu, eksport `proxy()` (nie `middleware`)
- **`cookies()` jest async** — zawsze `await cookies()` w server components i route handlers
- **`params` w route handlers jest Promise** — `const { id } = await params`
- **`NextRequest` / `NextResponse`** — importuj z `next/server` we wszystkich route handlers
- Przed pisaniem kodu sprawdź `node_modules/next/dist/docs/` — wersja 16 ma breaking changes

---

## Checklist funkcjonalności

### Konto i Lojalność

- [x] Logowanie numerem telefonu (bez SMS — wpisanie numeru tworzy/odnajduje konto)
- [x] Sesja przez httpOnly cookie
- [x] Proxy chroniący chronione trasy (401 na API, redirect na `/login` dla stron)
- [x] Ekran logowania (`/login`)
- [x] Ekran główny po zalogowaniu — saldo KM, skróty do sekcji
- [ ] Wirtualna Karta — ekran z kodem QR z ID użytkownika (`qrcode.react`)
- [ ] Portfel Kul Mocy — animacja "wpływania" punktów, poziom lojalności (1–7 gwiazdek)
- [ ] Historia transakcji — lista z datą, opisem, liczbą punktów
- [ ] "To co zwykle?" — przycisk na ekranie głównym, query do najczęstszego produktu z historii

### Menu i Produkty

- [x] Baza 10 produktów z cenami, opisami, tagami i kaloriami
- [x] API filtrowania po tagach (`?tag=WEGE&tag=OSTRE`)
- [x] Ekran Menu — lista produktów z filtrami
- [x] Karta produktu — zdjęcie, cena, opis, tagi
- [x] Licznik kroków do spalenia kalorii (prosta kalkulacja na froncie)

### Katalog Nagród

- [x] API listy nagród i wymiany punktów
- [ ] Ekran Katalogu Nagród — karty z kosztem w KM, przycisk "Wymień"
- [ ] Obsługa błędu "Za mało Kul Mocy"

### AI Queen (Czatbot)

- [ ] Integracja z Claude API (system prompt z menu i FAQ Kebab Queen)
- [ ] Ekran czatu — dymki, awatar, animacja "pisze..."
- [ ] Rozpoznawanie intencji smakowych ("lekkie", "bez cebuli")
- [ ] Odpowiedź na pytanie "Gdzie najbliższa Queen?" (hardkodowane lokalizacje)
- [ ] Odpowiedzi o składnikach, alergenach, wartościach odżywczych

### System poleceń

- [ ] Generowanie linku polecającego (`/join?ref=USERID`)
- [ ] Ekran "Zaproś koleżankę" — wyświetlenie linku, licznik zaproszonych
- [ ] Logika referral — +20 KM dla obu stron przy rejestracji przez link

### Happy Hours

- [x] Model `HappyHour` w bazie (dayOfWeek, startHour–endHour, multiplier)
- [x] Logika mnożnika punktów przy dodawaniu transakcji
- [x] API `/api/happy-hours` — aktywny mnożnik + harmonogram
- [ ] Baner Happy Hours na ekranie głównym z licznikiem czasu

### Panel Admina

- [ ] Strona `/admin` — formularz do ręcznego dodawania punktów użytkownikowi
- [ ] Wyszukiwanie użytkownika po numerze telefonu

### UI / Design System

- [x] Paleta kolorów Pink Queen w Tailwind (`#F0147A`, złoto, `#F8F5F7`)
- [x] Navbar + Footer (desktop)
- [x] Strona główna — hero banner, karty ofert, sidebar z lokalizacją
- [x] Wspólne komponenty: `Button`, `Card`, `Badge`
- [ ] Warianty "Stopnia Różowości" (3 motywy — CSS variables)
- [ ] Ikony Kul Mocy (1–7 gwiazdek zależnie od poziomu)
- [ ] Responsywność — mobile-first, iPhone SE → duże Androidy
- [ ] Animacje przejść między stronami (Framer Motion)
- [ ] Loading states i error states na wszystkich ekranach

---

## Wymagania Funkcjonalne

### Konto i Lojalność

- **Rejestracja/Logowanie:** Autoryzacja wyłącznie numerem telefonu (kod SMS). Brak haseł do zapamiętania.
- **Wirtualna Karta (Kod QR):** Generowanie unikalnego kodu QR, który klient pokazuje przy kasie, by nabić punkty.
- **Portfel Kul Mocy:** Podgląd aktualnego salda punktów z animacją "zbierania" (np. kula wpada do ekwipunku).
- **Katalog Nagród:** Lista produktów, które można odebrać za punkty (Kebab, frytki z serem, leżak, rożen).
- **Historia Transakcji:** Lista ostatnich wizyt z informacją, ile kul wpadło na konto.
- **Obsługa "Stałego Zestawu":** Jeden przycisk na ekranie głównym: "To co zwykle?" na podstawie poprzednich zamówień.

### Menu i Produkty

- **Baza 10 Produktów:** Dynamiczna lista z cenami i opisami.
- **System Filtrowania:** Filtry: "Wege", "Ostre", "Bez glutenu" oraz dedykowana sekcja "Frytki z serem".
- **Licznik spalonych kalorii:** Informacja, ile kroków trzeba przejść po zjedzeniu danego kebaba.

### AI Queen (Czatbot)

- **Doradca Smaku:** Rozpoznawanie intencji (np. "Chcę coś lekkiego i bez cebuli").
- **Geolokalizacja:** Odpowiedź na pytanie "Gdzie najbliższa Queen?" na podstawie GPS telefonu.
- **Baza Wiedzy:** Odpowiedzi na pytania o składniki, alergeny i wartości odżywcze.

### Dodatki Specjalne

- **System poleceń:** Za zaproszenie koleżanki do aplikacji obie osoby dostają po 20 Kul Mocy.
- **Happy Hours:** Powiadomienia o tym, że przez najbliższą godzinę w Wieliczce naliczamy 1zł = 8 Kul Mocy.

---

## Wymagania Niefunkcjonalne

### Wygląd i Doświadczenie (UI/UX)

- **Estetyka "Pink Queen":** Dominacja różu (od pudrowego po fuksję) z elementami złota i bieli.
- **Wybór "Stopnia Różowości":** Personalizacja interfejsu — 3 warianty intensywności motywu kolorystycznego.
- **Stylistyka Kul Mocy:** Ikony punktów nawiązujące do pomarańczowych kul z gwiazdkami (1–7 zależnie od poziomu lojalności).
- **Responsywność:** Aplikacja musi wyglądać jak natywna apka na iPhone'ach i Androidach (RWD).

### Wydajność i Bezpieczeństwo

- **Czas ładowania:** Strona główna musi załadować się w mniej niż 2 sekundy na łączu LTE.
- **Bezpieczeństwo danych:** Zgodność z RODO (przechowywanie numerów telefonów i zgód marketingowych).
- **Skalowalność:** Serwer musi wytrzymać nagły najazd głodnych klientów w sobotni wieczór w całej Wieliczce.
