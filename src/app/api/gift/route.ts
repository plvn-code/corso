import { NextResponse } from "next/server";
import { GIFT_DESIGNS, GIFT_MESSAGE_MAX, GIFT_VALID_MONTHS, isEmail, isPhone, validAmount } from "@/lib/gift";
import { clip, notifyManagers } from "@/lib/telegram";

/**
 * Gift certificate request. DEMO stage: no payment provider yet — the request is validated and sent
 * to the managers' Telegram chat as «awaiting payment» (or logged without TELEGRAM_* env).
 * Next stage: create a payment (LiqPay / WayForPay / Monobank) and issue + e-mail the certificate on success.
 */
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const to = (b.to ?? {}) as Record<string, unknown>;
  const from = (b.from ?? {}) as Record<string, unknown>;
  const amount = Number(b.amount);
  const design = GIFT_DESIGNS.find((d) => d.id === b.design)?.uk ?? "Noir";
  const sendOn = /^\d{4}-\d{2}-\d{2}$/.test(String(b.sendOn ?? "")) ? String(b.sendOn) : "";
  const ok =
    validAmount(amount) &&
    clip(to.name, 80).trim() &&
    isEmail(clip(to.email, 120)) &&
    clip(from.name, 80).trim() &&
    isEmail(clip(from.email, 120)) &&
    isPhone(clip(from.phone, 40));
  if (!ok) return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });

  const id = `GC-${Date.now().toString().slice(-6)}`;
  const text = [
    `🎁 Подарунковий сертифікат ${id} — очікує оплати`,
    `Сума: ${new Intl.NumberFormat("uk-UA").format(amount)} грн · дизайн ${design}`,
    `Кому: ${clip(to.name, 80)} · ${clip(to.email, 120)}`,
    `Від: ${clip(from.name, 80)} · ${clip(from.phone, 40)} · ${clip(from.email, 120)}`,
    `Надіслати: ${sendOn || "одразу після оплати"} · діє ${GIFT_VALID_MONTHS} міс. з дня оплати`,
    b.message ? `💬 ${clip(b.message, GIFT_MESSAGE_MAX)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  try {
    await notifyManagers(text);
  } catch {
    return NextResponse.json({ ok: false, error: "notify failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, id });
}
