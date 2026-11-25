import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SizeTable } from "@/components/ProductView";
import { site } from "@/lib/site";
import { getTr } from "@/i18n/server";
import { OfferEn, OfferUk, PaymentDeliveryEn, PaymentDeliveryUk, PrivacyEn, PrivacyUk, ReturnsEn, ReturnsUk } from "@/content/legal";

type Page = { title: string; en: string; body: React.ReactNode; bodyEn: React.ReactNode };

const Manager = ({ children }: { children: React.ReactNode }) => (
  <a href={site.manager} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

const PAGES: Record<string, Page> = {
  "oplata-i-dostavka": {
    title: "Оплата і доставка",
    en: "Payment & Delivery",
    body: PaymentDeliveryUk,
    bodyEn: PaymentDeliveryEn,
  },
  "obmin-i-povernennia": {
    title: "Обмін і повернення",
    en: "Exchange & Return",
    body: ReturnsUk,
    bodyEn: ReturnsEn,
  },
  "rozmirna-sitka": {
    title: "Розмірна сітка",
    en: "Size Chart",
    body: (
      <>
        <p>Більшість моделей CORSO мають подвійні розміри (XS/S, M/L) або вільну посадку oversize / one size.</p>
        <SizeTable />
        <p className="muted small">Заміри тіла в сантиметрах, орієнтовні. Сумніваєтесь — напишіть зріст і параметри в коментарі до замовлення.</p>
      </>
    ),
    bodyEn: (
      <>
        <p>Most CORSO pieces come in double sizes (XS/S, M/L) or a relaxed oversize / one-size fit.</p>
        <SizeTable />
        <p className="muted small">Approximate body measurements in centimetres. Not sure? Add your height and measurements to the order notes.</p>
      </>
    ),
  },
  dohliad: {
    title: "Догляд за виробами",
    en: "Care Guide",
    body: (
      <ul className="dash">
        <li>Вовна та кашемір: лише хімчистка, зберігайте на широких плічках у чохлі.</li>
        <li>Пуховики: делікатне прання при 30 °C з кулькам для сушіння, не віджимати сильно.</li>
        <li>Бавовна, льон, тенсел: ручне або делікатне прання при 30 °C, прасування з вивороту.</li>
        <li>Сатин і шовк: ручне прання у прохолодній воді, без віджиму, прасування через тканину.</li>
        <li>Еко-шкіра: протирайте вологою серветкою, не прати в машині.</li>
      </ul>
    ),
    bodyEn: (
      <ul className="dash">
        <li>Wool and cashmere: dry clean only, store on wide hangers in a garment bag.</li>
        <li>Puffers: delicate wash at 30 °C with dryer balls, do not wring hard.</li>
        <li>Cotton, linen, tencel: hand or delicate wash at 30 °C, iron inside out.</li>
        <li>Satin and silk: hand wash in cool water, do not wring, iron through a cloth.</li>
        <li>Eco-leather: wipe with a damp cloth, do not machine wash.</li>
      </ul>
    ),
  },
  opt: {
    title: "Співпраця та опт",
    en: "Wholesale",
    body: (
      <>
        <p>Співпрацюємо з шоурумами та мультибрендовими магазинами.</p>
        <ul className="dash">
          <li>Опт — від 6 одиниць однієї моделі.</li>
          <li>Накладеного платежу на опт немає.</li>
        </ul>
        <p>
          <Manager>Напишіть менеджеру CORSO в Telegram</Manager> — надішлемо умови.
        </p>
      </>
    ),
    bodyEn: (
      <>
        <p>We work with showrooms and multi-brand stores.</p>
        <ul className="dash">
          <li>Wholesale — from 6 pieces of one style.</li>
          <li>No cash on delivery for wholesale orders.</li>
        </ul>
        <p>
          <Manager>Message the CORSO manager on Telegram</Manager> — we will send you the terms.
        </p>
      </>
    ),
  },
  oferta: {
    title: "Публічна оферта",
    en: "Public Offer",
    body: OfferUk,
    bodyEn: OfferEn,
  },
  konfidentsiinist: {
    title: "Політика конфіденційності",
    en: "Privacy Policy",
    body: PrivacyUk,
    bodyEn: PrivacyEn,
  },
};

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = PAGES[(await params).slug];
  const { tr } = await getTr();
  return p ? { title: tr(p.title, p.en) } : {};
}

export default async function InfoPage({ params }: { params: Params }) {
  const slug = (await params).slug;
  const p = PAGES[slug];
  if (!p) notFound();
  const { lang, tr } = await getTr();
  const en = lang === "en";
  return (
    <div className="narrow info">
      <header className="page-head">
        <p className="eyebrow">{en ? "Client care" : p.en}</p>
        <h1 className="h-title h-xl">{tr(p.title, p.en)}</h1>
      </header>
      <div className="prose">{en ? p.bodyEn : p.body}</div>
      <nav className="info__nav">
        {Object.entries(PAGES)
          .filter(([s]) => s !== slug)
          .map(([s, x]) => (
            <Link key={s} href={`/info/${s}`} className="chip">
              {tr(x.title, x.en)}
            </Link>
          ))}
      </nav>
    </div>
  );
}
