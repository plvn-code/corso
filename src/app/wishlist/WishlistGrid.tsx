"use client";

import { useLang } from "@/i18n/client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ProductCard, type CardData } from "@/components/ProductCard";

export function WishlistGrid({ all }: { all: CardData[] }) {
  const { wishlist, ready } = useStore();
  const { tr } = useLang();
  if (!ready) return null;
  const list = all.filter((p) => wishlist.includes(p.slug));
  if (list.length === 0)
    return (
      <div className="empty">
        <p className="title-sm">{tr("Тут поки порожньо", "Nothing here yet")}</p>
        <p className="muted">{tr("Натискайте ♡ на картках, щоб зберегти улюблені моделі.", "Tap ♡ on any piece to save it here.")}</p>
        <Link href="/catalog" className="btn btn--dark">
          {tr("До каталогу", "Go to shop")}
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
