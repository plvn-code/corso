import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/ProductView";
import { ProductCard } from "@/components/ProductCard";
import { TAG_LABEL, categoryName, getProduct, photo, products, related, toCard } from "@/lib/catalog";
import { site } from "@/lib/site";

type Params = Promise<{ slug: string }>;
type SP = Promise<Record<string, string | string[] | undefined>>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.description[0],
    openGraph: { title: `${p.name} — CORSO`, description: p.description[0], images: [photo(p.slug, p.colors[0].photos[0])] },
  };
}

export default async function ProductPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const sp = await searchParams;
  const color = Number(Array.isArray(sp.color) ? sp.color[0] : sp.color) || 0;
  const card = toCard(p);
  const more = related(p).map(toCard);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    brand: { "@type": "Brand", name: "CORSO" },
    description: p.description.join(" "),
    image: p.colors.flatMap((c) => c.photos.map((id) => `${site.url}${photo(p.slug, id)}`)).slice(0, 6),
    color: p.colors.map((c) => c.name).join(", "),
  };

  return (
    <>
      <ProductView
        initialColor={color}
        p={{
          slug: p.slug,
          name: p.name,
          line: p.line,
          category: p.category,
          categoryName: categoryName(p.category),
          price: p.price,
          tag: p.tags[0] ? TAG_LABEL[p.tags[0]] : undefined,
          sizes: p.sizes,
          sizeNote: p.sizeNote,
          description: p.description,
          details: p.details,
          composition: p.composition,
          colors: card.colors,
        }}
      />
      <section className="sec related">
        <header className="sec__head">
          <p className="eyebrow">You may also like</p>
          <h2 className="h-title">Вам також сподобається</h2>
        </header>
        <div className="grid grid--home">
          {more.map((c) => (
            <ProductCard key={c.slug} p={c} />
          ))}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
