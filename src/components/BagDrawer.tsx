"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { IconClose, IconMinus, IconPlus } from "./Icons";

export function BagLines({ compact = false }: { compact?: boolean }) {
  const { bag, setQty, remove } = useStore();
  return (
    <ul className={`lines${compact ? " lines--compact" : ""}`}>
      {bag.map((l) => (
        <li key={l.key} className="line">
          <Link href={`/product/${l.slug}`} className="line__img">
            <Image src={l.image} alt={l.name} width={96} height={144} />
          </Link>
          <div className="line__body">
            <Link href={`/product/${l.slug}`} className="line__name">
              {l.name}
            </Link>
            <p className="line__meta">
              {l.color} · {l.size}
            </p>
            <div className="line__row">
              <div className="qty">
                <button aria-label="Менше" onClick={() => setQty(l.key, l.qty - 1)}>
                  <IconMinus width={14} height={14} />
                </button>
                <span>{l.qty}</span>
                <button aria-label="Більше" onClick={() => setQty(l.key, l.qty + 1)}>
                  <IconPlus width={14} height={14} />
                </button>
              </div>
              <span className="line__price">{formatPrice(l.price == null ? null : l.price * l.qty)}</span>
            </div>
            <button className="link-btn line__rm" onClick={() => remove(l.key)}>
              Видалити
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function BagDrawer() {
  const { bag, bagOpen, closeBag, count } = useStore();
  const pathname = usePathname();

  useEffect(() => {
    closeBag();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <div className={`scrim${bagOpen ? " is-open" : ""}`} onClick={closeBag} />
      <aside className={`drawer${bagOpen ? " is-open" : ""}`} aria-hidden={!bagOpen} aria-label="Кошик">
        <div className="drawer__head">
          <p className="eyebrow">Кошик {count > 0 && `(${count})`}</p>
          <button className="icon-btn" aria-label="Закрити кошик" onClick={closeBag}>
            <IconClose />
          </button>
        </div>
        {bag.length === 0 ? (
          <div className="drawer__empty">
            <p className="serif-lg">Кошик порожній</p>
            <p className="muted">Почніть з новинок сезону осінь — зима 26/27.</p>
            <Link href="/catalog?c=new" className="btn btn--dark" onClick={closeBag}>
              Дивитись новинки
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer__body">
              <BagLines compact />
            </div>
            <div className="drawer__foot">
              <div className="sum-row">
                <span>Разом</span>
                <span>₴</span>
              </div>
              <p className="muted small">Вартість підтвердить менеджер. Доставка — за тарифами перевізника.</p>
              <Link href="/checkout" className="btn btn--dark btn--block" onClick={closeBag}>
                Оформити замовлення
              </Link>
              <Link href="/cart" className="btn btn--line btn--block" onClick={closeBag}>
                Переглянути кошик
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
