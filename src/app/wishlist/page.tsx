import type { Metadata } from "next";
import { products, toCard } from "@/lib/catalog";
import { WishlistGrid } from "./WishlistGrid";

export const metadata: Metadata = { title: "Обране" };

export default function WishlistPage() {
  return (
    <div className="cat">
      <header className="page-head">
        <p className="eyebrow">Wishlist</p>
        <h1 className="h-title h-xl">Обране</h1>
      </header>
      <WishlistGrid all={products.map(toCard)} />
    </div>
  );
}
