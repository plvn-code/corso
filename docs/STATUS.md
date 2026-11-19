# CORSO — status

## Done (2026-11-19/20)
- Next.js store on :3025 — white + graphite/black, Vogue-style serif, mobile first.
- 40 products from the Telegram channel (FW 26/27 + Summer 26), 236 product photos cropped 2:3, 27 editorial frames (12 high-res from Instagram).
- Home (magazine cover hero with giant CORSO masthead), catalogue with filters + 1/2-column view on phones, product page (swipe gallery, colours, sizes, size chart, sticky buy bar, accordions), lookbook, about, showroom, info pages.
- Bag drawer, checkout with delivery/payment choice, **demo** card payment (Apple Pay / Google Pay / card form), thank-you page, **demo** account (login/registration, order history, profile) — all in localStorage.
- Orders POST to `/api/orders` (Telegram when env is set).

## Next
- Prices: client sends the price list → fill `PRICES` in `src/lib/catalog.ts`.
- Real payment provider (LiqPay / WayForPay / Monobank Acquiring) + real accounts (Supabase/NextAuth) — later stage.
- GitHub repo + Vercel — ask the user first.

## Open questions for the client
1. Price list (we show only «₴» for now).
2. Sizes per model — many posts don't state them; we used XS/S, M/L as a placeholder (puffers, coats, leather jacket, shirts…).
3. Size chart in cm — current table is generic.
4. Which models/colours are still in stock (summer collection, archive sale).
5. Original photos (Telegram web gives only 800 px) — ideally studio files ≥ 1600 px.
6. Logo file (we typeset CORSO in Playfair Display).
7. Telegram bot/chat for orders, payment provider choice, domain.
8. Exchange/return policy wording, public offer and privacy policy texts.

## Prices seen in the Telegram channel (reference only, may be outdated)
- Trench coat — 11 950 UAH (2026-09-04)
- Parka — 8 400 (special) / 9 600 UAH in season
- Cult set with double stripe (jacket + palazzo/joggers) — 5 400 UAH (season sale 4 590)
- Zip set Italian knit — 5 950 UAH
- Two-layer shirt (Gucci fabric) — 7 800 UAH
- Shirt with knot — 4 400 UAH
- Open-back shirt (basic collection) — 3 650 UAH
- Puffer CORSO (to −25 °C) — 7 200 UAH
- Bomber (red, cotton/polyamide) — 4 800 UAH; grey elongated bomber — 4 800 UAH
- Leggings with stirrups — 1 450 UAH
- Longsleeve — 1 650 UAH; textured linen longsleeve — 1 690 UAH; wool longsleeve — 2 800 UAH
- Satin set: top 2 450 + palazzo 2 450 UAH; satin lace shorts — 1 600 UAH
- Tencel set — 4 600 UAH; tencel bandeau set — 3 950 UAH
- Linen set: shirt 2 800 + shorts 1 800 UAH; linen bomber 4 800 UAH
- Polo 1 950 + skirt 2 950 UAH; cotton jacket 3 950 + shorts 2 950 UAH; beige windbreaker 4 800 UAH
- Vest + shorts (Touch of Nature) — 5 440 UAH; satin trio: top 1 660, shorts 2 050, shirt-jacket 2 800 UAH
- Striped shirt with lace — 2 400 UAH; CORSO CLUB T-shirt — 1 800 UAH
