"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useStore, type Measurements } from "@/lib/store";
import { EMPTY_MEASUREMENTS, MeasureFields, hasMeasurements, measurementsLine } from "@/components/MeasureFields";

type Tab = "orders" | "measure" | "profile" | "addresses";

export function AccountView() {
  const { user, ready, signIn, signOut, orders, wishlist } = useStore();
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
          <h1 className="h-title h-xl">{mode === "in" ? "Вхід" : "Реєстрація"}</h1>
          <p className="muted">Історія замовлень, обране, швидке оформлення і доступ до закритих передзамовлень.</p>
          <div className="seg">
            <button className={mode === "in" ? "is-on" : ""} onClick={() => setMode("in")}>
              Вхід
            </button>
            <button className={mode === "up" ? "is-on" : ""} onClick={() => setMode("up")}>
              Реєстрація
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
                <span>Ім&apos;я</span>
                <input required value={f.name} onChange={set("name")} autoComplete="name" />
              </label>
            )}
            <label className="field field--wide">
              <span>E-mail</span>
              <input required type="email" value={f.email} onChange={set("email")} autoComplete="email" />
            </label>
            {mode === "up" && (
              <label className="field field--wide">
                <span>Телефон</span>
                <input type="tel" value={f.phone} onChange={set("phone")} placeholder="+380" autoComplete="tel" />
              </label>
            )}
            <label className="field field--wide">
              <span>Пароль</span>
              <input required type="password" minLength={6} value={f.password} onChange={set("password")} autoComplete={mode === "in" ? "current-password" : "new-password"} />
            </label>
            <button className="btn btn--dark btn--block">{mode === "in" ? "Увійти" : "Створити акаунт"}</button>
          </form>
          <p className="demo-note">Демо-кабінет: дані зберігаються лише у вашому браузері.</p>
        </div>
      </div>
    );

  return (
    <div className="acct">
      <header className="page-head">
        <p className="eyebrow">My account</p>
        <h1 className="h-title h-xl">
          Вітаємо, <em>{user.name}</em>
        </h1>
      </header>
      <div className="seg seg--wide">
        <button className={tab === "orders" ? "is-on" : ""} onClick={() => setTab("orders")}>
          Замовлення
        </button>
        <button className={tab === "measure" ? "is-on" : ""} onClick={() => setTab("measure")}>
          Параметри
        </button>
        <button className={tab === "profile" ? "is-on" : ""} onClick={() => setTab("profile")}>
          Профіль
        </button>
        <button className={tab === "addresses" ? "is-on" : ""} onClick={() => setTab("addresses")}>
          Адреси
        </button>
      </div>

      {tab === "orders" &&
        (orders.length === 0 ? (
          <div className="empty">
            <p className="title-sm">Замовлень поки немає</p>
            <Link href="/catalog" className="btn btn--dark">
              До каталогу
            </Link>
          </div>
        ) : (
          <ul className="orders">
            {orders.map((o) => (
              <li key={o.id} className="order">
                <div className="order__head">
                  <b>{o.id}</b>
                  <span className="muted small">{new Date(o.date).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span className="badge">{o.status}</span>
                </div>
                <div className="order__imgs">
                  {o.lines.map((l) => (
                    <Image key={l.key} src={l.image} alt={l.name} width={72} height={108} />
                  ))}
                </div>
                <p className="muted small">
                  {o.delivery} · {o.payment}
                </p>
                {hasMeasurements(o.measurements) && <p className="muted small">{measurementsLine(o.measurements)}</p>}
              </li>
            ))}
          </ul>
        ))}

      {tab === "measure" && <MeasurePanel />}

      {tab === "profile" && (
        <div className="profile">
          <dl>
            <dt>Ім&apos;я</dt>
            <dd>{user.name}</dd>
            <dt>E-mail</dt>
            <dd>{user.email}</dd>
            <dt>Телефон</dt>
            <dd>{user.phone || "—"}</dd>
            <dt>Обране</dt>
            <dd>
              <Link href="/wishlist">{wishlist.length} моделей</Link>
            </dd>
          </dl>
          <button className="btn btn--line" onClick={signOut}>
            Вийти
          </button>
        </div>
      )}

      {tab === "addresses" && (
        <div className="empty">
          <p className="muted">Збережені адреси доставки з&apos;являться після першого замовлення.</p>
        </div>
      )}
      <p className="demo-note">Демо-кабінет: повноцінна авторизація та синхронізація з CRM — на наступному етапі.</p>
    </div>
  );
}

function MeasurePanel() {
  const { measurements, setMeasurements } = useStore();
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
      <p className="title-sm">Мої параметри</p>
      <p className="muted small">
        Ми шиємо на власному виробництві й адаптуємо кожну модель під вашу фігуру. Параметри автоматично підставляються під час
        оформлення замовлення.
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
        <button className="btn btn--dark">Зберегти</button>
        {saved && <span className="muted small">Збережено</span>}
      </div>
    </form>
  );
}
