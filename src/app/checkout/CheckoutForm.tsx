"use client";

import { useLang } from "@/i18n/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore, type DemoOrder, type Measurements } from "@/lib/store";
import { EMPTY_MEASUREMENTS, MeasureFields, hasMeasurements } from "@/components/MeasureFields";
import { formatPrice } from "@/lib/format";
import { IconCheck, IconClose, IconLock } from "@/components/Icons";

// Labels: `label` (Ukrainian) goes to the manager and the order history; `en` is shown on the English site.
export const DELIVERY = [
  { id: "np-branch", label: "Нова пошта — відділення", en: "Nova Poshta — branch", note: "1–2 дні", noteEn: "1–2 days" },
  { id: "np-locker", label: "Нова пошта — поштомат", en: "Nova Poshta — parcel locker", note: "1–2 дні", noteEn: "1–2 days" },
  { id: "np-courier", label: "Нова пошта — кур'єр", en: "Nova Poshta — courier", note: "1–2 дні", noteEn: "1–2 days" },
  { id: "pickup", label: "Самовивіз — шоурум, Дніпро", en: "Pickup — showroom, Dnipro", note: "Вернадського, 16", noteEn: "16 Vernadskoho St." },
];

export const PAYMENT = [
  { id: "card", label: "Оплата карткою онлайн", en: "Card payment online", note: "Visa · Mastercard · Apple Pay · Google Pay", noteEn: "Visa · Mastercard · Apple Pay · Google Pay" },
  { id: "iban", label: "На рахунок ФОП (IBAN)", en: "Bank transfer (IBAN)", note: "Реквізити надішле менеджер", noteEn: "Our manager will send the details" },
  { id: "cod", label: "Накладений платіж", en: "Cash on delivery", note: "Передоплата 250 грн, решта — при отриманні", noteEn: "250 UAH prepayment, the rest on delivery" },
];

export const STATUS_EN: Record<string, string> = { "Оплачено (демо)": "Paid (demo)", "Очікує підтвердження": "Awaiting confirmation" };

/** Order-history labels are stored in Ukrainian; show them in the site language. */
export function optionLabel(uk: string, lang: string) {
  if (lang !== "en") return uk;
  return [...DELIVERY, ...PAYMENT].find((o) => o.label === uk)?.en ?? STATUS_EN[uk] ?? uk;
}

type Stage = "form" | "pay" | "done";

