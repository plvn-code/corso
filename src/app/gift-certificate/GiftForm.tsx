"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLang } from "@/i18n/client";
import { formatPrice } from "@/lib/format";
import { Monogram } from "@/components/Monogram";
import { IconLock } from "@/components/Icons";
import {
  GIFT_DESIGNS,
  GIFT_MAX,
  GIFT_MESSAGE_MAX,
  GIFT_MIN,
  GIFT_PRESETS,
  isEmail,
  isPhone,
  validAmount,
  type GiftDesign,
} from "@/lib/gift";

/** The certificate itself — live preview of what the recipient gets. */
export function GiftCard({
  amount,
  to,
  from,
  design,
  code = "XXXX · XXXX · XXXX",
}: {
  amount: number | null;
  to: string;
  from: string;
  design: GiftDesign;
  code?: string;
}) {
  const { tr } = useLang();
  return (
    <div className={`gcard gcard--${design}`} aria-label={tr("Подарунковий сертифікат CORSO", "CORSO gift certificate")}>
      <div className="gcard__top">
        <span className="gcard__kind">Gift certificate</span>
        <Monogram className="gcard__mono" />
      </div>
      <p className="gcard__amount">{amount ? formatPrice(amount) : "₴"}</p>
      <div className="gcard__people">
        <span>
          <small>{tr("Для", "For")}</small>
          {to.trim() || "—"}
        </span>
        <span>
          <small>{tr("Від", "From")}</small>
          {from.trim() || "—"}
        </span>
      </div>
      <div className="gcard__bottom">
        <span className="gcard__word">CORSO EDIT CLUB</span>
        <span className="gcard__code">{code}</span>
      </div>
    </div>
  );
}

const today = () => new Date().toISOString().slice(0, 10);
const inYear = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
};

