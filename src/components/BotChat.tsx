"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { site } from "@/lib/site";
import { BOT_ASK_CONTACT, BOT_GREETING, BOT_NAME, BOT_SENT, BOT_TOPICS, isContact, type BotLink } from "@/lib/bot";
import { Monogram } from "./Monogram";
import { IconClose, IconTelegram } from "./Icons";

/**
 * Quick contact — DEMO of the CORSO Telegram bot, right on the site.
 * Same script as the real bot (src/lib/bot.ts); requests go to the managers' Telegram chat via /api/contact.
 * When the real bot exists (NEXT_PUBLIC_TELEGRAM_BOT), the header also offers «open in Telegram».
 */
interface Msg {
  id: number;
  from: "bot" | "me";
  text: string;
  links?: BotLink[];
}

const CONTACT_KEY = "corso.contact.v1";
let uid = 0;
const bot = (text: string, links?: BotLink[]): Msg => ({ id: ++uid, from: "bot", text, links });
const me = (text: string): Msg => ({ id: ++uid, from: "me", text });

export function BotChat() {
  const { bot: state, openBot, closeBot, bagOpen, user } = useStore();
  const pathname = usePathname();
  const [msgs, setMsgs] = useState<Msg[]>(() => BOT_GREETING.map((t) => bot(t)));
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<string[]>([]); // client's words not yet sent to managers
  const [topic, setTopic] = useState<string | undefined>();
  const [context, setContext] = useState<string | undefined>();
  const [contact, setContact] = useState("");
  const [waitContact, setWaitContact] = useState(false);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handled = useRef(0);

  useEffect(() => {
    try {
      setContact(localStorage.getItem(CONTACT_KEY) || "");
    } catch {
      /* ignore */
    }
  }, []);

  // Opened from a button with a topic / product context
  useEffect(() => {
    if (!state.open || state.n === handled.current) return;
    handled.current = state.n;
    if (state.context) {
      setContext(state.context);
      setMsgs((m) => [...m, bot(`Питання щодо: ${state.context}`)]);
    }
    if (state.topic) pick(state.topic);
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.open, state.n]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-chat", state.open);
  }, [state.open]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeBot();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeBot]);

  // Bot replies go through one queue so they always appear in order, after a short «typing…».
  const queue = useRef<Promise<void>>(Promise.resolve());
  function enqueue(job: () => Promise<Msg[]>) {
    queue.current = queue.current.then(async () => {
      setTyping(true);
      const [lines] = await Promise.all([job(), new Promise((r) => setTimeout(r, 650))]);
      setTyping(false);
      setMsgs((m) => [...m, ...lines]);
    });
  }
  const say = (lines: Msg[]) => enqueue(async () => lines);

  function pick(id: string) {
    const t = BOT_TOPICS.find((x) => x.id === id);
    if (!t) return;
    setTopic(t.label);
    setMsgs((m) => [...m, me(t.label)]);
    say([...t.answer.map((a, i) => bot(a, i === t.answer.length - 1 ? t.links : undefined)), ...(t.ask ? [bot(t.ask)] : [])]);
  }

  function deliver(words: string[], who: string) {
    setBusy(true);
    enqueue(async () => {
      let ok = false;
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contact: who, name: user?.name, topic, context, page: pathname, messages: words }),
        });
        ok = res.ok;
      } catch {
        ok = false;
      }
      setBusy(false);
      if (ok) setPending([]);
      else setPending(words);
      return [ok ? bot(BOT_SENT) : bot("Не вдалося надіслати — перевірте інтернет і спробуйте ще раз.")];
    });
  }

  function send(e?: React.FormEvent) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    setMsgs((m) => [...m, me(text)]);

    if (waitContact) {
      if (!isContact(text)) {
        // looks like more of the question — keep it, ask for the contact once more
        if (/[a-zа-яіїєґ]{3,}/i.test(text) && !text.startsWith("@")) setPending((p) => [...p, text]);
        say([bot("Щоб менеджер міг відповісти, залиште телефон у форматі +380… або нік у Telegram, наприклад @corso_client.")]);
        return;
      }
      setContact(text);
      setWaitContact(false);
      try {
        localStorage.setItem(CONTACT_KEY, text);
      } catch {
        /* ignore */
      }
      deliver(pending, text);
      return;
    }

    const words = [...pending, text];
    if (contact) {
      deliver(words, contact);
    } else {
      setPending(words);
      setWaitContact(true);
      say([bot(BOT_ASK_CONTACT)]);
    }
  }

  const lift = pathname.startsWith("/product/") ? " bot-fab--lift" : "";
  const hidden = pathname.startsWith("/checkout") || bagOpen;

  return (
    <>
      <button
        className={`bot-fab${lift}${hidden || state.open ? " is-hidden" : ""}`}
        aria-label="Швидкий звʼязок — чат з менеджером"
        onClick={() => openBot()}
      >
        <IconTelegram width={22} height={22} />
        <span className="bot-fab__label">Швидкий звʼязок</span>
      </button>

      <div className={`bot-scrim${state.open ? " is-open" : ""}`} onClick={closeBot} />
      <section className={`bot${state.open ? " is-open" : ""}`} aria-hidden={!state.open} aria-label="Чат CORSO" role="dialog">
        <header className="bot__head">
          <span className="bot__ava">
            <Monogram />
          </span>
          <div className="bot__who">
            <b>{BOT_NAME}</b>
            <small>
              <i className="bot__dot" /> швидка відповідь · Telegram-бот (демо)
            </small>
          </div>
          {site.bot && (
            <a className="icon-btn" href={`https://t.me/${site.bot}`} target="_blank" rel="noopener noreferrer" aria-label="Відкрити в Telegram">
              <IconTelegram />
            </a>
          )}
          <button className="icon-btn" aria-label="Закрити чат" onClick={closeBot}>
            <IconClose />
          </button>
        </header>

        <div className="bot__list" ref={listRef}>
          {msgs.map((m) => (
            <div key={m.id} className={`bmsg bmsg--${m.from}`}>
              <p>{m.text}</p>
              {m.links && (
                <div className="bmsg__links">
                  {m.links.map((l) =>
                    l.href.startsWith("http") ? (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                        {l.label} ↗
                      </a>
                    ) : (
                      <Link key={l.href} href={l.href} onClick={closeBot}>
                        {l.label} →
                      </Link>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="bmsg bmsg--bot bmsg--typing" aria-label="Друкує">
              <span />
              <span />
              <span />
            </div>
          )}
          <div className="bot__keys">
            {BOT_TOPICS.map((t) => (
              <button key={t.id} type="button" onClick={() => pick(t.id)} disabled={busy}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <form className="bot__bar" onSubmit={send}>
          <textarea
            ref={inputRef}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) send(e);
            }}
            placeholder={waitContact ? "+380… або @нік" : "Повідомлення…"}
            aria-label="Повідомлення"
            maxLength={600}
          />
          <button className="bot__send" aria-label="Надіслати" disabled={!draft.trim() || busy}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
        <p className="bot__fine">Демо Telegram-бота: повідомлення надходять менеджерам CORSO.</p>
      </section>
    </>
  );
}

/** Any «write to us» link on the site → opens the chat (optionally on a topic / about a product). */
export function BotButton({
  children,
  className,
  topic,
  context,
}: {
  children: React.ReactNode;
  className?: string;
  topic?: string;
  context?: string;
}) {
  const { openBot } = useStore();
  return (
    <button type="button" className={className ?? "link-inline"} onClick={() => openBot({ topic, context })}>
      {children}
    </button>
  );
}
