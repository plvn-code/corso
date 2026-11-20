import { NextResponse } from "next/server";
import { BOT_GREETING, BOT_TOPICS } from "@/lib/bot";
import { site } from "@/lib/site";
import { clip, tg } from "@/lib/telegram";

/**
 * Webhook of the real CORSO Telegram bot (ready for when the client creates it in @BotFather).
 *  • client writes the bot → /start shows the topics menu; any message is relayed to the managers' chat
 *    with a «#u<id>» tag (stateless, no database needed);
 *  • a manager replies (Reply) to that message in the managers' chat → the bot sends the reply to the client.
 * Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (managers' group), TELEGRAM_WEBHOOK_SECRET.
 * Setup: docs/STATUS.md → «Telegram-бот».
 */
type TgUser = { id: number; first_name?: string; last_name?: string; username?: string };
type TgMessage = {
  message_id: number;
  chat: { id: number; type: string };
  from?: TgUser;
  text?: string;
  caption?: string;
  reply_to_message?: { text?: string; caption?: string };
};
type TgUpdate = {
  message?: TgMessage;
  callback_query?: { id: string; from: TgUser; data?: string; message?: { chat: { id: number } } };
};

const abs = (href: string) => (href.startsWith("http") ? href : `${site.url}${href}`);
const menu = () => ({
  inline_keyboard: [
    ...BOT_TOPICS.map((t) => [{ text: t.label, callback_data: `t:${t.id}` }]),
    [{ text: "Каталог на сайті", url: abs("/catalog") }],
  ],
});

export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const managers = Number(process.env.TELEGRAM_CHAT_ID);
  if (!process.env.TELEGRAM_BOT_TOKEN || !secret || !managers) {
    return NextResponse.json({ ok: false, error: "bot not configured" }, { status: 503 });
  }
  if (req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const update = (await req.json().catch(() => ({}))) as TgUpdate;

  try {
    // Topic buttons
    const cq = update.callback_query;
    if (cq) {
      const topic = BOT_TOPICS.find((t) => `t:${t.id}` === cq.data);
      await tg("answerCallbackQuery", { callback_query_id: cq.id });
      if (topic && cq.message) {
        await tg("sendMessage", {
          chat_id: cq.message.chat.id,
          text: [...topic.answer, topic.ask ?? ""].filter(Boolean).join("\n\n"),
          reply_markup: topic.links?.length
            ? { inline_keyboard: topic.links.map((l) => [{ text: l.label, url: abs(l.href) }]) }
            : undefined,
        });
      }
      return NextResponse.json({ ok: true });
    }

    const m = update.message;
    if (!m) return NextResponse.json({ ok: true });

    // Manager replies in the managers' chat → back to the client
    if (m.chat.id === managers) {
      const tag = (m.reply_to_message?.text ?? m.reply_to_message?.caption ?? "").match(/#u(\d+)/);
      if (tag) {
        await tg("copyMessage", { chat_id: Number(tag[1]), from_chat_id: m.chat.id, message_id: m.message_id });
        await tg("setMessageReaction", { chat_id: m.chat.id, message_id: m.message_id, reaction: [{ type: "emoji", emoji: "👌" }] });
      }
      return NextResponse.json({ ok: true });
    }

    if (m.chat.type !== "private") return NextResponse.json({ ok: true });

    if (m.text?.startsWith("/start")) {
      await tg("sendMessage", { chat_id: m.chat.id, text: BOT_GREETING.join("\n\n"), reply_markup: menu() });
      return NextResponse.json({ ok: true });
    }

    // Client message → managers (tagged so a Reply finds its way back)
    const u = m.from;
    const who = [u?.first_name, u?.last_name].filter(Boolean).join(" ") || "Клієнт";
    const head = `💬 ${clip(who, 80)}${u?.username ? ` @${u.username}` : ""} #u${m.chat.id}`;
    if (m.text) {
      await tg("sendMessage", { chat_id: managers, text: `${head}\n\n${clip(m.text, 3500)}\n\n↩︎ Відповідайте реплаєм на це повідомлення` });
    } else {
      await tg("sendMessage", { chat_id: managers, text: `${head}\n(вкладення нижче) ↩︎ відповідайте реплаєм на це повідомлення` });
      await tg("forwardMessage", { chat_id: managers, from_chat_id: m.chat.id, message_id: m.message_id });
    }
    await tg("setMessageReaction", { chat_id: m.chat.id, message_id: m.message_id, reaction: [{ type: "emoji", emoji: "👌" }] });
  } catch (e) {
    console.error("[telegram webhook]", e);
  }
  // Always 200 so Telegram does not retry the same update forever
  return NextResponse.json({ ok: true });
}
