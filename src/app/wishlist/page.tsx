import type { Metadata } from "next";
import { getTr } from "@/i18n/server";
import { localize, products, toCard } from "@/lib/catalog";
import { WishlistGrid } from "./WishlistGrid";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await getTr();
  return { title: tr("Обране", "Wishlist") };
}

export default async function WishlistPage() {
  const { lang, tr } = await getTr();
  return (
    <div className="cat">
      <header className="page-head">
        <p className="eyebrow">Wishlist</p>
        <h1 className="h-title h-xl">{tr("Обране", "Wishlist")}</h1>
      </header>
      <WishlistGrid all={products.map((p) => toCard(localize(p, lang)))} />
    </div>
  );
}