export function CheckoutForm() {
  const { bag, ready, clearBag, user, addOrder, measurements, setMeasurements } = useStore();
  const { lang, tr } = useLang();
  const [delivery, setDelivery] = useState(DELIVERY[0].id);
  const [payment, setPayment] = useState(PAYMENT[0].id);
  const [stage, setStage] = useState<Stage>("form");
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", branch: "", comment: "" });
  const [measure, setMeasure] = useState<Measurements>(EMPTY_MEASUREMENTS);
  const [savedMeasure, setSavedMeasure] = useState(false);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, phone: f.phone || user.phone, email: f.email || user.email }));
  }, [user]);

  // Saved measurements (account / previous order) fill the panel once; the client can still edit them.
  useEffect(() => {
    if (ready && hasMeasurements(measurements) && !savedMeasure) {
      setMeasure(measurements);
      setSavedMeasure(true);
    }
  }, [ready, measurements, savedMeasure]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-menu", stage === "pay");
  }, [stage]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function place() {
    setBusy(true);
    const id = `CR-${Date.now().toString().slice(-6)}`;
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          customer: form,
          measurements: measure,
          delivery: DELIVERY.find((d) => d.id === delivery)?.label,
          payment: PAYMENT.find((p) => p.id === payment)?.label,
          lines: bag.map((l) => ({ slug: l.slug, color: l.color, size: l.size, qty: l.qty })),
        }),
      });
    } catch {
      /* demo: the order is still saved locally */
    }
    const order: DemoOrder = {
      id,
      date: new Date().toISOString(),
      lines: bag,
      measurements: measure,
      delivery: DELIVERY.find((d) => d.id === delivery)!.label,
      payment: PAYMENT.find((p) => p.id === payment)!.label,
      status: payment === "card" ? "Оплачено (демо)" : "Очікує підтвердження",
    };
    addOrder(order);
    setMeasurements(measure);
    clearBag();
    setOrderId(id);
    setBusy(false);
    setStage("done");
    window.scrollTo({ top: 0 });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (payment === "card") setStage("pay");
    else place();
  }

  if (stage === "done")
    return (
      <div className="narrow thanks">
        <span className="thanks__icon">
          <IconCheck width={28} height={28} />
        </span>
        <p className="eyebrow">Order {orderId}</p>
        <h1 className="h-title h-xl">
          {tr("Дякуємо", "Thank you")} <em>{tr("за замовлення", "for your order")}</em>
        </h1>
        <p className="lead">
          {tr(
            "Замовлення прийнято. Менеджер CORSO звʼяжеться з вами найближчим часом, щоб підтвердити розмір, вартість і доставку.",
            "Your order has been received. A CORSO manager will contact you shortly to confirm the size, price and delivery.",
          )}
        </p>
        <div className="story__links">
          <Link href="/account" className="btn btn--dark">
            {tr("Мої замовлення", "My orders")}
          </Link>
          <Link href="/catalog" className="btn btn--line">
            {tr("Продовжити покупки", "Continue shopping")}
          </Link>
        </div>
      </div>
    );

  if (ready && bag.length === 0)
    return (
      <div className="narrow empty">
        <p className="title-sm">{tr("Кошик порожній", "Your bag is empty")}</p>
        <Link href="/catalog" className="btn btn--dark">
          {tr("До каталогу", "Go to shop")}
        </Link>
      </div>
    );

  return (
    <div className="checkout">
      <header className="page-head">
        <p className="eyebrow">Checkout</p>
        <h1 className="h-title h-xl">{tr("Оформлення", "Checkout")}</h1>
      </header>
      <div className="demo-note">{tr("Демо-режим: оплата і кабінет працюють у тестовому режимі, кошти не списуються.", "Demo mode: payment and account work in test mode, no money is charged.")}</div>
      <div className="checkout__grid">
        <form className="co-form" onSubmit={submit} id="co">
          <section>
            <h2 className="co-h">
              <span>01</span> {tr("Контакти", "Contact details")}
            </h2>
            {!user && (
              <p className="muted small">
                {tr("Вже купували?", "Shopped with us before?")} <Link href="/account">{tr("Увійдіть", "Sign in")}</Link>
                {tr(", щоб бачити історію замовлень.", " to see your order history.")}
              </p>
            )}
            <div className="fields">
              <label className="field">
                <span>{tr("Імʼя та прізвище", "Full name")}</span>
                <input required value={form.name} onChange={set("name")} autoComplete="name" />
              </label>
              <label className="field">
                <span>{tr("Телефон", "Phone")}</span>
                <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="+380" autoComplete="tel" pattern={"\\+?[0-9\\s\\(\\)\\-]{10,}"} />
              </label>
              <label className="field field--wide">
                <span>E-mail</span>
                <input type="email" value={form.email} onChange={set("email")} autoComplete="email" />
              </label>
            </div>
          </section>

          <section className="co-measure">
            <h2 className="co-h">
              <span>02</span> {tr("Параметри фігури", "Your measurements")}
            </h2>
            <p className="muted small co-measure__lead">
              {tr(
                "Ми шиємо на власному виробництві й адаптуємо модель під вашу фігуру. Вкажіть параметри в сантиметрах.",
                "We sew in our own atelier and adapt each piece to your figure. Please enter your measurements in centimetres.",
              )}
            </p>
            <MeasureFields value={measure} onChange={setMeasure} required />
            <p className="muted small co-measure__note">
              {savedMeasure
                ? tr("Підставили збережені параметри — за потреби змініть їх.", "We filled in your saved measurements — change them if needed.")
                : user
                  ? tr("Збережемо у вашому кабінеті — наступного разу вводити не доведеться.", "We will save them to your account so you won't need to enter them again.")
                  : tr("Запамʼятаємо для наступних замовлень. Змінити можна в особистому кабінеті.", "We will remember them for your next orders. You can change them in your account.")}
            </p>
          </section>

          <section>
            <h2 className="co-h">
              <span>03</span> {tr("Доставка", "Delivery")}
            </h2>
            <div className="opts">
              {DELIVERY.map((d) => (
                <label key={d.id} className={`opt${delivery === d.id ? " is-on" : ""}`}>
                  <input type="radio" name="delivery" checked={delivery === d.id} onChange={() => setDelivery(d.id)} />
                  <span className="opt__dot" />
                  <span className="opt__t">{lang === "en" ? d.en : d.label}</span>
                  <span className="opt__n">{lang === "en" ? d.noteEn : d.note}</span>
                </label>
              ))}
            </div>
            {delivery !== "pickup" && (
              <div className="fields">
                <label className="field">
                  <span>{tr("Місто", "City")}</span>
                  <input required value={form.city} onChange={set("city")} autoComplete="address-level2" />
                </label>
                <label className="field">
                  <span>{delivery === "np-courier" ? tr("Адреса", "Address") : tr("Відділення / поштомат №", "Branch / locker no.")}</span>
                  <input required value={form.branch} onChange={set("branch")} />
                </label>
              </div>
            )}
          </section>

          <section>
            <h2 className="co-h">
              <span>04</span> {tr("Оплата", "Payment")}
            </h2>
            <div className="opts">
              {PAYMENT.map((p) => (
                <label key={p.id} className={`opt${payment === p.id ? " is-on" : ""}`}>
                  <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} />
                  <span className="opt__dot" />
                  <span className="opt__t">{lang === "en" ? p.en : p.label}</span>
                  <span className="opt__n">{lang === "en" ? p.noteEn : p.note}</span>
                </label>
              ))}
            </div>
            <label className="field field--wide">
              <span>{tr("Коментар до замовлення", "Order notes")}</span>
              <textarea rows={3} value={form.comment} onChange={set("comment")} placeholder={tr("Побажання щодо посадки, довжини, термінів", "Wishes about fit, length, timing")} />
            </label>
          </section>
        </form>

        <aside className="summary summary--sticky">
          <p className="eyebrow">{tr("Ваше замовлення", "Your order")}</p>
          <ul className="mini-lines">
            {bag.map((l) => (
              <li key={l.key}>
                <Image src={l.image} alt="" width={60} height={90} />
                <span>
                  <b>{l.names?.[lang] ?? l.name}</b>
                  <small>
                    {l.color} · {l.size} · {l.qty} {tr("шт.", "pcs")}
                  </small>
                </span>
                <span>{formatPrice(l.price)}</span>
              </li>
            ))}
          </ul>
          <div className="sum-row">
            <span>{tr("Доставка", "Delivery")}</span>
            <span>{tr("за тарифами", "carrier rates")}</span>
          </div>
          <div className="sum-row sum-row--total">
            <span>{tr("Разом", "Total")}</span>
            <span>₴</span>
          </div>
          <button form="co" className="btn btn--dark btn--block" disabled={busy}>
            {payment === "card" ? (
              <>
                <IconLock width={16} height={16} /> {tr("Перейти до оплати", "Continue to payment")}
              </>
            ) : (
              tr("Підтвердити замовлення", "Place order")
            )}
          </button>
          <p className="muted small">
            {tr("Натискаючи кнопку, ви погоджуєтесь з умовами", "By placing the order you accept the")}{" "}
            <Link href="/info/oferta">{tr("публічної оферти", "terms of sale")}</Link>.
          </p>
        </aside>
      </div>

      {stage === "pay" && <PayDemo onClose={() => setStage("form")} onPaid={place} busy={busy} />}
    </div>
  );
}