export function GiftForm() {
  const { lang, tr } = useLang();
  const [amount, setAmount] = useState<number>(3000);
  const [custom, setCustom] = useState("");
  const [design, setDesign] = useState<GiftDesign>("noir");
  const [f, setF] = useState({ toName: "", toEmail: "", fromName: "", fromEmail: "", phone: "", message: "" });
  const [when, setWhen] = useState<"now" | "date">("now");
  const [date, setDate] = useState("");
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<"form" | "pay">("form");
  const [requestId, setRequestId] = useState("");

  const value = custom ? Number(custom) : amount;
  const amountOk = validAmount(value);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));

  const errors = useMemo(
    () => ({
      amount: !amountOk,
      toName: !f.toName.trim(),
      toEmail: !isEmail(f.toEmail),
      fromName: !f.fromName.trim(),
      fromEmail: !isEmail(f.fromEmail),
      phone: !isPhone(f.phone),
      date: when === "date" && !date,
    }),
    [amountOk, f, when, date],
  );
  const hasErrors = Object.values(errors).some(Boolean);
  const err = (k: keyof typeof errors) => tried && errors[k];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (hasErrors) {
      document.querySelector(".gift-form .is-err")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setBusy(true);
    let id = `GC-${Date.now().toString().slice(-6)}`;
    try {
      const res = await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: value,
          design,
          to: { name: f.toName, email: f.toEmail },
          from: { name: f.fromName, email: f.fromEmail, phone: f.phone },
          message: f.message,
          sendOn: when === "date" ? date : "",
        }),
      });
      const data = (await res.json().catch(() => null)) as { id?: string } | null;
      if (data?.id) id = data.id;
    } catch {
      /* demo: still show the payment step */
    }
    setRequestId(id);
    setBusy(false);
    setStage("pay");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const sendLabel =
    when === "date" && date
      ? new Date(date).toLocaleDateString(lang === "en" ? "en-GB" : "uk-UA", { day: "numeric", month: "long", year: "numeric" })
      : tr("одразу після оплати", "right after payment");

  return (
    <div className="gift">
      <ol className="gift__steps" aria-label={tr("Етапи", "Steps")}>
        <li className={stage === "form" ? "is-on" : "is-done"}>
          <span>01</span> {tr("Сертифікат", "Certificate")}
        </li>
        <li className={stage === "pay" ? "is-on" : ""}>
          <span>02</span> {tr("Оплата", "Payment")}
        </li>
        <li>
          <span>03</span> {tr("Надсилання", "Delivery")}
        </li>
      </ol>

      <div className="gift__grid">
        <div className="gift__preview">
          <GiftCard amount={amountOk ? value : null} to={f.toName} from={f.fromName} design={design} />
          {f.message.trim() && <p className="gift__msg">«{f.message.trim()}»</p>}
          <p className="muted small gift__hint">
            {tr(
              "Так виглядатиме сертифікат, який отримає ваш друг на e-mail.",
              "This is the certificate your friend will receive by e-mail.",
            )}
          </p>
        </div>

        {stage === "form" ? (
          <form className="gift-form" onSubmit={submit} noValidate>
            <section>
              <h2 className="co-h">
                <span>01</span> {tr("Сума сертифіката", "Amount")}
              </h2>
              <div className={`gift__amounts${err("amount") ? " is-err" : ""}`}>
                {GIFT_PRESETS.map((n) => (
                  <button
                    type="button"
                    key={n}
                    className={`chip${!custom && amount === n ? " is-on" : ""}`}
                    aria-pressed={!custom && amount === n}
                    onClick={() => {
                      setAmount(n);
                      setCustom("");
                    }}
                  >
                    {formatPrice(n)}
                  </button>
                ))}
              </div>
              <label className={`field gift__custom${err("amount") ? " is-err" : ""}`}>
                <span>
                  {tr("Або своя сума", "Or your own amount")} · {tr("від", "from")} {formatPrice(GIFT_MIN)}
                </span>
                <span className="gift__sum">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={GIFT_MIN}
                    max={GIFT_MAX}
                    step={100}
                    value={custom}
                    placeholder={String(GIFT_MIN)}
                    onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))}
                  />
                  <i>₴</i>
                </span>
                {err("amount") && (
                  <small className="warn">
                    {tr("Сума — від", "Amount — from")} {formatPrice(GIFT_MIN)} {tr("до", "to")} {formatPrice(GIFT_MAX)}
                  </small>
                )}
              </label>
              <div className="gift__designs" role="radiogroup" aria-label={tr("Дизайн", "Design")}>
                <span className="pdp__label">{tr("Дизайн", "Design")}</span>
                {GIFT_DESIGNS.map((d) => (
                  <button
                    type="button"
                    key={d.id}
                    role="radio"
                    aria-checked={design === d.id}
                    className={`gift__design gift__design--${d.id}${design === d.id ? " is-on" : ""}`}
                    onClick={() => setDesign(d.id)}
                  >
                    <i />
                    {d[lang]}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="co-h">
                <span>02</span> {tr("Для кого сертифікат", "Who is it for")}
              </h2>
              <div className="fields">
                <label className={`field${err("toName") ? " is-err" : ""}`}>
                  <span>{tr("Імʼя отримувача", "Recipient's name")} *</span>
                  <input value={f.toName} onChange={set("toName")} maxLength={60} autoComplete="off" />
                </label>
                <label className={`field${err("toEmail") ? " is-err" : ""}`}>
                  <span>{tr("E-mail отримувача", "Recipient's e-mail")} *</span>
                  <input type="email" value={f.toEmail} onChange={set("toEmail")} autoComplete="off" />
                </label>
                <label className="field field--wide">
                  <span>
                    {tr("Текст привітання", "Greeting")} · {f.message.length}/{GIFT_MESSAGE_MAX}
                  </span>
                  <textarea
                    rows={3}
                    value={f.message}
                    onChange={set("message")}
                    maxLength={GIFT_MESSAGE_MAX}
                    placeholder={tr("З днем народження! Обери щось для себе ✦", "Happy birthday! Choose something for yourself ✦")}
                  />
                </label>
              </div>
            </section>

            <section>
              <h2 className="co-h">
                <span>03</span> {tr("Від кого", "From")}
              </h2>
              <div className="fields">
                <label className={`field${err("fromName") ? " is-err" : ""}`}>
                  <span>{tr("Ваше імʼя", "Your name")} *</span>
                  <input value={f.fromName} onChange={set("fromName")} maxLength={60} autoComplete="name" />
                </label>
                <label className={`field${err("phone") ? " is-err" : ""}`}>
                  <span>{tr("Телефон", "Phone")} *</span>
                  <input type="tel" value={f.phone} onChange={set("phone")} placeholder="+380" autoComplete="tel" />
                </label>
                <label className={`field field--wide${err("fromEmail") ? " is-err" : ""}`}>
                  <span>{tr("Ваш e-mail — надішлемо квитанцію", "Your e-mail — for the receipt")} *</span>
                  <input type="email" value={f.fromEmail} onChange={set("fromEmail")} autoComplete="email" />
                </label>
              </div>
            </section>

            <section>
              <h2 className="co-h">
                <span>04</span> {tr("Коли надіслати", "When to send")}
              </h2>
              <div className="opts">
                <label className={`opt${when === "now" ? " is-on" : ""}`}>
                  <input type="radio" name="when" checked={when === "now"} onChange={() => setWhen("now")} />
                  <span className="opt__dot" />
                  <span className="opt__t">{tr("Одразу після оплати", "Right after payment")}</span>
                  <span className="opt__n">{tr("Лист прийде отримувачу за кілька хвилин", "The e-mail arrives within minutes")}</span>
                </label>
                <label className={`opt${when === "date" ? " is-on" : ""}`}>
                  <input type="radio" name="when" checked={when === "date"} onChange={() => setWhen("date")} />
                  <span className="opt__dot" />
                  <span className="opt__t">{tr("Обрати дату", "Choose a date")}</span>
                  <span className="opt__n">{tr("Наприклад, на день народження", "For example, on a birthday")}</span>
                </label>
              </div>
              {when === "date" && (
                <label className={`field${err("date") ? " is-err" : ""}`}>
                  <span>{tr("Дата відправки", "Send date")} *</span>
                  <input type="date" min={today()} max={inYear()} value={date} onChange={(e) => setDate(e.target.value)} />
                </label>
              )}
            </section>

            <div className="gift__total">
              <div className="sum-row sum-row--total">
                <span>{tr("До сплати", "To pay")}</span>
                <span>{amountOk ? formatPrice(value) : "₴"}</span>
              </div>
              {tried && hasErrors && <p className="warn">{tr("Перевірте виділені поля", "Please check the highlighted fields")}</p>}
              <button className="btn btn--dark btn--block" disabled={busy}>
                <IconLock width={16} height={16} /> {busy ? tr("Зачекайте…", "Please wait…") : tr("Перейти до оплати", "Continue to payment")}
              </button>
              <p className="muted small">
                {tr("Натискаючи кнопку, ви погоджуєтесь з", "By continuing you accept the")}{" "}
                <a href="#terms">{tr("умовами використання сертифіката", "certificate terms")}</a>.
              </p>
            </div>
          </form>
        ) : (
          <div className="gift-pay">
            <p className="eyebrow">
              {tr("Заявка", "Request")} {requestId}
            </p>
            <h2 className="h-title">{tr("Оплата сертифіката", "Certificate payment")}</h2>
            <dl className="gift-pay__sum">
              <dt>{tr("Сума", "Amount")}</dt>
              <dd>{formatPrice(value)}</dd>
              <dt>{tr("Отримувач", "Recipient")}</dt>
              <dd>
                {f.toName} · {f.toEmail}
              </dd>
              <dt>{tr("Від", "From")}</dt>
              <dd>
                {f.fromName} · {f.phone}
              </dd>
              <dt>{tr("Надсилання", "Sending")}</dt>
              <dd>{sendLabel}</dd>
            </dl>
            <div className="gift-pay__box">
              <p className="title-sm">{tr("Онлайн-оплата підключається", "Online payment is being connected")}</p>
              <p className="muted small">
                {tr(
                  "Тут буде оплата карткою, Apple Pay і Google Pay. Одразу після оплати сертифікат з унікальним номером надійде отримувачу на e-mail, а вам — квитанція.",
                  "Card, Apple Pay and Google Pay payments will be here. Right after payment the certificate with a unique number goes to the recipient's e-mail, and you get a receipt.",
                )}
              </p>
              <button className="btn btn--dark btn--block" disabled>
                <IconLock width={16} height={16} /> {tr("Оплатити", "Pay")} {formatPrice(value)}
              </button>
              <p className="demo-note">
                {tr(
                  "Демо-режим: платіжну систему буде підключено на наступному етапі. Заявку вже передано менеджеру.",
                  "Demo mode: the payment provider will be connected at the next stage. Your request has been passed to our manager.",
                )}
              </p>
            </div>
            <div className="story__links">
              <button type="button" className="btn btn--line" onClick={() => setStage("form")}>
                {tr("Змінити дані", "Edit details")}
              </button>
              <Link href="/catalog" className="btn btn--line">
                {tr("До каталогу", "Go to shop")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
