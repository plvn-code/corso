"use client";

import { useStore } from "./store";

/**
 * −5% on the first order for registered clients (client, 2026-11-25).
 * DEMO: «registered» and «first order» are checked against the demo account and order history in
 * localStorage; with a real backend check the customer's orders on the server.
 */
export const FIRST_ORDER_PCT = 5;
export const REGISTER_HREF = "/account?mode=up";

export function useBagTotals() {
  const { bag, user, orders, ready } = useStore();
  const known = bag.length > 0 && bag.every((l) => l.price != null);
  const subtotal = known ? bag.reduce((s, l) => s + (l.price ?? 0) * l.qty, 0) : null;
  const eligible = ready && !!user && orders.length === 0;
  const discount = eligible && subtotal != null ? Math.round((subtotal * FIRST_ORDER_PCT) / 100) : null;
  const total = subtotal != null ? subtotal - (discount ?? 0) : null;
  return { subtotal, discount, total, eligible, guest: ready && !user && orders.length === 0 };
}
