"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { site } from "@/lib/site";
import { Monogram } from "./Monogram";
import { LangSwitch } from "./LangSwitch";
import { useLang } from "@/i18n/client";
import { IconBag, IconClose, IconHeart, IconInstagram, IconMenu, IconSearch, IconTelegram, IconUser } from "./Icons";

export interface SearchItem {
  slug: string;
  name: string;
  line: string;
  image: string;
  keywords: string;
}

const MENU = [
  { href: "/catalog?c=new", uk: "Новинки", en: "New in" },
  { href: "/catalog?col=fw26", uk: "Осінь — зима", en: "Fall — Winter" },
  { href: "/catalog?c=puhovyky", uk: "Пуховики", en: "Puffers" },
  { href: "/catalog?c=palta", uk: "Пальта і тренчі", en: "Coats & trenches" },
  { href: "/catalog?c=kurtky", uk: "Бомбери і парки", en: "Bombers & parkas" },
  { href: "/catalog?c=shkira", uk: "Шкіряна лінійка", en: "Leather" },
  { href: "/catalog?c=sety", uk: "Сети і костюми", en: "Sets" },
  { href: "/catalog?c=sorochky", uk: "Сорочки", en: "Shirts" },
  { href: "/catalog?c=basic", uk: "База", en: "Basics" },
  { href: "/catalog?col=ss26", uk: "Літо 26", en: "Summer 26" },
];

const SECONDARY = [
  { href: "/lookbook", uk: "Лукбук", en: "Lookbook" },
  { href: "/about", uk: "Про бренд", en: "About" },
  { href: "/showroom", uk: "Шоурум у Дніпрі", en: "Showroom in Dnipro" },
  { href: "/info/oplata-i-dostavka", uk: "Оплата і доставка", en: "Payment & delivery" },
  { href: "/info/rozmirna-sitka", uk: "Розмірна сітка", en: "Size guide" },
  { href: "/account", uk: "Особистий кабінет", en: "My account" },
];

const NOTES = [
  { uk: "Офлайн-примірка · Дніпро, Вернадського 16", en: "Fitting in our showroom · Dnipro, Vernadskoho 16" },
  { uk: "Відправка по Україні 1–2 дні", en: "Shipping across Ukraine in 1–2 days" },
  { uk: "Італійські тканини · Made in Ukraine", en: "Italian fabrics · Made in Ukraine" },
];

export function Header({ items }: { items: SearchItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, openBag, wishlist, ready } = useStore();
  const { lang, tr } = useLang();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const [note, setNote] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setNote((n) => (n + 1) % NOTES.length), 4200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-menu", menu || search);
    if (search) setTimeout(() => inputRef.current?.focus(), 250);
  }, [menu, search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setSearch(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return [];
    return items.filter((i) => i.keywords.includes(s)).slice(0, 6);
  }, [q, items]);

  return (
    <>
      <div className="note-bar" aria-live="polite">
        {NOTES.map((n, i) => (
          <span key={n.uk} className={i === note ? "is-on" : ""}>
            {n[lang]}
          </span>
        ))}
      </div>
      <header className="hdr">
        <div className="hdr__in">
          <div className="hdr__left">
            <button className="icon-btn" aria-label={tr("Меню", "Menu")} onClick={() => setMenu(true)}>
              <IconMenu />
            </button>
            <button className="icon-btn" aria-label={tr("Пошук", "Search")} onClick={() => setSearch(true)}>
              <IconSearch />
            </button>
            <nav className="hdr__nav" aria-label={tr("Основне меню", "Main menu")}>
              <Link href="/catalog?c=new">{tr("Новинки", "New in")}</Link>
              <Link href="/catalog">{tr("Каталог", "Shop")}</Link>
              <Link href="/lookbook">{tr("Лукбук", "Lookbook")}</Link>
              <Link href="/about">{tr("Про бренд", "About")}</Link>
            </nav>
          </div>
          <Link href="/" className="hdr__logo" aria-label={tr("CORSO — на головну", "CORSO — home")}>
            <Monogram className="hdr__mono" />
            <span className="hdr__word">CORSO</span>
          </Link>
          <div className="hdr__right">
            <Link href="/account" className="icon-btn hide-sm" aria-label={tr("Особистий кабінет", "My account")}>
              <IconUser />
            </Link>
            <Link href="/wishlist" className="icon-btn" aria-label={tr("Обране", "Wishlist")}>
              <IconHeart />
              {ready && wishlist.length > 0 && <i className="dot-count">{wishlist.length}</i>}
            </Link>
            <button className="icon-btn" aria-label={tr("Кошик", "Bag")} onClick={openBag}>
              <IconBag />
              {ready && count > 0 && <i className="dot-count">{count}</i>}
            </button>
          </div>
        </div>
      </header>

      {/* Menu */}
      <div className={`menu${menu ? " is-open" : ""}`} aria-hidden={!menu}>
        <div className="menu__top">
          <button className="icon-btn" aria-label={tr("Закрити меню", "Close menu")} onClick={() => setMenu(false)}>
            <IconClose />
          </button>
          <Link href="/" className="menu__logo" aria-label={tr("CORSO — на головну", "CORSO — home")} onClick={() => setMenu(false)}>
            <Monogram />
          </Link>
          <span className="icon-btn" />
        </div>
        <div className="menu__body">
          <ol className="menu__list">
            {MENU.map((m, i) => (
              <li key={m.href} style={{ "--i": i } as React.CSSProperties}>
                <Link href={m.href} onClick={() => setMenu(false)}>
                  <span className="menu__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="menu__label">{m[lang]}</span>
                </Link>
              </li>
            ))}
          </ol>
          <ul className="menu__sub">
            {SECONDARY.map((m) => (
              <li key={m.href}>
                <Link href={m.href} onClick={() => setMenu(false)}>
                  {m[lang]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu__foot">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              <IconInstagram width={18} height={18} /> {site.instagramHandle}
            </a>
            <a href={site.telegram} target="_blank" rel="noopener noreferrer">
              <IconTelegram width={18} height={18} /> {tr("Telegram-канал", "Telegram channel")}
            </a>
          </div>
          <LangSwitch className="menu__lang" />
        </div>
      </div>

      {/* Search */}
      <div className={`search${search ? " is-open" : ""}`} aria-hidden={!search}>
        <div className="search__bar">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) router.push(`/catalog?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <IconSearch />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tr("Пошук: тренч, пуховик, сатин…", "Search: trench, puffer, satin…")}
              aria-label={tr("Пошук по каталогу", "Search the shop")}
            />
          </form>
          <button className="icon-btn" aria-label={tr("Закрити пошук", "Close search")} onClick={() => setSearch(false)}>
            <IconClose />
          </button>
        </div>
        <div className="search__body">
          {results.length > 0 ? (
            <ul className="search__res">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link href={`/product/${r.slug}`}>
                    <Image src={r.image} alt="" width={64} height={96} />
                    <span>
                      <small>{r.line}</small>
                      {r.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search__hint">
              <p className="eyebrow">{tr("Популярне", "Popular")}</p>
              <div className="chips">
                {(lang === "en"
                  ? ["Puffer", "Trench", "Coat", "Bomber", "Leather", "Shirt", "Satin", "Linen"]
                  : ["Пуховик", "Тренч", "Пальто", "Бомбер", "Шкіра", "Сорочка", "Сатин", "Льон"]
                ).map((w) => (
                  <button key={w} className="chip" onClick={() => setQ(w)}>
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
