"use client";

import { useLang } from "@/i18n/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore, type Measurements } from "@/lib/store";
import { optionLabel } from "@/app/checkout/CheckoutForm";
import { formatPrice } from "@/lib/format";
import { locale } from "@/i18n/lang";
import { EMPTY_MEASUREMENTS, MeasureFields, hasMeasurements, measurementsLine } from "@/components/MeasureFields";

type Tab = "orders" | "measure" | "profile" | "addresses";

export function AccountView() {
  const { user, ready, signIn, signOut, orders, wishlist } = useStore();
  const { lang, tr } = useLang();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [tab, setTab] = useState<Tab>("orders");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  if (!ready) return <div className="narrow" style={{ minHeight: "60vh" }} />;

  if (!user)
    return (
      <div className="auth">
        <div className="auth__img">
          <Image src="/images/editorial/hero-shirt.jpg" alt="" fill sizes="(max-width: 960px) 100vw, 50vw" priority />
        </div>
        <div className="auth__box">
          <p className="eyebrow">CORSO Edit Club</p>
          <h1 className="h-title h-xl">{mode === "in" ? tr("Вхід", "Sign in") : tr("Реєстрація", "Create account")}</h1>
          <p className="muted">{tr("Історія замовлень, обране, швидке оформлення і доступ до закритих передзамовлень.", "Order history, wishlist, faster checkout and access to private pre-orders.")}</p>
          <div className="seg">
            <button className={mode === "in" ? "is-on" : ""} onClick={() => setMode("in")}>
              {tr("Вхід", "Sign in")}
            </button>
            <button className={mode === "up" ? "is-on" : ""} onClick={() => setMode("up")}>
              {tr("Реєстрація", "Register")}
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signIn({ name: f.name || f.email.split("@")[0], email: f.email, phone: f.phone });
            }}
          >
            {mode === "up" && (
              <label className="field field--wide">
                <span>{tr("Імʼя", "Name")}</span>
                <input required value={f.name} onChange={set("name")} autoComplete="name" />
              </label>
            )}
            <label className="field field--wide">
              <span>E-mail</span>
              <input required type="email" value={f.email} onChange={set("email")} autoComplete="email" />
            </label>
            {mode === "up" && (
              <label className="field field--wide">
                <span>{tr("Телефон", "Phone")}</span>
                <input type="tel" value={f.phone} onChange={set("phone")} placeholder="+380" autoComplete="tel" />
              </label>
            )}
            <label className="field field--wide">
              <span>{tr("Пароль", "Password")}</span>
              <input required type="password" minLength={6} value={f.password} onChange={set("password")} autoComplete={mode === "in" ? "current-password" : "new-password"} />
            </label>
            <button className="btn btn--dark btn--block">{mode === "in" ? tr("Увійти", "Sign in") : tr("Створити акаунт", "Create account")}</button>
          </form>
          <p className="demo-note">{tr("Демо-кабінет: дані зберігаються лише у вашому браузері.", "Demo account: data is stored only in your browser.")}</p>
        </div>
      </div>
    );

  return (
    <div className="acct">
      <header className="page-head">
        <p className="eyebrow">My account</p>
        <h1 className="h-title h-xl">
          {tr("Вітаємо,", "Welcome,")} <em>{user.name}</em>
        </h1>
      </header>
      <div className="seg seg--wide">
        <button className={tab === "orders" ? "is-on" : ""} onClick={() => setTab("orders")}>
          {tr("Замовлення", "Orders")}
        </button>
        <button className={tab === "measure" ? "is-on" : ""} onClick={() => setTab("measure")}>
          {tr("Параметри", "Measurements")}
        </button>
        <button className={tab === "profile" ? "is-on" : ""} onClick={() => setTab("profile")}>
          {tr("Профіль", "Profile")}
        </button>
        <button className={tab === "addresses" ? "is-on" : ""} onClick={() => setTab("addresses")}>
          {tr("Адреси", "Addresses")}
        </button>
      </div>

      {tab === "orders" &&
        (orders.length === 0 ? (
          <div className="empty">
            <p className="title-sm">{tr("Замовлень поки немає", "No orders yet")}</p>
            <Link href="/catalog" className="btn btn--dark">
              {tr("До каталогу", "Go to shop")}
            </Link>
          </div>
        ) : (
          <ul className="orders">
            {orders.map((o) => (
              <li key={o.id} className="order">
                <div className="order__head">
                  <b>{o.id}</b>
                  <span className="muted small">{new Date(o.date).toLocaleDateString(locale(lang), { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span className="badge">{optionLabel(o.status, lang)}</span>
                </div>
                <div className="order__imgs">
                  {o.lines.map((l) => (
                    <Image key={l.key} src={l.image} alt={l.names?.[lang] ?? l.name} width={72} height={108} />
                  ))}
                </div>
                <p className="muted small">
                  {optionLabel(o.delivery, lang)} · {optionLabel(o.payment, lang)}
                  {o.prepay ? ` · ${tr("передоплата", "prepaid")} ${formatPrice(o.prepay)}` : ""}
                </p>
                {hasMeasurements(o.measurements) && <p className="muted small">{measurementsLine(o.measurements, lang)}</p>}
              </li>
            ))}
          </ul>
        ))}

      {tab === "measure" && <MeasurePanel />}

      {tab === "profile" && (
        <div className="profile">
          <dl>
            <dt>{tr("Імʼя", "Name")}</dt>
            <dd>{user.name}</dd>
            <dt>E-mail</dt>
            <dd>{user.email}</dd>
            <dt>{tr("Телефон", "Phone")}</dt>
            <dd>{user.phone || "—"}</dd>
            <dt>{tr("Обране", "Wishlist")}</dt>
            <dd>
              <Link href="/wishlist">{wishlist.length} {tr("моделей", "pieces")}</Link>
            </dd>
          </dl>
          <button className="btn btn--line" onClick={signOut}>
            {tr("Вийти", "Sign out")}
          </button>
        </div>
      )}

      {tab === "addresses" && (
        <div className="empty">
          <p className="muted">{tr("Збережені адреси доставки зʼявляться після першого замовлення.", "Saved delivery addresses will appear after your first order.")}</p>
        </div>
      )}
      <p className="demo-note">{tr("Демо-кабінет: повноцінна авторизація та синхронізація з CRM — на наступному етапі.", "Demo account: full sign-in and CRM sync come at the next stage.")}</p>
    </div>
  );
}

function MeasurePanel() {
  const { measurements, setMeasurements } = useStore();
  const { tr } = useLang();
  const [m, setM] = useState<Measurements>(measurements ?? EMPTY_MEASUREMENTS);
  const [saved, setSaved] = useState(false);
  return (
    <form
      className="measure-panel"
      onSubmit={(e) => {
        e.preventDefault();
        setMeasurements(m);
        setSaved(true);
      }}
    >
      <p className="title-sm">{tr("Мої параметри", "My measurements")}</p>
      <p className="muted small">
        {tr(
          "Ми шиємо на власному виробництві й адаптуємо кожну модель під вашу фігуру. Параметри автоматично підставляються під час оформлення замовлення.",
          "We sew in our own atelier and adapt every piece to your figure. Your measurements are filled in automatically at checkout.",
        )}
      </p>
      <MeasureFields
        value={m}
        onChange={(v) => {
          setM(v);
          setSaved(false);
        }}
        required
      />
      <div className="measure-panel__foot">
        <button className="btn btn--dark">{tr("Зберегти", "Save")}</button>
        {saved && <span className="muted small">{tr("Збережено", "Saved")}</span>}
      </div>
    </form>
  );
}
