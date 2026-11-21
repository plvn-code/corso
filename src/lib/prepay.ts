/**
 * Cash on delivery with prepayment (client, 2026-11-21): the client pays a prepayment online
 * — at least 400 UAH, or more if they wish — and the rest on delivery.
 */
export const PREPAY_MIN = 400;
export const PREPAY_MAX = 100000;
export const PREPAY_PRESETS = [400, 500, 1000, 2000];
export const validPrepay = (n: number) => Number.isInteger(n) && n >= PREPAY_MIN && n <= PREPAY_MAX;
/** Link that opens checkout with «cash on delivery + prepayment» selected. */
export const PREPAY_HREF = "/checkout?pay=prepay";
