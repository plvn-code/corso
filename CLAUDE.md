# CORSO — online store (client project)

Store for **CORSO** (Instagram @corso.edit.club, 30K; Telegram channel t.me/emotionbrand) — «український бренд жіночого одягу premium якості», Made in Ukraine, minimalist wardrobe, Italian fabrics. Showroom: Дніпро, вул. Володимира Вернадського, 16. Orders today go through the manager @ShkurkoTatyana. The owner of this repo is a developer (studio Superio) building the site for the client.

Brief (2026-11-19): expensive, premium, modern, **Vogue style**, white site modelled on kulakovsky.ua with grey/black as the second colour; **mobile first** (must be perfect on phones), desktop too. Product photos mostly from the Telegram channel. **No prices yet** — every price shows only «₴» until the client sends a price list. Online payment and personal accounts are **DEMO** for now (to be built later).

**Talk to the user in Russian.** Site copy is **Ukrainian**; brand lines stay in English (Noir Shell, Deep Navy, Edit Club…).
Read `docs/STATUS.md` first (done / next / open questions).

## Commands
```bash
npm run build && npx next start -p 3025     # production preview
npm run dev -- -p 3026                      # dev
kill $(lsof -ti tcp:3025 -sTCP:LISTEN)      # restart only our port
npm run lint && npx tsc --noEmit            # must stay clean
open -a "Google Chrome" http://localhost:3025
~/Desktop/nudes/research/.venv/bin/python -I scripts/build_images.py <tg_dir> <ig_dir>   # rebuild public/images
```
`node_modules` is a symlink to `~/Desktop/nudes/node_modules` (same package.json) — the user's disk is tight. Raw TG/IG photos are not kept (re-download from t.me/s/emotionbrand if needed; `research/tg-posts.json` has every post's text + photo URLs).

## Stack
Next.js 15 App Router · React 19 · TypeScript strict · plain CSS (`src/app/globals.css`, tokens in `:root`) · Playfair Display (serif display, Vogue-like) + Inter Tight (UI, Helvetica-like) via next/font · no UI/animation libraries.

## Data
- `src/data/products.json` — 40 products (FW 26/27 + Summer 26) curated from Telegram posts: name, line, category, collection, tags, sizes, description/details/composition (facts from captions only), colours → photo ids (`1303_1` = TG post 1303 photo 1, `gNN` = Instagram grid photo).
- `src/lib/catalog.ts` — types, categories, collections, colour families, `query()`, `toCard()`. **Prices:** `PRICES` map (slug → UAH) is empty on purpose; `formatPrice(null)` renders «₴». Prices seen in the channel are listed in `docs/STATUS.md` for reference.
- `scripts/build_images.py` — crops product photos to 2:3 (card ratio) into `public/images/p/<slug>/<id>.jpg`; `EDITORIAL` map → `public/images/editorial/*.jpg`. TG photos are only 800 px tall (channel web preview); IG ones ~1300 px wide — use IG for big hero/editorial frames.

## Routes
`/` (magazine-cover hero, new in, category tiles, Deep Navy story, bestsellers rail, fabrics, summer rail, showroom, perks, insta) · `/catalog` (?c= category|new|bestseller, ?col=fw26|ss26, ?color=, ?size=, ?sort=az, ?q=) · `/product/[slug]` (?color=) · `/lookbook` · `/about` · `/showroom` · `/cart` · `/checkout` (demo card payment modal / IBAN / COD) · `/account` (demo login + order history in localStorage) · `/wishlist` · `/info/[slug]` · `api/orders` (validates against catalogue → Telegram if TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID, else console log).

## Rules
- Never invent product facts (composition, sizes, temperatures). Sources: `research/tg-posts.json`. Sizes not stated in a post use the brand's usual XS/S, M/L — flagged in STATUS to confirm.
- Client state (bag, wishlist, demo user, demo orders) lives in `src/lib/store.tsx` (localStorage); keep its API when a real backend arrives.
- Never put state-driven classes on a `[data-reveal]` element — Reveal sets `data-in`.
- Playwright MCP drives the user's Chrome; a background tab freezes transitions — inject `*{transition:none!important;animation:none!important}` before screenshots.
- next/image `qualities` are [75, 85, 90] (next.config.ts) — any other value 400s.
- Responsive 320 → 2560; breakpoints 760 / 960 / 1200. Check 390 px and 1440 px after visible changes.
