"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { ProductCard, type CardData } from "@/components/ProductCard";

export function WishlistGrid({ all }: { all: CardData[] }) {
  const { wishlist, ready } = useStore();
  if (!ready) return null;
  const list = all.filter((p) => wishlist.includes(p.slug));
  if (list.length === 0)
    return (
      <div className="empty">
        <p className="serif-lg">Тут поки порожньо</p>
        <p className="muted">Натискайте ♡ на картках, щоб зберегти улюблені моделі.</p>
        <Link href="/catalog" className="btn btn--dark">
          До каталогу
        </Link>
      </div>
    );
  return (
    <div className="grid grid--cat">
      {list.map((p) => (
        <ProductCard key={p.slug} p={p} />
      ))}
    </div>
  );
}
