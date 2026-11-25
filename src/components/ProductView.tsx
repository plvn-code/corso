"use client";

import { useLang } from "@/i18n/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { IconClose, IconHeart, IconPlus, IconTelegram } from "./Icons";
import { site } from "@/lib/site";
import { PREPAY_HREF, PREPAY_MIN } from "@/lib/prepay";

export interface ViewData {
  slug: string;
  name: string;
  line: string;
  category: string;
  categoryName: string;
  price: number | null;
  tag?: string;
  sizes: string[];
  sizeNote?: string;
  description: string[];
  details: string[];
  composition: string[];
  colors: { name: string; hex: string; images: string[] }[];
  /** name in both languages — stored with the bag line */
  names: { uk: string; en: string };
}

function Accordion({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [on, setOn] = useState(open);
  return (
    <div className={`acc${on ? " is-open" : ""}`}>
      <button className="acc__head" aria-expanded={on} onClick={() => setOn(!on)}>
        <span>{title}</span>
        <IconPlus width={16} height={16} />
      </button>
      <div className="acc__body">
        <div>{children}</div>
      </div>
    </div>
  );
}

export function ProductView({ p, initialColor = 0 }: { p: ViewData; initialColor?: number }) {
  const router = useRouter();
  const { add, wishlist, toggleWish, ready } = useStore();
  const { tr } = useLang();
  const [ci, setCi] = useState(Math.min(initialColor, p.colors.length - 1));
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [warn, setWarn] = useState(false);
  const [slide, setSlide] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const [guide, setGuide] = useState(false);
  const [sticky, setSticky] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const color = p.colors[ci];
  const wished = ready && wishlist.includes(p.slug);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("is-menu", zoom !== null || guide);
  }, [zoom, guide]);

  function pickColor(i: number) {
    setCi(i);
    setSlide(0);
    trackRef.current?.scrollTo({ left: 0 });
    const url = new URL(window.location.href);
    if (i) url.searchParams.set("color", String(i));
    else url.searchParams.delete("color");
    window.history.replaceState(null, "", url);
  }

  function addToBag(goCheckout: boolean | string) {
    if (!size) {
      setWarn(true);
      document.getElementById("sizes")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    add({ slug: p.slug, name: p.name, names: p.names, color: color.name, size, image: color.images[0], price: p.price }, !goCheckout);
    if (goCheckout) router.push(typeof goCheckout === "string" ? goCheckout : "/checkout");
  }

  return (
    <div className="pdp">
      <div className="pdp__gallery">
        <div
          className="gal"
          ref={trackRef}
          onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        >
          {color.images.map((src, i) => (
            <button key={src} className="gal__item" onClick={() => setZoom(i)} aria-label={`${tr("Збільшити фото", "Zoom photo")} ${i + 1}`}>
              <Image
                src={src}
                alt={`${p.name} — ${color.name}, ${tr("фото", "photo")} ${i + 1}`}
                fill
                sizes="(max-width: 960px) 100vw, 33vw"
                priority={i < 2}
                quality={90}
              />
            </button>
          ))}
        </div>
        <div className="gal__meta" aria-hidden>
          <div className="gal__bar">
            <span style={{ width: `${100 / color.images.length}%`, transform: `translateX(${slide * 100}%)` }} />
          </div>
          <span className="gal__count">
            {String(slide + 1).padStart(2, "0")} / {String(color.images.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="pdp__info">
        <div className="pdp__sticky">
          <nav className="crumbs" aria-label={tr("Навігація", "Breadcrumbs")}>
            <Link href="/catalog">{tr("Каталог", "Shop")}</Link>
            <span>/</span>
            <Link href={`/catalog?c=${p.category}`}>{p.categoryName}</Link>
          </nav>
          <p className="pdp__line">{p.line}</p>
          <h1 className="pdp__name">{p.name}</h1>
          <p className="pdp__price">
            {formatPrice(p.price)}
            {p.price == null && <span className="pdp__price-note">{tr("ціна уточнюється", "price on request")}</span>}
          </p>

          <div className="pdp__block">
            <p className="pdp__label">
              {tr("Колір", "Colour")}: <b>{color.name}</b>
            </p>
            <div className="swatches">
              {p.colors.map((c, i) => (
                <button
                  key={c.name}
                  className={`swatch${i === ci ? " is-on" : ""}`}
                  onClick={() => pickColor(i)}
                  aria-label={c.name}
                  aria-pressed={i === ci}
                  title={c.name}
                >
                  <Image src={c.images[0]} alt="" width={56} height={84} />
                </button>
              ))}
            </div>
          </div>

          <div className="pdp__block" id="sizes">
            <div className="pdp__label pdp__label--row">
              <span>
                {tr("Розмір", "Size")}
                {size && (
                  <>
                    : <b>{size}</b>
                  </>
                )}
              </span>
              <button className="link-btn" onClick={() => setGuide(true)}>
                {tr("Розмірна сітка", "Size guide")}
              </button>
            </div>
            <div className={`sizes${warn && !size ? " is-warn" : ""}`}>
              {p.sizes.map((s) => (
                <button
                  key={s}
                  className={`size${size === s ? " is-on" : ""}`}
                  onClick={() => {
                    setSize(s);
                    setWarn(false);
                  }}
                  aria-pressed={size === s}
                >
                  {s}
                </button>
              ))}
            </div>
            {p.sizeNote && <p className="muted small">{p.sizeNote}</p>}
            {warn && !size && <p className="warn">{tr("Оберіть, будь ласка, розмір", "Please select a size")}</p>}
          </div>

          <div className="pdp__cta" ref={ctaRef}>
            <div className="pdp__cta-row">
              <button className="btn btn--line btn--grow" onClick={() => addToBag(false)}>
                {tr("Додати в кошик", "Add to bag")}
              </button>
              <button
                className={`btn btn--line btn--square${wished ? " is-on" : ""}`}
                aria-label={wished ? tr("Прибрати з обраного", "Remove from wishlist") : tr("Додати в обране", "Add to wishlist")}
                aria-pressed={wished}
                onClick={() => toggleWish(p.slug)}
              >
                <IconHeart filled={wished} width={18} height={18} />
              </button>
            </div>
            <button className="btn btn--dark btn--block" onClick={() => addToBag(true)}>
              {tr("Купити зараз", "Buy now")}
            </button>
            <button className="btn btn--line btn--block btn--prepay" onClick={() => addToBag(PREPAY_HREF)}>
              {tr("Замовити з передоплатою", "Order with prepayment")}
              <small>
                {tr("від", "from")} {formatPrice(PREPAY_MIN)}
              </small>
            </button>
          </div>

          <ul className="pdp__perks">
            <li>{tr("Відправка Новою поштою за 1–2 дні", "Nova Poshta shipping in 1–2 days")}</li>
            <li>{tr("Примірка в магазині у Дніпрі", "Fitting at our Dnipro store")}</li>
            <li>{tr("Оплата онлайн, при отриманні або на рахунок", "Pay online, on delivery or by bank transfer")}</li>
          </ul>
          <a href={site.manager} target="_blank" rel="noopener noreferrer" className="pdp__ask">
            <IconTelegram width={16} height={16} /> {tr("Запитати менеджера в Telegram", "Ask our manager on Telegram")}
          </a>

          <div className="accs">
            <Accordion title={tr("Опис", "Description")} open>
              {p.description.map((t) => (
                <p key={t}>{t}</p>
              ))}
              {p.details.length > 0 && (
                <ul className="dash">
                  {p.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </Accordion>
            <Accordion title={tr("Склад і догляд", "Composition & care")}>
              {p.composition.length > 0 ? (
                <ul className="dash">
                  {p.composition.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              ) : (
                <p>{tr("Склад уточнюйте в менеджера.", "Please ask our manager about the composition.")}</p>
              )}
              <p>
                {tr("Делікатне прання або хімчистка. Детальніше —", "Delicate wash or dry clean. More in")}{" "}
                <Link href="/info/dohliad">{tr("догляд за виробами", "garment care")}</Link>.
              </p>
            </Accordion>
            <Accordion title={tr("Оплата і доставка", "Payment & delivery")}>
              <p>
                {tr(
                  "Відправка Новою поштою по Україні протягом 1–2 днів: відділення, поштомат або адресна доставка курʼєром. Самовивіз — магазин у Дніпрі.",
                  "Nova Poshta shipping across Ukraine within 1–2 days: branch, parcel locker or courier to your door. Pickup from our store in Dnipro.",
                )}
              </p>
              <p>
                {tr(
                  `Оплата карткою онлайн, на рахунок ФОП (IBAN) або накладеним платежем з передоплатою від ${PREPAY_MIN} грн.`,
                  `Pay by card online, by bank transfer (IBAN) or cash on delivery with a prepayment from ${PREPAY_MIN} UAH.`,
                )}{" "}
                <Link href="/info/oplata-i-dostavka">{tr("Детальніше", "Details")}</Link>
              </p>
            </Accordion>
            <Accordion title={tr("Обмін і повернення", "Exchanges & returns")}>
              <p>
                {tr(
                  "Обмін на інший розмір — за рахунок покупця. Повернення — у разі виявлення браку під час огляду на пошті.",
                  "Size exchanges are at the buyer's expense. Returns — if a defect is found when inspecting the parcel at the post office.",
                )}{" "}
                <Link href="/info/obmin-i-povernennia">{tr("Умови", "Terms")}</Link>
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* Mobile sticky buy bar */}
      <div className={`buybar${sticky ? " is-on" : ""}`}>
        <div className="buybar__info">
          <span className="buybar__name">{p.name}</span>
          <span>{formatPrice(p.price)}</span>
        </div>
        <button className="btn btn--dark" onClick={() => addToBag(false)}>
          {size ? tr("В кошик", "Add to bag") : tr("Обрати розмір", "Select size")}
        </button>
      </div>

      {/* Zoom */}
      {zoom !== null && (
        <div className="zoom" role="dialog" aria-label={tr("Фото товару", "Product photos")}>
          <button className="icon-btn zoom__close" aria-label={tr("Закрити", "Close")} onClick={() => setZoom(null)}>
            <IconClose />
          </button>
          <div
            className="zoom__scroll"
            ref={(el) => {
              if (el && zoom) el.children[zoom]?.scrollIntoView({ block: "start" });
            }}
          >
            {color.images.map((src, i) => (
              <div key={src} className="zoom__img">
                <Image src={src} alt={`${p.name}, ${tr("фото", "photo")} ${i + 1}`} width={1000} height={1500} sizes="(max-width: 960px) 100vw, 60vw" quality={90} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Size guide */}
      {guide && (
        <div className="modal" role="dialog" aria-label={tr("Розмірна сітка", "Size guide")} onClick={() => setGuide(false)}>
          <div className="modal__box" onClick={(e) => e.stopPropagation()}>
            <div className="modal__head">
              <p className="eyebrow">{tr("Розмірна сітка", "Size guide")}</p>
              <button className="icon-btn" aria-label={tr("Закрити", "Close")} onClick={() => setGuide(false)}>
                <IconClose />
              </button>
            </div>
            <SizeTable />
            <p className="muted small">
              {tr(
                "Орієнтовні заміри тіла. Для моделей oversize та one size підкажемо посадку за вашими параметрами —",
                "Approximate body measurements. For oversize and one-size pieces we will advise the fit for your measurements —",
              )}{" "}
              <a href={site.manager} target="_blank" rel="noopener noreferrer">
                {tr("напишіть менеджеру CORSO", "message the CORSO manager")}
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function SizeTable() {
  const { tr } = useLang();
  const rows = [
    ["XS", "40", "80–84", "60–64", "86–90"],
    ["S", "42", "84–88", "64–68", "90–94"],
    ["M", "44", "88–92", "68–72", "94–98"],
    ["L", "46", "92–96", "72–76", "98–102"],
    ["XL", "48", "96–100", "76–80", "102–106"],
  ];
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>{tr("Розмір", "Size")}</th>
            <th>UA</th>
            <th>{tr("Груди", "Bust")}</th>
            <th>{tr("Талія", "Waist")}</th>
            <th>{tr("Стегна", "Hips")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, i) => (
                <td key={i}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
