# CORSO — status

## Done (2026-11-19/20)
- Next.js store on :3025 — white + graphite/black, Vogue style, mobile first.
- Brand identity from the client's files (2026-11-20): monogram C/C logo (header, menu, footer, favicon, apple-icon), fonts Open Sans (wordmark/titles) + Montserrat (text/UI), footer lockup «CORSO EDIT CLUB · STYLE HAS AN ADDRESS».
- 40 products from the Telegram channel (FW 26/27 + Summer 26), 236 product photos cropped 2:3, 27 editorial frames (12 high-res from Instagram).
- Home (magazine cover hero with giant CORSO masthead), catalogue with filters + 1/2-column view on phones, product page (swipe gallery, colours, sizes, size chart, sticky buy bar, accordions), lookbook, about, showroom, info pages.
- Bag drawer, checkout with delivery/payment choice, **demo** card payment (Apple Pay / Google Pay / card form), thank-you page, **demo** account (login/registration, order history, profile) — all in localStorage.
- Checkout step «Параметри фігури» (client request 2026-11-20: height / bust / waist / hips, cm, required — CORSO adapts models in-house). Saved in the store (`measurements`, localStorage `corso.measure.v1`), pre-filled on the next order, editable in account → «Параметри»; sent with the order (API validates ranges) and shown in order history. With a real backend: store on the customer profile.
- Manager contact everywhere (footer, showroom, product «Запитати менеджера», size guide, info pages): **@karina_kulikova** (2026-11-20; the on-site demo bot was removed at the client's request).
- Two languages (2026-11-20): Ukrainian + English across the whole site incl. all 40 product descriptions; switch УКР / ENG at the bottom of the menu and in the footer (cookie). English product texts are our translation — ask the client to review.
- Gift certificate `/gift-certificate` (2026-11-20, modelled on onebyone.ua/gift-certificate): amount from 1 000 ₴ (presets 1/2/3/5/10k or own, max 100 000), design Noir/Milk with live card preview, recipient name + e-mail, greeting (300), sender name/phone/e-mail, send now or on a date → step «Оплата» (demo: pay button disabled). `/api/gift` validates and sends the request to the managers' Telegram as «очікує оплати». Rules in `src/lib/gift.ts`.
- Cash on delivery with prepayment (client 2026-11-21): starting prepayment **from 400 ₴**, the client may pay more (chips 400/500/1 000/2 000 or own amount ≥ 400). Button «Замовити з передоплатою» under «Оформити замовлення» in the bag drawer and cart page and under «Купити зараз» on product pages → `/checkout?pay=prepay` (option preselected). Prepayment goes through the demo card modal; `/api/orders` rejects COD without prepay ≥ 400 and tells the manager the amount. Rule: `src/lib/prepay.ts`. Payment/Delivery texts updated.
- Client edits 2026-11-25: public offer with seller details (ФОП Вишнивецька А. В., IBAN, АТ «Універсал Банк»); payment page shows the requisites; «Обмін і повернення» rewritten from the client's reference (14 days, conditions, non-returnable bodysuits/socks/swimwear, how-to) + online return/exchange application → managers; privacy policy names the data controller; monogram removed from the header; «Шоурум» page replaced by «Контакти» (store address under «Магазини», /showroom redirects); wording «шоурум» → «магазин».
- Client edits 2026-11-25 (2): «Про нас» with the client's text (2022 → EMOTION → CORSO, 2025 rebrand, own production in Dnipro, CORSO / EDIT / CLUB); top bar rotates her 5 theses; on phones the home page stops after the quote with «Дивитись далі» (lifestyle sections open on tap, desktop unchanged); the manager's personal nickname is never shown — only «Звʼязок з менеджером» (link still goes to her Telegram, `site.manager`); welcome popup «Реєструйтеся — −5% на перше замовлення» (once per visitor); −5% first-order discount row in bag/cart/checkout for registered clients without orders (`src/lib/discount.ts`), passed to the manager.
- Orders POST to `/api/orders` (Telegram when env is set).

## Next
- Prices: client sends the price list → fill `PRICES` in `src/lib/catalog.ts`.
- Real payment provider (LiqPay / WayForPay / Monobank Acquiring) + real accounts (Supabase/NextAuth) — later stage.
- GitHub: github.com/plvn-code/corso (main). Vercel — ask the user first.

## Gift certificate — next stage
Payment provider → on success generate a unique code, e-mail the certificate to the recipient (on `sendOn` date) and a receipt to the sender; field «Сертифікат» at checkout to redeem (balance check). Needs a DB.

## Open questions for the client
1. Price list (we show only «₴» for now).
2. Sizes per model — many posts don't state them; we used XS/S, M/L as a placeholder (puffers, coats, leather jacket, shirts…).
3. Size chart in cm — current table is generic.
4. Which models/colours are still in stock (summer collection, archive sale).
5. Original photos (Telegram web gives only 800 px) — ideally studio files ≥ 1600 px.
6. ~~Logo file~~ — received 2026-11-20 (Canva PDF); ask for the original SVG/AI if they have it.
7. Telegram bot token + managers' chat id for order notifications, payment provider choice, domain.
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

### Gift certificate — confirm with the client
- Validity: **6 months from payment** (client 2026-11-20; was 3 → 6, `GIFT_VALID_MONTHS` in src/lib/gift.ts).
- Still a draft: no cash refund, pay the difference if the purchase costs more, usable online + showroom, one-time vs. partial use of the balance, max amount (we set 100 000 ₴).

### Legal texts — confirm with the client
- The offer, returns and privacy texts are drafted by us from her answers — ideally a lawyer reviews them.
- Name spelling: we wrote «В'ячеславівна» (with apostrophe, standard Ukrainian); she typed «Вячеславівна» — check against the ФОП registration.
- Return address for Nova Poshta: not given — the page says the manager sends the details after the application.
- Should pieces adapted to the client's measurements be non-returnable? (common practice, not in her reference — not added).
- If the brand gets its own Telegram account for orders, change `site.manager` (one place).
- −5% first order: demo check uses localStorage (account + order history); a real backend must check the customer's orders server-side.
