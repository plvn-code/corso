import raw from "@/data/products.json";
import rawEn from "@/data/products.en.json";
import type { Lang } from "@/i18n/lang";

export type CategorySlug = "puhovyky" | "palta" | "kurtky" | "sety" | "shkira" | "sorochky" | "sukni" | "basic";
export type CollectionSlug = "fw26" | "ss26";
export type Tag = "new" | "bestseller" | "limited";

export interface Color {
  name: string;
  hex: string;
  photos: string[];
}

export interface Product {
  slug: string;
  name: string;
  line: string;
  category: CategorySlug;
  collection: CollectionSlug;
  tags: Tag[];
  sizes: string[];
  sizeNote?: string;
  description: string[];
  details: string[];
  composition: string[];
  colors: Color[];
  /** price in UAH; null until the client confirms the price list */
  price: number | null;
}

export const CATEGORIES: { slug: CategorySlug; name: string; en: string }[] = [
  { slug: "puhovyky", name: "Пуховики", en: "Puffers" },
  { slug: "palta", name: "Пальта і тренчі", en: "Coats & Trenches" },
  { slug: "kurtky", name: "Бомбери і парки", en: "Bombers & Parkas" },
  { slug: "sety", name: "Сети і костюми", en: "Sets" },
  { slug: "shkira", name: "Шкіряна лінійка", en: "Leather" },
  { slug: "sorochky", name: "Сорочки", en: "Shirts" },
  { slug: "sukni", name: "Сукні", en: "Dresses" },
  { slug: "basic", name: "База", en: "Basics" },
];

export const COLLECTIONS: { slug: CollectionSlug; name: string; en: string }[] = [
  { slug: "fw26", name: "Осінь — зима 26/27", en: "Fall Winter 26/27" },
  { slug: "ss26", name: "Літо 26", en: "Summer 26" },
];

export const TAG_LABEL: Record<Tag, string> = { new: "New", bestseller: "Bestseller", limited: "Limited" };

const PRICES: Record<string, number> = {
  // Fill in when the client sends the price list, e.g. "trench-coat": 11950
};

export const products: Product[] = (raw as Omit<Product, "price">[]).map((p) => ({
  ...p,
  price: PRICES[p.slug] ?? null,
}));

/** English texts per slug (src/data/products.en.json); Ukrainian stays in products.json. */
type EnText = Pick<Product, "name" | "description" | "details" | "composition"> & { sizeNote?: string };
const EN = rawEn as Record<string, EnText>;

/** Product with texts in the requested language (falls back to Ukrainian). */
export function localize(p: Product, lang: Lang): Product {
  const en = lang === "en" ? EN[p.slug] : undefined;
  return en ? { ...p, ...en, sizeNote: en.sizeNote ?? p.sizeNote } : p;
}

export function photo(slug: string, id: string) {
  return `/images/p/${slug}/${id}.jpg`;
}

export function getProduct(slug: string, lang: Lang = "uk") {
  const p = products.find((x) => x.slug === slug);
  return p && localize(p, lang);
}

export function categoryName(slug: string, lang: Lang = "uk") {
  const c = CATEGORIES.find((x) => x.slug === slug);
  return c ? (lang === "en" ? c.en : c.name) : "";
}

export function collectionName(slug: string, lang: Lang = "uk") {
  const c = COLLECTIONS.find((x) => x.slug === slug);
  return c ? (lang === "en" ? c.en : c.name) : "";
}

/** Colour families used by the catalogue filter. */
export const COLOR_FAMILIES: { slug: string; name: string; en: string; hex: string; match: RegExp }[] = [
  { slug: "black", name: "Чорний", en: "Black", hex: "#111111", match: /black|graphite/i },
  { slug: "milk", name: "Молочний", en: "Milk / white", hex: "#efe8da", match: /milk|white|ecru|cream|light beige/i },
  { slug: "beige", name: "Бежевий / кемел", en: "Beige / camel", hex: "#b48a5c", match: /camel|beige|caramel|cappuccino/i },
  { slug: "grey", name: "Сірий", en: "Grey", hex: "#9a9a9a", match: /grey|melange/i },
  { slug: "blue", name: "Синій / блакитний", en: "Blue", hex: "#3b5a8c", match: /blue|navy|lagoon/i },
  { slug: "red", name: "Червоний / бордо", en: "Red / burgundy", hex: "#b3182a", match: /red|burgundy|poppy/i },
  { slug: "pink", name: "Рожевий / ліловий", en: "Pink / lilac", hex: "#d9a6c4", match: /pink|powder|lilac|purple/i },
  { slug: "green", name: "Зелений", en: "Green", hex: "#7fb58d", match: /green|mint/i },
];

export function colorFamilies(p: Product) {
  return COLOR_FAMILIES.filter((f) => p.colors.some((c) => f.match.test(c.name))).map((f) => f.slug);
}

export function sizeFamilies(p: Product) {
  const out = new Set<string>();
  for (const s of p.sizes) {
    if (/one size|oversize/i.test(s)) out.add("one");
    for (const part of s.toUpperCase().split("/")) if (["XS", "S", "M", "L", "XL"].includes(part)) out.add(part);
  }
  return [...out];
}

export type Sort = "new" | "az";

export function query(opts: { c?: string; col?: string; color?: string; size?: string; sort?: string; q?: string }, lang: Lang = "uk") {
  let list = products.map((p) => localize(p, lang));
  if (opts.c === "new") list = list.filter((p) => p.tags.includes("new"));
  else if (opts.c === "bestseller") list = list.filter((p) => p.tags.includes("bestseller"));
  else if (opts.c) list = list.filter((p) => p.category === opts.c);
  if (opts.col) list = list.filter((p) => p.collection === opts.col);
  if (opts.color) list = list.filter((p) => colorFamilies(p).includes(opts.color!));
  if (opts.size) list = list.filter((p) => sizeFamilies(p).includes(opts.size!));
  if (opts.q) {
    const q = opts.q.toLowerCase().trim();
    list = list.filter((p) =>
      [p.name, EN[p.slug]?.name ?? "", products.find((x) => x.slug === p.slug)!.name, p.line, categoryName(p.category), categoryName(p.category, "en"), ...p.colors.map((c) => c.name)]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  if (opts.sort === "az") list.sort((a, b) => a.name.localeCompare(b.name, lang));
  return list;
}

export function related(p: Product, n = 4, lang: Lang = "uk") {
  const same = products.filter((x) => x.slug !== p.slug && x.category === p.category);
  const rest = products.filter((x) => x.slug !== p.slug && x.category !== p.category && x.collection === p.collection);
  return [...same, ...rest].slice(0, n).map((x) => localize(x, lang));
}

/** Serializable card payload for client components. */
export function toCard(p: Product) {
  const tag = p.tags[0] ? TAG_LABEL[p.tags[0]] : undefined;
  return {
    slug: p.slug,
    name: p.name,
    line: p.line,
    price: p.price,
    tag,
    colors: p.colors.map((c) => ({ name: c.name, hex: c.hex, images: c.photos.map((id) => photo(p.slug, id)) })),
  };
}
