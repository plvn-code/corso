import { NextResponse } from "next/server";
import { isContact } from "@/lib/bot";
import { clip, notifyManagers } from "@/lib/telegram";

/**
 * Quick-contact requests from the on-site chat (demo of the CORSO Telegram bot).
 * Goes straight to the managers' Telegram chat (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID), else logged.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const contact = clip(body.contact, 60);
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .map((m) => clip(m, 600).trim())
    .filter(Boolean)
    .slice(-8);
  if (!isContact(contact) || messages.length === 0) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }
  const text = [
    "💬 Запит з сайту (чат)",
    `Контакт: ${contact}${body.name ? ` · ${clip(body.name, 80)}` : ""}`,
    ...(body.topic ? [`Тема: ${clip(body.topic, 60)}`] : []),
    ...(body.context ? [`Про: ${clip(body.context, 160)}`] : []),
    ...(body.page ? [`Сторінка: ${clip(body.page, 160)}`] : []),
    "",
    ...messages.map((m) => `— ${m}`),
  ].join("\n");
  try {
    await notifyManagers(text);
  } catch {
    return NextResponse.json({ ok: false, error: "notify failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
