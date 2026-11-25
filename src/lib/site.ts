export const site = {
  name: "CORSO",
  tagline: "Ukrainian clothing brand · Minimalist wardrobe",
  description:
    "CORSO — український бренд жіночого одягу преміальної якості. Італійські тканини, архітектурні силуети, мінімалістичний гардероб. Made in Ukraine.",
  descriptionEn:
    "CORSO — a Ukrainian brand of premium women's clothing. Italian fabrics, architectural silhouettes, a minimalist wardrobe. Made in Ukraine.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3025",
  instagram: "https://www.instagram.com/corso.edit.club/",
  instagramHandle: "@corso.edit.club",
  telegram: "https://t.me/emotionbrand",
  /** Manager for orders and questions (Telegram) — changed 2026-11-20 */
  // Never show the personal nickname on the site — only brand wording «Звʼязок з менеджером» (client, 2026-11-25)
  manager: "https://t.me/karina_kulikova",
  city: "Дніпро",
  address: "вул. Володимира Вернадського, 16",
  cityEn: "Dnipro",
  /** Seller details (client, 2026-11-25) — used in the public offer, payment page and contacts. */
  legal: {
    name: "ФОП Вишнивецька Анастасія В'ячеславівна",
    nameEn: "Individual entrepreneur Anastasiia Vyshnyvetska",
    ipn: "3885904240",
    iban: "UA183220010000026001380091421",
    bank: "АТ «УНІВЕРСАЛ БАНК»",
    bankEn: "JSC Universal Bank",
    mfo: "322001",
    bankCode: "21133352",
  },
  addressEn: "16 Volodymyra Vernadskoho St.",
  maps: "https://www.google.com/maps/search/?api=1&query=%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE%2C+%D0%B2%D1%83%D0%BB.+%D0%92%D0%BE%D0%BB%D0%BE%D0%B4%D0%B8%D0%BC%D0%B8%D1%80%D0%B0+%D0%92%D0%B5%D1%80%D0%BD%D0%B0%D0%B4%D1%81%D1%8C%D0%BA%D0%BE%D0%B3%D0%BE%2C+16",
};
