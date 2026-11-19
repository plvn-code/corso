"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { BagLines } from "@/components/BagDrawer";

export function CartView() {
  const { bag, ready, count } = useStore();
  return (
    <div className="narrow">
      <header className="page-head">
        <p className="eyebrow">Shopping bag</p>
        <h1 className="h-title h-xl">Кошик</h1>
      </header>
      {!ready ? null : bag.length === 0 ? (
        <div className="empty">
          <p className="title-sm">Кошик порожній</p>
          <Link href="/catalog" className="btn btn--dark">
            До каталогу
          </Link>
        </div>
      ) : (
        <div className="cart">
          <BagLines />
          <aside className="summary">
            <div className="sum-row">
              <span>Товарів</span>
              <span>{count}</span>
            </div>
            <div className="sum-row">
              <span>Доставка</span>
              <span>за тарифами перевізника</span>
            </div>
            <div className="sum-row sum-row--total">
              <span>Разом</span>
              <span>₴</span>
            </div>
            <p className="muted small">Ціни на сайті оновлюються — точну суму підтвердить менеджер.</p>
            <Link href="/checkout" className="btn btn--dark btn--block">
              Оформити замовлення
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
