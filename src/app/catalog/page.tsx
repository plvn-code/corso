import type { Metadata } from "next";
import { CatalogGrid } from "@/components/CatalogGrid";
import { CATEGORIES, COLLECTIONS, COLOR_FAMILIES, query, toCard } from "@/lib/catalog";

type SP = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

function heading(p: Record<string, string | undefined>) {
  if (p.q) return { kicker: "Пошук", title: `«${p.q}»` };
  if (p.c === "new") return { kicker: "New In", title: "Новинки" };
  if (p.c === "bestseller") return { kicker: "Bestsellers", title: "Бестселери" };
  const cat = CATEGORIES.find((c) => c.slug === p.c);
  if (cat) return { kicker: cat.en, title: cat.name };
  const col = COLLECTIONS.find((c) => c.slug === p.col);
  if (col) return { kicker: col.en, title: col.name };
  return { kicker: "The Collection", title: "Каталог" };
}

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  const h = heading({ c: one(sp.c), col: one(sp.col), q: one(sp.q) });
  return { title: h.title };
}

export default async function CatalogPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const params = { c: one(sp.c), col: one(sp.col), color: one(sp.color), size: one(sp.size), sort: one(sp.sort), q: one(sp.q) };
  const list = query(params);
  const h = heading(params);
  const keep = (c?: string) => {
    const s = new URLSearchParams();
    if (c) s.set("c", c);
    if (params.col) s.set("col", params.col);
    return `/catalog${s.size ? `?${s}` : ""}`;
  };
  const chips = [
    { href: keep(), label: "Усі", on: !params.c },
    { href: keep("new"), label: "Новинки", on: params.c === "new" },
    ...CATEGORIES.map((c) => ({ href: keep(c.slug), label: c.name, on: params.c === c.slug })),
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
        collections={COLLECTIONS.map((c) => ({ slug: c.slug, name: c.name }))}
        colors={COLOR_FAMILIES.map((c) => ({ slug: c.slug, name: c.name, hex: c.hex }))}
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
