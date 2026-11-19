"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore, type DemoOrder } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { IconCheck, IconClose, IconLock } from "@/components/Icons";

const DELIVERY = [
  { id: "np-branch", label: "Нова пошта — відділення", note: "1–2 дні" },
  { id: "np-locker", label: "Нова пошта — поштомат", note: "1–2 дні" },
  { id: "np-courier", label: "Нова пошта — кур'єр", note: "1–2 дні" },
  { id: "pickup", label: "Самовивіз — шоурум, Дніпро", note: "Вернадського, 16" },
];

const PAYMENT = [
  { id: "card", label: "Оплата карткою онлайн", note: "Visa · Mastercard · Apple Pay · Google Pay" },
  { id: "iban", label: "На рахунок ФОП (IBAN)", note: "Реквізити надішле менеджер" },
  { id: "cod", label: "Накладений платіж", note: "Передоплата 250 грн, решта — при отриманні" },
];

type Stage = "form" | "pay" | "done";

export function CheckoutForm() {
  const { bag, ready, clearBag, user, addOrder } = useStore();
  const [delivery, setDelivery] = useState(DELIVERY[0].id);
  const [payment, setPayment] = useState(PAYMENT[0].id);
  const [stage, setStage] = useState<Stage>("form");
  const [busy, setBusy] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", branch: "", comment: "" });

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, phone: f.phone || user.phone, email: f.email || user.email }));
  }, [user]);

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
      delivery: DELIVERY.find((d) => d.id === delivery)!.label,
      payment: PAYMENT.find((p) => p.id === payment)!.label,
      status: payment === "card" ? "Оплачено (демо)" : "Очікує підтвердження",
    };
    addOrder(order);
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
          Дякуємо <em>за замовлення</em>
        </h1>
        <p className="lead">Замовлення прийнято. Менеджер CORSO зв&apos;яжеться з вами найближчим часом, щоб підтвердити розмір, вартість і доставку.</p>
        <div className="story__links">
          <Link href="/account" className="btn btn--dark">
            Мої замовлення
          </Link>
          <Link href="/catalog" className="btn btn--line">
            Продовжити покупки
          </Link>
        </div>
      </div>
    );

  if (ready && bag.length === 0)
    return (
      <div className="narrow empty">
        <p className="title-sm">Кошик порожній</p>
        <Link href="/catalog" className="btn btn--dark">
          До каталогу
        </Link>
      </div>
    );

  return (
    <div className="checkout">
      <header className="page-head">
        <p className="eyebrow">Checkout</p>
        <h1 className="h-title h-xl">Оформлення</h1>
      </header>
      <div className="demo-note">Демо-режим: оплата і кабінет працюють у тестовому режимі, кошти не списуються.</div>
      <div className="checkout__grid">
        <form className="co-form" onSubmit={submit} id="co">
          <section>
            <h2 className="co-h">
              <span>01</span> Контакти
            </h2>
            {!user && (
              <p className="muted small">
                Вже купували? <Link href="/account">Увійдіть</Link>, щоб бачити історію замовлень.
              </p>
            )}
            <div className="fields">
              <label className="field">
                <span>Ім&apos;я та прізвище</span>
                <input required value={form.name} onChange={set("name")} autoComplete="name" />
              </label>
              <label className="field">
                <span>Телефон</span>
                <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="+380" autoComplete="tel" pattern={"\\+?[0-9\\s\\(\\)\\-]{10,}"} />
              </label>
              <label className="field field--wide">
                <span>E-mail</span>
                <input type="email" value={form.email} onChange={set("email")} autoComplete="email" />
              </label>
            </div>
          </section>

          <section>
            <h2 className="co-h">
              <span>02</span> Доставка
            </h2>
            <div className="opts">
              {DELIVERY.map((d) => (
                <label key={d.id} className={`opt${delivery === d.id ? " is-on" : ""}`}>
                  <input type="radio" name="delivery" checked={delivery === d.id} onChange={() => setDelivery(d.id)} />
                  <span className="opt__dot" />
                  <span className="opt__t">{d.label}</span>
                  <span className="opt__n">{d.note}</span>
                </label>
              ))}
            </div>
            {delivery !== "pickup" && (
              <div className="fields">
                <label className="field">
                  <span>Місто</span>
                  <input required value={form.city} onChange={set("city")} autoComplete="address-level2" />
                </label>
                <label className="field">
                  <span>{delivery === "np-courier" ? "Адреса" : "Відділення / поштомат №"}</span>
                  <input required value={form.branch} onChange={set("branch")} />
                </label>
              </div>
            )}
          </section>

          <section>
            <h2 className="co-h">
              <span>03</span> Оплата
            </h2>
            <div className="opts">
              {PAYMENT.map((p) => (
                <label key={p.id} className={`opt${payment === p.id ? " is-on" : ""}`}>
                  <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} />
                  <span className="opt__dot" />
                  <span className="opt__t">{p.label}</span>
                  <span className="opt__n">{p.note}</span>
                </label>
              ))}
            </div>
            <label className="field field--wide">
              <span>Коментар до замовлення</span>
              <textarea rows={3} value={form.comment} onChange={set("comment")} placeholder="Зріст, параметри, побажання щодо посадки" />
            </label>
          </section>
        </form>

        <aside className="summary summary--sticky">
          <p className="eyebrow">Ваше замовлення</p>
          <ul className="mini-lines">
            {bag.map((l) => (
              <li key={l.key}>
                <Image src={l.image} alt="" width={60} height={90} />
                <span>
                  <b>{l.name}</b>
                  <small>
                    {l.color} · {l.size} · {l.qty} шт.
                  </small>
                </span>
                <span>{formatPrice(l.price)}</span>
              </li>
            ))}
          </ul>
          <div className="sum-row">
            <span>Доставка</span>
            <span>за тарифами</span>
          </div>
          <div className="sum-row sum-row--total">
            <span>Разом</span>
            <span>₴</span>
          </div>
          <button form="co" className="btn btn--dark btn--block" disabled={busy}>
            {payment === "card" ? (
              <>
                <IconLock width={16} height={16} /> Перейти до оплати
              </>
            ) : (
              "Підтвердити замовлення"
            )}
          </button>
          <p className="muted small">Натискаючи кнопку, ви погоджуєтесь з умовами <Link href="/info/oferta">публічної оферти</Link>.</p>
        </aside>
      </div>

      {stage === "pay" && <PayDemo onClose={() => setStage("form")} onPaid={place} busy={busy} />}
    </div>
  );
}

