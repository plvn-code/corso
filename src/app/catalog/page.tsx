import type { Metadata } from "next";
import { CatalogGrid } from "@/components/CatalogGrid";
import { CATEGORIES, COLLECTIONS, COLOR_FAMILIES, query, toCard } from "@/lib/catalog";
import { getTr } from "@/i18n/server";
import type { Tr } from "@/i18n/lang";

type SP = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

function heading(p: Record<string, string | undefined>, tr: Tr) {
  if (p.q) return { kicker: tr("Пошук", "Search"), title: `«${p.q}»` };
  if (p.c === "new") return { kicker: "New In", title: tr("Новинки", "New in") };
  if (p.c === "bestseller") return { kicker: "Bestsellers", title: tr("Бестселери", "Bestsellers") };
  const cat = CATEGORIES.find((c) => c.slug === p.c);
  if (cat) return { kicker: tr(cat.en, "Category"), title: tr(cat.name, cat.en) };
  const col = COLLECTIONS.find((c) => c.slug === p.col);
  if (col) return { kicker: tr(col.en, "Collection"), title: tr(col.name, col.en) };
  return { kicker: "The Collection", title: tr("Каталог", "Shop") };
}

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const { tr } = await getTr();
  const h = heading({ c: one(sp.c), col: one(sp.col), q: one(sp.q) }, tr);
  return { title: h.title };
}

export default async function CatalogPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const params = { c: one(sp.c), col: one(sp.col), color: one(sp.color), size: one(sp.size), sort: one(sp.sort), q: one(sp.q) };
  const { lang, tr } = await getTr();
  const list = query(params, lang);
  const h = heading(params, tr);
  const keep = (c?: string) => {
    const s = new URLSearchParams();
    if (c) s.set("c", c);
    if (params.col) s.set("col", params.col);
    return `/catalog${s.size ? `?${s}` : ""}`;
  };
  const chips = [
    { href: keep(), label: tr("Усі", "All"), on: !params.c },
    { href: keep("new"), label: tr("Новинки", "New in"), on: params.c === "new" },
    ...CATEGORIES.map((c) => ({ href: keep(c.slug), label: tr(c.name, c.en), on: params.c === c.slug })),
  ];
  return (
    <div className="cat">
      <header className="page-head">
        <p className="eyebrow">{h.kicker}</p>
        <h1 className="h-title h-xl">{h.title}</h1>
      </header>
      <CatalogGrid
        cards={list.map(toCard)}
        params={params}
        chips={chips}
        title={h.title}
        collections={COLLECTIONS.map((c) => ({ slug: c.slug, name: tr(c.name, c.en) }))}
        colors={COLOR_FAMILIES.map((c) => ({ slug: c.slug, name: tr(c.name, c.en), hex: c.hex }))}
        sizes={[
          { slug: "XS", name: "XS" },
          { slug: "S", name: "S" },
          { slug: "M", name: "M" },
          { slug: "L", name: "L" },
          { slug: "XL", name: "XL" },
          { slug: "one", name: "One size" },
        ]}
      />
    </div>
  );
}
