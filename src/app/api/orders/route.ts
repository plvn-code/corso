import { NextResponse } from "next/server";
import { getProduct } from "@/lib/catalog";
import { clip, notifyManagers } from "@/lib/telegram";

/**
 * Order intake. DEMO stage: validates the order against the catalogue and forwards it to
 * Telegram when TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID are set; otherwise only logs it.
 * Online payment is not connected yet (see docs/STATUS.md).
 */

/** Body measurements (cm) — CORSO sews in-house and adapts each model to them. */
const MEASURES = [
  { key: "height", label: "Зріст", min: 140, max: 200 },
  { key: "bust", label: "Груди", min: 70, max: 150 },
  { key: "waist", label: "Талія", min: 50, max: 140 },
  { key: "hips", label: "Стегна", min: 75, max: 160 },
] as const;

function readMeasurements(raw: unknown): string | null {
  const m = (raw ?? {}) as Record<string, unknown>;
  const parts: string[] = [];
  for (const f of MEASURES) {
    const v = Number(String(m[f.key] ?? "").replace(",", "."));
    if (!Number.isFinite(v) || v < f.min || v > f.max) return null;
    parts.push(`${f.label} ${v}`);
  }
  return parts.join(" · ") + " см";
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const c = (body.customer ?? {}) as Record<string, unknown>;
  const rawLines = Array.isArray(body.lines) ? body.lines.slice(0, 30) : [];
  const lines = rawLines
    .map((l: Record<string, unknown>) => {
      const p = getProduct(clip(l.slug, 80));
      if (!p) return null;
      const qty = Math.min(9, Math.max(1, Number(l.qty) || 1));
      return `• ${p.name} — ${clip(l.color, 40)}, ${clip(l.size, 20)} × ${qty}`;
    })
    .filter(Boolean);
  const measurements = readMeasurements(body.measurements);
  if (!clip(c.name) || !clip(c.phone) || lines.length === 0 || !measurements) {
    return NextResponse.json({ ok: false, error: "invalid order" }, { status: 422 });
  }
  const text = [
    `🛍 Нове замовлення ${clip(body.id, 20)}`,
    `${clip(c.name)} · ${clip(c.phone, 40)}${c.email ? ` · ${clip(c.email)}` : ""}`,
    `${clip(body.delivery)}${c.city ? ` — ${clip(c.city)}, ${clip(c.branch)}` : ""}`,
    `Оплата: ${clip(body.payment)}`,
    `📏 ${measurements}`,
    ...lines,
    c.comment ? `💬 ${clip(c.comment, 500)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await notifyManagers(text);
  } catch {
    return NextResponse.json({ ok: false, error: "notify failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
