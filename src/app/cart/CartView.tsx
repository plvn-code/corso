"use client";

import { useLang } from "@/i18n/client";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { BagLines } from "@/components/BagDrawer";

export function CartView() {
  const { bag, ready, count } = useStore();
  const { tr } = useLang();
  return (
    <div className="narrow">
      <header className="page-head">
        <p className="eyebrow">Shopping bag</p>
        <h1 className="h-title h-xl">{tr("Кошик", "Bag")}</h1>
      </header>
      {!ready ? null : bag.length === 0 ? (
        <div className="empty">
          <p className="title-sm">{tr("Кошик порожній", "Your bag is empty")}</p>
          <Link href="/catalog" className="btn btn--dark">
            {tr("До каталогу", "Go to shop")}
          </Link>
        </div>
      ) : (
        <div className="cart">
          <BagLines />
          <aside className="summary">
            <div className="sum-row">
              <span>{tr("Товарів", "Items")}</span>
              <span>{count}</span>
            </div>
            <div className="sum-row">
              <span>{tr("Доставка", "Delivery")}</span>
              <span>{tr("за тарифами перевізника", "carrier rates")}</span>
            </div>
            <div className="sum-row sum-row--total">
              <span>{tr("Разом", "Total")}</span>
              <span>₴</span>
            </div>
            <p className="muted small">{tr("Ціни на сайті оновлюються — точну суму підтвердить менеджер.", "Prices are being updated — our manager will confirm the exact total.")}</p>
            <Link href="/checkout" className="btn btn--dark btn--block">
              {tr("Оформити замовлення", "Checkout")}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
