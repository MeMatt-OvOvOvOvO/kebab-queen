---
description: Launch the Kebab Queen Next.js dev server and drive it with chromium-cli
---

# Run Kebab Queen

## Start the dev server

```bash
# Kill any previous instance first
pkill -f "next dev" 2>/dev/null || true

npm run dev -- --port 3333 &
echo $! > /tmp/kq-dev.pid

# Poll until ready (Next.js 16 can take 10-15 s on first compile)
timeout 60 bash -c 'until curl -sf http://localhost:3333 >/dev/null; do sleep 1; done'
echo "Server ready"
```

## Stop the server

```bash
kill $(cat /tmp/kq-dev.pid) 2>/dev/null || pkill -f "next dev" 2>/dev/null || true
```

## Auth — log in as the demo user

The app uses phone-only auth (no SMS). Demo account: phone **123456789**, 350 Kul Mocy, tier 3.

```bash
chromium-cli --session kq <<'EOF'
nav http://localhost:3333/login
wait-for input[type="tel"]
fill input[type="tel"] 123456789
click button[type="submit"]
wait-for text=Witaj ponownie
screenshot
EOF
```

After this the `kq_session` httpOnly cookie is set for the session. All subsequent `nav` calls reuse it.

## Representative smoke test

```bash
chromium-cli --session kq <<'EOF'
nav http://localhost:3333/
wait-for text=Kul Mocy
screenshot
console --errors
EOF
```

Screenshots land in `chromium_cli/sessions/kq/screenshots/`.

## Gotchas

- **Port 3333** — the app runs on 3333 to avoid clashing with other local services on 3000.
- **SQLite seed** — if the DB is empty run `npm run db:reset` before starting. The demo user (123456789) is created by the seed.
- **First compile** — Next.js 16 compiles routes on demand; `wait-for` on first `nav` can take up to 30 s.
- **React inputs** — always use `fill` (not `eval el.value = …`) or React's `onChange` won't fire.
