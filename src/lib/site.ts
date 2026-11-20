export const site = {
  name: "CORSO",
  tagline: "Ukrainian clothing brand · Minimalist wardrobe",
  description:
    "CORSO — український бренд жіночого одягу преміальної якості. Італійські тканини, архітектурні силуети, мінімалістичний гардероб. Made in Ukraine.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3025",
  instagram: "https://www.instagram.com/corso.edit.club/",
  instagramHandle: "@corso.edit.club",
  telegram: "https://t.me/emotionbrand",
  /**
   * CORSO Telegram bot (quick contact → managers). Until the client creates it, the site runs an
   * on-page demo chat; set NEXT_PUBLIC_TELEGRAM_BOT=<username without @> to also link to the real bot.
   */
  bot: process.env.NEXT_PUBLIC_TELEGRAM_BOT || "",
  city: "Дніпро",
  address: "вул. Володимира Вернадського, 16",
  maps: "https://www.google.com/maps/search/?api=1&query=%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE%2C+%D0%B2%D1%83%D0%BB.+%D0%92%D0%BE%D0%BB%D0%BE%D0%B4%D0%B8%D0%BC%D0%B8%D1%80%D0%B0+%D0%92%D0%B5%D1%80%D0%BD%D0%B0%D0%B4%D1%81%D1%8C%D0%BA%D0%BE%D0%B3%D0%BE%2C+16",
};
