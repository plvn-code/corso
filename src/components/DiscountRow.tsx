"use client";

import Link from "next/link";
import { useLang } from "@/i18n/client";
import { formatPrice } from "@/lib/format";
import { FIRST_ORDER_PCT, REGISTER_HREF, useBagTotals } from "@/lib/discount";

/** First-order discount line for the bag drawer, cart and checkout summaries. */
export function DiscountRow({ onNavigate }: { onNavigate?: () => void }) {
  const { tr } = useLang();
  const { eligible, guest, discount } = useBagTotals();
  if (eligible)
    return (
      <div className="sum-row sum-row--discount">
        <span>{tr("Знижка на перше замовлення", "First order discount")}</span>
        <b>{discount != null ? `−${formatPrice(discount)}` : `−${FIRST_ORDER_PCT}%`}</b>
      </div>
    );
  if (guest)
    return (
      <Link href={REGISTER_HREF} className="disc-hint" onClick={onNavigate}>
        {tr(`Зареєструйтеся — і отримайте −${FIRST_ORDER_PCT}% на перше замовлення`, `Sign up and get −${FIRST_ORDER_PCT}% off your first order`)} →
      </Link>
    );
  return null;
}

/** «Разом» value: real total when prices are known, otherwise «₴». */
export function TotalValue() {
  const { total } = useBagTotals();
  return <>{formatPrice(total)}</>;
}
