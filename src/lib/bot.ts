import { site } from "./site";

/**
 * Script of the CORSO quick-contact bot — shared by the on-site demo chat (BotChat) and the
 * real Telegram bot webhook (/api/telegram). Facts only from the site (delivery, showroom, exchange).
 */
export interface BotLink {
  label: string;
  href: string;
}

export interface BotTopic {
  id: string;
  label: string;
  answer: string[];
  links?: BotLink[];
  /** after this topic the bot waits for the client's message for the managers */
  ask?: string;
}

export const BOT_NAME = "CORSO Edit Club";

export const BOT_GREETING = [
  "Вітаємо в CORSO Edit Club ✦",
  "Я передам ваше питання менеджерам — вони підхоплять його одразу. Оберіть тему або просто напишіть повідомлення.",
];

export const BOT_TOPICS: BotTopic[] = [
  {
    id: "size",
    label: "Підібрати розмір",
    answer: [
      "Ми шиємо на власному виробництві й можемо адаптувати модель під вашу фігуру.",
      "Напишіть зріст, обʼєм грудей, талії та стегон — менеджер підкаже розмір і посадку.",
    ],
    links: [{ label: "Розмірна сітка", href: "/info/rozmirna-sitka" }],
  },
  {
    id: "stock",
    label: "Наявність і ціна",
    answer: ["Надішліть назву моделі або посилання з сайту — менеджер перевірить колір, розмір і назве ціну."],
  },
  {
    id: "delivery",
    label: "Доставка й оплата",
    answer: [
      "Відправляємо Новою поштою по Україні за 1–2 дні: відділення, поштомат або курʼєр. Самовивіз — з шоуруму в Дніпрі.",
      "Оплата карткою онлайн, на рахунок ФОП або накладеним платежем з передоплатою 250 грн.",
    ],
    links: [{ label: "Оплата і доставка", href: "/info/oplata-i-dostavka" }],
  },
  {
    id: "showroom",
    label: "Примірка в шоурумі",
    answer: [`Чекаємо на примірку: ${site.city}, ${site.address}.`],
    links: [{ label: "Прокласти маршрут", href: site.maps }],
    ask: "Напишіть зручний день і час — забронюємо для вас примірку.",
  },
  {
    id: "order",
    label: "Статус замовлення",
    answer: ["Надішліть номер замовлення (CR-…) — менеджер перевірить статус і відповість."],
  },
  {
    id: "exchange",
    label: "Обмін і повернення",
    answer: [
      "Обмін на інший розмір — за рахунок покупця. Повернення — якщо під час огляду у відділенні пошти виявлено брак.",
    ],
    links: [{ label: "Умови обміну", href: "/info/obmin-i-povernennia" }],
  },
  {
    id: "manager",
    label: "Написати менеджеру",
    answer: ["Напишіть ваше питання — менеджер відповість найближчим часом."],
  },
];

export const BOT_ASK_CONTACT = "Залиште телефон або нік у Telegram, щоб менеджер міг вам відповісти.";
export const BOT_SENT = "Готово ✓ Передали менеджерам CORSO — вони вже бачать ваш запит і звʼяжуться з вами.";

/** +380… / 0… phone or @telegram_nick */
export function isContact(v: string) {
  const s = v.trim();
  return /^@[a-zA-Z0-9_]{4,32}$/.test(s) || s.replace(/[^\d]/g, "").length >= 10;
}
