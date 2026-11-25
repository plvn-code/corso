import { NextResponse } from "next/server";
import { clip, notifyManagers } from "@/lib/telegram";

/** Online return / exchange request (page «Обмін і повернення») → managers' Telegram chat (or log). */
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const kind = b.kind === "exchange" ? "exchange" : "return";
  const name = clip(b.name, 80).trim();
  const phone = clip(b.phone, 40).trim();
  const items = clip(b.items, 600).trim();
  const wish = clip(b.wish, 200).trim();
  if (!name || phone.replace(/[^\d]/g, "").length < 10 || !items || b.confirm !== true || (kind === "exchange" && !wish)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }
  const id = `R-${Date.now().toString().slice(-6)}`;
  const text = [
    `↩️ Заява на ${kind === "exchange" ? "обмін" : "повернення"} ${id}`,
    `${name} · ${phone}`,
    b.order ? `Замовлення: ${clip(b.order, 40)}` : "",
    `Товар: ${items}`,
    `Причина: ${clip(b.reason, 120) || "—"}`,
    kind === "exchange" ? `Бажаний розмір / колір: ${wish}` : "",
    b.comment ? `💬 ${clip(b.comment, 500)}` : "",
    "Клієнт підтвердив: товар не був у використанні, бірки й пакування збережено, є чек.",
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
