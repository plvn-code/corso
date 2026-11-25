"use client";

import { useState } from "react";
import { useLang } from "@/i18n/client";

const REASONS = [
  { uk: "Не підійшов розмір", en: "Wrong size" },
  { uk: "Не підійшла модель або колір", en: "Style or colour didn't suit" },
  { uk: "Товар відрізняється від фото", en: "Differs from the photos" },
  { uk: "Брак", en: "Defect" },
  { uk: "Інше", en: "Other" },
];

/** Electronic return / exchange application (page «Обмін і повернення»). */
export function ReturnForm() {
  const { lang, tr } = useLang();
  const [kind, setKind] = useState<"return" | "exchange">("return");
  const [f, setF] = useState({ order: "", name: "", phone: "", items: "", reason: REASONS[0].uk, wish: "", comment: "" });
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  const [error, setError] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((x) => ({ ...x, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...f, confirm }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; id?: string } | null;
      if (data?.ok && data.id) setDone(data.id);
      else setError(true);
    } catch {
      setError(true);
    }
    setBusy(false);
  }

  if (done)
    return (
      <div className="rform rform--done" id="zayava">
        <p className="eyebrow">{done}</p>
        <p className="title-sm">{tr("Заяву прийнято", "Application received")}</p>
        <p className="muted">
          {tr(
            "Менеджер CORSO звʼяжеться з вами та надішле дані для відправки Новою поштою.",
            "The CORSO manager will contact you with the details for sending the parcel via Nova Poshta.",
          )}
        </p>
      </div>
    );

  return (
    <form className="rform" id="zayava" onSubmit={submit}>
      <div className="seg rform__seg" role="tablist">
        <button type="button" role="tab" aria-selected={kind === "return"} className={kind === "return" ? "is-on" : ""} onClick={() => setKind("return")}>
          {tr("Повернення", "Return")}
        </button>
        <button type="button" role="tab" aria-selected={kind === "exchange"} className={kind === "exchange" ? "is-on" : ""} onClick={() => setKind("exchange")}>
          {tr("Обмін", "Exchange")}
        </button>
      </div>
      <div className="fields">
        <label className="field">
          <span>{tr("Імʼя та прізвище", "Full name")} *</span>
          <input required value={f.name} onChange={set("name")} autoComplete="name" maxLength={80} />
        </label>
        <label className="field">
          <span>{tr("Телефон", "Phone")} *</span>
          <input required type="tel" value={f.phone} onChange={set("phone")} placeholder="+380" autoComplete="tel" pattern={"\\+?[0-9\\s\\(\\)\\-]{10,}"} />
        </label>
        <label className="field">
          <span>{tr("Номер замовлення", "Order number")}</span>
          <input value={f.order} onChange={set("order")} placeholder="CR-…" maxLength={40} />
        </label>
        <label className="field">
          <span>{tr("Причина", "Reason")}</span>
          <select value={f.reason} onChange={set("reason")}>
            {REASONS.map((r) => (
              <option key={r.uk} value={r.uk}>
                {lang === "en" ? r.en : r.uk}
              </option>
            ))}
          </select>
        </label>
        <label className="field field--wide">
          <span>{tr("Товар: назва, колір, розмір", "Item: name, colour, size")} *</span>
          <input required value={f.items} onChange={set("items")} maxLength={600} placeholder={tr("Тренч міді, Black, M/L", "Midi trench, Black, M/L")} />
        </label>
        {kind === "exchange" && (
          <label className="field field--wide">
            <span>{tr("На який розмір або колір обміняти", "Exchange for which size or colour")} *</span>
            <input required value={f.wish} onChange={set("wish")} maxLength={200} placeholder={tr("XS/S, той самий колір", "XS/S, same colour")} />
          </label>
        )}
        <label className="field field--wide">
          <span>{tr("Коментар", "Comment")}</span>
          <textarea rows={2} value={f.comment} onChange={set("comment")} maxLength={500} />
        </label>
      </div>
      <label className="rform__check">
        <input type="checkbox" required checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />
        <span>
          {tr(
            "Підтверджую: товар не був у використанні, збережено товарний вигляд, бірки й оригінальне пакування, є товарний чек.",
            "I confirm: the item has not been used, its condition, tags and original packaging are intact, and I have the receipt.",
          )}
        </span>
      </label>
      {error && <p className="warn">{tr("Не вдалося надіслати — перевірте поля та спробуйте ще раз.", "Could not send — check the fields and try again.")}</p>}
      <button className="btn btn--dark btn--block" disabled={busy}>
        {busy ? tr("Надсилаємо…", "Sending…") : kind === "exchange" ? tr("Надіслати заяву на обмін", "Send exchange application") : tr("Надіслати заяву на повернення", "Send return application")}
      </button>
    </form>
  );
}
