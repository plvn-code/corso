"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard, type CardData } from "./ProductCard";
import { IconClose, IconGrid1, IconGrid2 } from "./Icons";

interface Opt {
  slug: string;
  name: string;
  hex?: string;
}

interface Props {
  cards: CardData[];
  params: Record<string, string | undefined>;
  chips: { href: string; label: string; on: boolean }[];
  collections: Opt[];
  colors: Opt[];
  sizes: Opt[];
  title: string;
}

export function CatalogGrid({ cards, params, chips, collections, colors, sizes, title }: Props) {
  const router = useRouter();
  const [cols, setCols] = useState<1 | 2>(2);
  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState(params);

  useEffect(() => {
    try {
      if (localStorage.getItem("corso.cols") === "1") setCols(1);
    } catch {}
  }, []);
  useEffect(() => setDraft(params), [params]);
  useEffect(() => {
    document.documentElement.classList.toggle("is-menu", sheet);
  }, [sheet]);

  const setView = (n: 1 | 2) => {
    setCols(n);
    try {
      localStorage.setItem("corso.cols", String(n));
    } catch {}
  };

  const toggle = (k: string, v: string) => setDraft((d) => ({ ...d, [k]: d[k] === v ? undefined : v }));
  const apply = (d: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    Object.entries(d).forEach(([k, v]) => v && sp.set(k, v));
    router.push(`/catalog${sp.size ? `?${sp}` : ""}`, { scroll: false });
    setSheet(false);
  };
  const active = ["col", "color", "size", "sort"].filter((k) => params[k]).length;

  return (
    <>
      <div className="cat-bar">
        <div className="chips chips--scroll">
          {chips.map((c) => (
            <Link key={c.href} href={c.href} className={`chip${c.on ? " is-on" : ""}`} scroll={false}>
              {c.label}
            </Link>
          ))}
        </div>
        <div className="cat-tools">
          <span className="muted small">{cards.length} моделей</span>
          <div className="cat-tools__r">
            <button className={`icon-btn view-btn${cols === 1 ? " is-on" : ""}`} aria-label="Одна колонка" onClick={() => setView(1)}>
              <IconGrid1 width={18} height={18} />
            </button>
            <button className={`icon-btn view-btn${cols === 2 ? " is-on" : ""}`} aria-label="Дві колонки" onClick={() => setView(2)}>
              <IconGrid2 width={18} height={18} />
            </button>
            <button className="link-btn filter-btn" onClick={() => setSheet(true)}>
              Фільтр{active ? ` (${active})` : ""}
            </button>
          </div>
        </div>
      </div>

      {cards.length === 0 ? (
        <div className="empty">
          <p className="title-sm">Нічого не знайдено</p>
          <p className="muted">Спробуйте змінити фільтри.</p>
          <Link href="/catalog" className="btn btn--dark">
            Скинути фільтри
          </Link>
        </div>
      ) : (
        <div className={`grid grid--cat${cols === 1 ? " grid--one" : ""}`} aria-label={title}>
          {cards.map((p, i) => (
            <div key={p.slug} data-reveal style={{ "--d": `${(i % 4) * 60}ms` } as React.CSSProperties}>
              <ProductCard p={p} priority={i < 4} sizes={cols === 1 ? "(max-width: 760px) 100vw, 25vw" : undefined} />
            </div>
          ))}
        </div>
      )}

      <div className={`scrim${sheet ? " is-open" : ""}`} onClick={() => setSheet(false)} />
      <aside className={`sheet${sheet ? " is-open" : ""}`} aria-hidden={!sheet} aria-label="Фільтр">
        <div className="drawer__head">
          <p className="eyebrow">Фільтр</p>
          <button className="icon-btn" aria-label="Закрити" onClick={() => setSheet(false)}>
            <IconClose />
          </button>
        </div>
        <div className="sheet__body">
          <fieldset>
            <legend>Колекція</legend>
            <div className="chips">
              {collections.map((o) => (
                <button key={o.slug} className={`chip${draft.col === o.slug ? " is-on" : ""}`} onClick={() => toggle("col", o.slug)}>
                  {o.name}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Колір</legend>
            <div className="color-opts">
              {colors.map((o) => (
                <button key={o.slug} className={`color-opt${draft.color === o.slug ? " is-on" : ""}`} onClick={() => toggle("color", o.slug)}>
                  <i style={{ background: o.hex }} />
                  {o.name}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Розмір</legend>
            <div className="chips">
              {sizes.map((o) => (
                <button key={o.slug} className={`chip chip--size${draft.size === o.slug ? " is-on" : ""}`} onClick={() => toggle("size", o.slug)}>
                  {o.name}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Сортування</legend>
            <div className="chips">
              <button className={`chip${!draft.sort ? " is-on" : ""}`} onClick={() => setDraft((d) => ({ ...d, sort: undefined }))}>
                Рекомендовані
              </button>
              <button className={`chip${draft.sort === "az" ? " is-on" : ""}`} onClick={() => setDraft((d) => ({ ...d, sort: "az" }))}>
                За назвою А–Я
              </button>
            </div>
          </fieldset>
        </div>
        <div className="drawer__foot sheet__foot">
          <button className="btn btn--line" onClick={() => apply({ c: params.c, q: params.q })}>
            Скинути
          </button>
          <button className="btn btn--dark" onClick={() => apply(draft)}>
            Показати
          </button>
        </div>
      </aside>
    </>
  );
}
