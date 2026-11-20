"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Client-side store: bag, wishlist, demo account and demo order history (localStorage).
 * DEMO: the account and payments are not real yet — replace with a backend (auth + payment
 * provider) when the client is ready; keep this context API so the UI does not change.
 */

export interface BagLine {
  key: string;
  slug: string;
  name: string;
  color: string;
  size: string;
  image: string;
  price: number | null;
  qty: number;
}

export interface DemoUser {
  name: string;
  email: string;
  phone: string;
}

/** Body measurements in cm (strings as typed). CORSO adapts each model to them when sewing. */
export interface Measurements {
  height: string;
  bust: string;
  waist: string;
  hips: string;
}

export interface DemoOrder {
  id: string;
  date: string;
  lines: BagLine[];
  measurements?: Measurements;
  delivery: string;
  payment: string;
  status: string;
}

interface StoreValue {
  ready: boolean;
  bag: BagLine[];
  count: number;
  bagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  add: (line: Omit<BagLine, "key" | "qty">, open?: boolean) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clearBag: () => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  user: DemoUser | null;
  signIn: (u: DemoUser) => void;
  signOut: () => void;
  orders: DemoOrder[];
  addOrder: (o: DemoOrder) => void;
  measurements: Measurements | null;
  setMeasurements: (m: Measurements) => void;
}

const K = { bag: "corso.bag.v1", wish: "corso.wish.v1", user: "corso.user.v1", orders: "corso.orders.v1", measure: "corso.measure.v1" };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — keep in memory */
  }
}

const Ctx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [bag, setBag] = useState<BagLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [bagOpen, setBagOpen] = useState(false);

  useEffect(() => {
    setBag(read(K.bag, []));
    setWishlist(read(K.wish, []));
    setUser(read(K.user, null));
    setOrders(read(K.orders, []));
    setMeasurements(read(K.measure, null));
    setReady(true);
  }, []);

  useEffect(() => void (ready && write(K.bag, bag)), [bag, ready]);
  useEffect(() => void (ready && write(K.wish, wishlist)), [wishlist, ready]);
  useEffect(() => void (ready && write(K.user, user)), [user, ready]);
  useEffect(() => void (ready && write(K.orders, orders)), [orders, ready]);
  useEffect(() => void (ready && write(K.measure, measurements)), [measurements, ready]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", bagOpen);
  }, [bagOpen]);

  const add = useCallback<StoreValue["add"]>((line, open = true) => {
    const key = `${line.slug}|${line.color}|${line.size}`;
    setBag((prev) => {
      const hit = prev.find((l) => l.key === key);
      if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(9, l.qty + 1) } : l));
      return [...prev, { ...line, key, qty: 1 }];
    });
    if (open) setBagOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setBag((prev) => (qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(9, qty) } : l))));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      bag,
      count: bag.reduce((s, l) => s + l.qty, 0),
      bagOpen,
      openBag: () => setBagOpen(true),
      closeBag: () => setBagOpen(false),
      add,
      setQty,
      remove: (key) => setBag((prev) => prev.filter((l) => l.key !== key)),
      clearBag: () => setBag([]),
      wishlist,
      toggleWish: (slug) => setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug])),
      user,
      signIn: setUser,
      signOut: () => {
        setUser(null);
        setMeasurements(null);
      },
      orders,
      addOrder: (o) => setOrders((prev) => [o, ...prev]),
      measurements,
      setMeasurements,
    }),
    [ready, bag, bagOpen, add, setQty, wishlist, user, orders, measurements],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside <StoreProvider>");
  return v;
}
