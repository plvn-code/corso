"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { site } from "@/lib/site";
import { IconBag, IconClose, IconHeart, IconInstagram, IconMenu, IconSearch, IconTelegram, IconUser } from "./Icons";

export interface SearchItem {
  slug: string;
  name: string;
  line: string;
  image: string;
  keywords: string;
}

const MENU = [
  { href: "/catalog?c=new", label: "Новинки", en: "New In" },
  { href: "/catalog?col=fw26", label: "Осінь — зима", en: "FW 26/27" },
  { href: "/catalog?c=puhovyky", label: "Пуховики", en: "Puffers" },
  { href: "/catalog?c=palta", label: "Пальта і тренчі", en: "Coats" },
  { href: "/catalog?c=kurtky", label: "Бомбери і парки", en: "Outerwear" },
  { href: "/catalog?c=shkira", label: "Шкіряна лінійка", en: "Leather" },
  { href: "/catalog?c=sety", label: "Сети і костюми", en: "Sets" },
  { href: "/catalog?c=sorochky", label: "Сорочки", en: "Shirts" },
  { href: "/catalog?c=basic", label: "База", en: "Basics" },
  { href: "/catalog?col=ss26", label: "Літо 26", en: "Summer" },
];

const SECONDARY = [
  { href: "/lookbook", label: "Лукбук" },
  { href: "/about", label: "Про бренд" },
  { href: "/showroom", label: "Шоурум у Дніпрі" },
  { href: "/info/oplata-i-dostavka", label: "Оплата і доставка" },
  { href: "/info/rozmirna-sitka", label: "Розмірна сітка" },
  { href: "/account", label: "Особистий кабінет" },
];

const NOTES = [
  "Офлайн-примірка · Дніпро, Вернадського 16",
  "Відправка по Україні 1–2 дні",
  "Італійські тканини · Made in Ukraine",
];

export function Header({ items }: { items: SearchItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, openBag, wishlist, ready } = useStore();
  const home = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const [note, setNote] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > (home ? window.innerHeight * 0.55 : 8));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

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

  const solid = !home || scrolled || menu || search;

  return (
    <>
      <div className="note-bar" aria-live="polite">
        {NOTES.map((n, i) => (
          <span key={n} className={i === note ? "is-on" : ""}>
            {n}
          </span>
        ))}
      </div>
      <header className={`hdr${solid ? " hdr--solid" : ""}${home ? " hdr--home" : ""}`}>
        <div className="hdr__in">
          <div className="hdr__left">
            <button className="icon-btn" aria-label="Меню" onClick={() => setMenu(true)}>
              <IconMenu />
            </button>
            <button className="icon-btn" aria-label="Пошук" onClick={() => setSearch(true)}>
              <IconSearch />
            </button>
            <nav className="hdr__nav" aria-label="Основне меню">
              <Link href="/catalog?c=new">Новинки</Link>
              <Link href="/catalog">Каталог</Link>
              <Link href="/lookbook">Лукбук</Link>
              <Link href="/about">Про бренд</Link>
            </nav>
          </div>
          <Link href="/" className="hdr__logo" aria-label="CORSO — на головну">
            CORSO
          </Link>
          <div className="hdr__right">
            <Link href="/account" className="icon-btn hide-sm" aria-label="Особистий кабінет">
              <IconUser />
            </Link>
            <Link href="/wishlist" className="icon-btn" aria-label="Обране">
              <IconHeart />
              {ready && wishlist.length > 0 && <i className="dot-count">{wishlist.length}</i>}
            </Link>
            <button className="icon-btn" aria-label="Кошик" onClick={openBag}>
              <IconBag />
              {ready && count > 0 && <i className="dot-count">{count}</i>}
            </button>
          </div>
        </div>
      </header>

      {/* Menu */}
      <div className={`menu${menu ? " is-open" : ""}`} aria-hidden={!menu}>
        <div className="menu__top">
          <button className="icon-btn" aria-label="Закрити меню" onClick={() => setMenu(false)}>
            <IconClose />
          </button>
          <Link href="/" className="menu__logo" onClick={() => setMenu(false)}>
            CORSO
          </Link>
          <span className="icon-btn" />
        </div>
        <div className="menu__body">
          <ol className="menu__list">
            {MENU.map((m, i) => (
              <li key={m.href} style={{ "--i": i } as React.CSSProperties}>
                <Link href={m.href} onClick={() => setMenu(false)}>
                  <span className="menu__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="menu__label">{m.label}</span>
                  <span className="menu__en">{m.en}</span>
                </Link>
              </li>
            ))}
          </ol>
          <ul className="menu__sub">
            {SECONDARY.map((m) => (
              <li key={m.href}>
                <Link href={m.href} onClick={() => setMenu(false)}>
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu__foot">
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              <IconInstagram width={18} height={18} /> {site.instagramHandle}
            </a>
            <a href={site.telegram} target="_blank" rel="noopener noreferrer">
              <IconTelegram width={18} height={18} /> Telegram-канал
            </a>
          </div>
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
              placeholder="Пошук: тренч, пуховик, сатин…"
              aria-label="Пошук по каталогу"
            />
          </form>
          <button className="icon-btn" aria-label="Закрити пошук" onClick={() => setSearch(false)}>
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
              <p className="eyebrow">Популярне</p>
              <div className="chips">
                {["Пуховик", "Тренч", "Пальто", "Бомбер", "Шкіра", "Сорочка", "Сатин", "Льон"].map((w) => (
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