function PayDemo({ onClose, onPaid, busy }: { onClose: () => void; onPaid: () => void; busy: boolean }) {
  const [card, setCard] = useState({ num: "4242 4242 4242 4242", exp: "12/28", cvv: "123" });
  const { tr } = useLang();
  return (
    <div className="modal" role="dialog" aria-label={tr("Оплата карткою", "Card payment")}>
      <div className="modal__box pay">
        <div className="modal__head">
          <p className="eyebrow">
            <IconLock width={14} height={14} /> {tr("Безпечна оплата · демо", "Secure payment · demo")}
          </p>
          <button className="icon-btn" aria-label={tr("Закрити", "Close")} onClick={onClose}>
            <IconClose />
          </button>
        </div>
        <div className="pay__wallets">
          <button className="btn btn--dark btn--block" onClick={onPaid} disabled={busy}>
            Apple Pay
          </button>
          <button className="btn btn--line btn--block" onClick={onPaid} disabled={busy}>
            Google Pay
          </button>
        </div>
        <p className="pay__or">{tr("або карткою", "or by card")}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onPaid();
          }}
        >
          <label className="field field--wide">
            <span>{tr("Номер картки", "Card number")}</span>
            <input inputMode="numeric" value={card.num} onChange={(e) => setCard({ ...card, num: e.target.value })} />
          </label>
          <div className="fields">
            <label className="field">
              <span>{tr("Термін", "Expiry")}</span>
              <input value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} />
            </label>
            <label className="field">
              <span>CVV</span>
              <input inputMode="numeric" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
            </label>
          </div>
          <button className="btn btn--dark btn--block" disabled={busy}>
            {busy ? tr("Обробка…", "Processing…") : tr("Оплатити", "Pay")}
          </button>
        </form>
        <p className="muted small">
          {tr(
            "Тестова форма: дані картки нікуди не передаються. Реальний платіжний сервіс (LiqPay / WayForPay / Monobank) підключимо на наступному етапі.",
            "Test form: card details are not sent anywhere. A real payment provider (LiqPay / WayForPay / Monobank) will be connected at the next stage.",
          )}
        </p>
      </div>
    </div>
  );
}
