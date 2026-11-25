"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/client";
import { useStore } from "@/lib/store";
import { FIRST_ORDER_PCT, REGISTER_HREF } from "@/lib/discount";
import { Monogram } from "./Monogram";
import { IconClose } from "./Icons";

const KEY = "corso.promo.v1";

/** «Реєструйтеся та отримуйте знижку −5% на перше замовлення» — once per visitor, a few seconds after entering (client, 2026-11-25). */
export function WelcomePopup() {
  const { tr } = useLang();
  const { user, orders, ready } = useStore();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready || user || orders.length > 0) return;
    if (/^\/(account|checkout|cart)/.test(pathname)) return;
    let seen = false;
    try {
      seen = !!localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    if (seen) return;
    const t = setTimeout(() => setOpen(true), 2500);
    return () => clearTimeout(t);
  }, [ready, user, orders.length, pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", open);
  }, [open]);

  function close() {
    setOpen(false);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;
  return (
    <div className="promo" role="dialog" aria-modal="true" aria-label={tr("Знижка на перше замовлення", "First order discount")} onClick={close}>
      <div className="promo__box" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn promo__close" aria-label={tr("Закрити", "Close")} onClick={close}>
          <IconClose />
        </button>
        <Monogram className="promo__mono" />
        <p className="eyebrow">CORSO Edit Club</p>
        <p className="promo__pct">−{FIRST_ORDER_PCT}%</p>
        <p className="promo__t">{tr("Реєструйтеся та отримуйте знижку на перше замовлення", "Sign up and get a discount on your first order")}</p>
        <p className="muted small">{tr("Знижка застосується в кошику автоматично.", "The discount is applied in your bag automatically.")}</p>
        <Link href={REGISTER_HREF} className="btn btn--dark btn--block" onClick={close}>
          {tr("Зареєструватися", "Sign up")}
        </Link>
        <button type="button" className="link-btn promo__later" onClick={close}>
          {tr("Пізніше", "Maybe later")}
        </button>
      </div>
    </div>
  );
}
