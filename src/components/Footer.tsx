"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { IconArrow, IconInstagram, IconTelegram } from "./Icons";
import { Monogram } from "./Monogram";
import { BotButton } from "./BotChat";

const COLS = [
  {
    title: "Про CORSO",
    links: [
      { href: "/about", label: "Про бренд" },
      { href: "/lookbook", label: "Лукбук" },
      { href: "/showroom", label: "Шоурум у Дніпрі" },
      { href: "/info/opt", label: "Співпраця та опт" },
    ],
  },
  {
    title: "Клієнтам",
    links: [
      { href: "/info/oplata-i-dostavka", label: "Оплата і доставка" },
      { href: "/info/obmin-i-povernennia", label: "Обмін і повернення" },
      { href: "/info/rozmirna-sitka", label: "Розмірна сітка" },
      { href: "/info/dohliad", label: "Догляд за виробами" },
      { href: "/account", label: "Особистий кабінет" },
    ],
  },
  {
    title: "Політики",
    links: [
      { href: "/info/oferta", label: "Публічна оферта" },
      { href: "/info/konfidentsiinist", label: "Політика конфіденційності" },
    ],
  },
];

export function Footer() {
  const [sent, setSent] = useState(false);
  const [desk, setDesk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 960px)");
    const on = () => setDesk(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return (
    <footer className="ftr">
      <div className="ftr__news">
        <p className="title-sm">The CORSO Letter</p>
        <p className="muted">Новинки, закриті передзамовлення та архівні розпродажі — першими.</p>
        {sent ? (
          <p className="ftr__ok">Дякуємо! Ви підписані.</p>
        ) : (
          <form
            className="ftr__form"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input type="email" required placeholder="E-mail" aria-label="E-mail" />
            <button aria-label="Підписатися">
              <IconArrow />
            </button>
          </form>
        )}
      </div>

      <div className="ftr__cols">
        {COLS.map((c) => (
          <details key={c.title} className="ftr__col" open={desk || undefined}>
            <summary>{c.title}</summary>
            <ul>
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
        <div className="ftr__contact">
          <p className="eyebrow">Шоурум</p>
          <p>
            {site.city}, {site.address}
          </p>
          <p>
            Замовлення та питання:{" "}
            <BotButton>чат з менеджером →</BotButton>
          </p>
          <div className="ftr__social">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <IconInstagram />
            </a>
            <a href={site.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <IconTelegram />
            </a>
          </div>
        </div>
      </div>

      <div className="ftr__mark" aria-hidden>
        <Monogram className="ftr__mono" />
        <p className="ftr__word">CORSO EDIT CLUB</p>
        <p className="ftr__tag">Style has an address</p>
      </div>
      <div className="ftr__base">
        <span>© {new Date().getFullYear()} CORSO · Ukrainian clothing brand</span>
        <span>Made in Ukraine</span>
      </div>
    </footer>
  );
}