function PayDemo({ onClose, onPaid, busy }: { onClose: () => void; onPaid: () => void; busy: boolean }) {
  const [card, setCard] = useState({ num: "4242 4242 4242 4242", exp: "12/28", cvv: "123" });
  return (
    <div className="modal" role="dialog" aria-label="Оплата карткою">
      <div className="modal__box pay">
        <div className="modal__head">
          <p className="eyebrow">
            <IconLock width={14} height={14} /> Безпечна оплата · демо
          </p>
          <button className="icon-btn" aria-label="Закрити" onClick={onClose}>
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
        <p className="pay__or">або карткою</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onPaid();
          }}
        >
          <label className="field field--wide">
            <span>Номер картки</span>
            <input inputMode="numeric" value={card.num} onChange={(e) => setCard({ ...card, num: e.target.value })} />
          </label>
          <div className="fields">
            <label className="field">
              <span>Термін</span>
              <input value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} />
            </label>
            <label className="field">
              <span>CVV</span>
              <input inputMode="numeric" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
            </label>
          </div>
          <button className="btn btn--dark btn--block" disabled={busy}>
            {busy ? "Обробка…" : "Оплатити"}
          </button>
        </form>
        <p className="muted small">Тестова форма: дані картки нікуди не передаються. Реальний платіжний сервіс (LiqPay / WayForPay / Monobank) підключимо на наступному етапі.</p>
      </div>
    </div>
  );
}
