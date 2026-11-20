"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { IconArrow, IconInstagram, IconTelegram } from "./Icons";
import { Monogram } from "./Monogram";
import { LangSwitch } from "./LangSwitch";
import { useLang } from "@/i18n/client";

const COLS = [
  {
    uk: "Про CORSO",
    en: "About CORSO",
    links: [
      { href: "/about", uk: "Про бренд", en: "About the brand" },
      { href: "/lookbook", uk: "Лукбук", en: "Lookbook" },
      { href: "/showroom", uk: "Шоурум у Дніпрі", en: "Showroom in Dnipro" },
      { href: "/info/opt", uk: "Співпраця та опт", en: "Wholesale" },
    ],
  },
  {
    uk: "Клієнтам",
    en: "Client care",
    links: [
      { href: "/info/oplata-i-dostavka", uk: "Оплата і доставка", en: "Payment & delivery" },
      { href: "/info/obmin-i-povernennia", uk: "Обмін і повернення", en: "Exchanges & returns" },
      { href: "/info/rozmirna-sitka", uk: "Розмірна сітка", en: "Size guide" },
      { href: "/info/dohliad", uk: "Догляд за виробами", en: "Garment care" },
      { href: "/account", uk: "Особистий кабінет", en: "My account" },
    ],
  },
  {
    uk: "Політики",
    en: "Policies",
    links: [
      { href: "/info/oferta", uk: "Публічна оферта", en: "Terms of sale" },
      { href: "/info/konfidentsiinist", uk: "Політика конфіденційності", en: "Privacy policy" },
    ],
  },
];

export function Footer() {
  const { lang, tr } = useLang();
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
        <p className="muted">{tr("Новинки, закриті передзамовлення та архівні розпродажі — першими.", "New arrivals, private pre-orders and archive sales — first.")}</p>
        {sent ? (
          <p className="ftr__ok">{tr("Дякуємо! Ви підписані.", "Thank you! You are subscribed.")}</p>
        ) : (
          <form
            className="ftr__form"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input type="email" required placeholder="E-mail" aria-label="E-mail" />
            <button aria-label={tr("Підписатися", "Subscribe")}>
              <IconArrow />
            </button>
          </form>
        )}
      </div>

      <div className="ftr__cols">
        {COLS.map((c) => (
          <details key={c.uk} className="ftr__col" open={desk || undefined}>
            <summary>{c[lang]}</summary>
            <ul>
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l[lang]}</Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
        <div className="ftr__contact">
          <p className="eyebrow">{tr("Шоурум", "Showroom")}</p>
          <p>{tr(`${site.city}, ${site.address}`, `${site.addressEn}, ${site.cityEn}`)}</p>
          <p>
            {tr("Замовлення та питання:", "Orders & questions:")}{" "}
            <a href={site.manager} target="_blank" rel="noopener noreferrer">
              {site.managerHandle}
            </a>
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
        <LangSwitch className="ftr__lang" />
      </div>
    </footer>
  );
}
