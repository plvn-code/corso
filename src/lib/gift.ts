/**
 * CORSO gift certificate — rules shared by the form and /api/gift.
 * Payment is not connected yet: the request is validated and sent to the managers
 * as «awaiting payment»; the certificate itself is issued after payment (next stage).
 */
export const GIFT_MIN = 1000;
export const GIFT_MAX = 100000;
export const GIFT_PRESETS = [1000, 2000, 3000, 5000, 10000];
export const GIFT_MESSAGE_MAX = 300;
/** Validity from the date of payment (client, 2026-11-20). */
export const GIFT_VALID_MONTHS = 6;

/** «6 місяців» / «3 місяці» / «1 місяць» */
export function monthsUk(n: number) {
  const d = n % 10, h = n % 100;
  const w = d === 1 && h !== 11 ? "місяць" : d >= 2 && d <= 4 && (h < 12 || h > 14) ? "місяці" : "місяців";
  return `${n} ${w}`;
}
export const GIFT_VALID_UK = monthsUk(GIFT_VALID_MONTHS);

export const GIFT_DESIGNS = [
  { id: "noir", uk: "Noir", en: "Noir" },
  { id: "milk", uk: "Milk", en: "Milk" },
] as const;
export type GiftDesign = (typeof GIFT_DESIGNS)[number]["id"];

export interface GiftRequest {
  amount: number;
  design: GiftDesign;
  to: { name: string; email: string };
  from: { name: string; email: string; phone: string };
  message: string;
  /** ISO date (YYYY-MM-DD) or "" = right after payment */
  sendOn: string;
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => v.replace(/[^\d]/g, "").length >= 10;
export const validAmount = (n: number) => Number.isInteger(n) && n >= GIFT_MIN && n <= GIFT_MAX;
