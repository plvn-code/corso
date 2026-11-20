import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SizeTable } from "@/components/ProductView";
import { site } from "@/lib/site";
import { getTr } from "@/i18n/server";

type Page = { title: string; en: string; body: React.ReactNode; bodyEn: React.ReactNode };

const Manager = () => (
  <a href={site.manager} target="_blank" rel="noopener noreferrer">
    {site.managerHandle}
  </a>
);

const PAGES: Record<string, Page> = {
  "oplata-i-dostavka": {
    title: "Оплата і доставка",
    en: "Payment & Delivery",
    body: (
      <>
        <h2>Доставка</h2>
        <ul className="dash">
          <li>Нова пошта по всій Україні: відділення, поштомат або кур&apos;єр. Відправка протягом 1–2 днів.</li>
          <li>Самовивіз — шоурум у Дніпрі, {site.address}.</li>
          <li>Вартість доставки — за тарифами перевізника.</li>
        </ul>
        <h2>Оплата</h2>
        <ul className="dash">
          <li>Карткою онлайн на сайті — Visa, Mastercard, Apple Pay, Google Pay (підключається).</li>
          <li>Офіційна оплата на рахунок ФОП за реквізитами IBAN або на картку ПриватБанку.</li>
          <li>Накладений платіж з передоплатою 250 грн.</li>
        </ul>
        <h2>Опт</h2>
        <p>Опт — від 6 одиниць однієї моделі. Накладеного платежу на опт немає.</p>
      </>
    ),
    bodyEn: (
      <>
        <h2>Delivery</h2>
        <ul className="dash">
          <li>Nova Poshta across Ukraine: branch, parcel locker or courier. Dispatched within 1–2 days.</li>
          <li>Pickup — our showroom in Dnipro, {site.addressEn}.</li>
          <li>Delivery cost — at the carrier&apos;s rates.</li>
        </ul>
        <h2>Payment</h2>
        <ul className="dash">
          <li>By card online — Visa, Mastercard, Apple Pay, Google Pay (being connected).</li>
          <li>Official bank transfer to our business account (IBAN) or to a PrivatBank card.</li>
          <li>Cash on delivery with a 250 UAH prepayment.</li>
        </ul>
        <h2>Wholesale</h2>
        <p>Wholesale — from 6 pieces of one style. No cash on delivery for wholesale orders.</p>
      </>
    ),
  },
  "obmin-i-povernennia": {
    title: "Обмін і повернення",
    en: "Exchange & Return",
    body: (
      <>
        <ul className="dash">
          <li>Обмін на інший розмір — за рахунок покупця.</li>
          <li>Повернення — у разі виявлення браку під час огляду у відділенні пошти.</li>
          <li>Перед відправкою менеджер допоможе підібрати розмір за вашими параметрами, щоб обмін не знадобився.</li>
        </ul>
        <p>
          З питань обміну пишіть менеджеру: <Manager />.
        </p>
      </>
    ),
    bodyEn: (
      <>
        <ul className="dash">
          <li>Size exchanges are at the buyer&apos;s expense.</li>
          <li>Returns — if a defect is found when inspecting the parcel at the post office.</li>
          <li>Before dispatch our manager will help you choose the size for your measurements, so an exchange isn&apos;t needed.</li>
        </ul>
        <p>
          For exchanges, message our manager: <Manager />.
        </p>
      </>
    ),
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
          Напишіть менеджеру: <Manager /> — надішлемо умови.
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
          Message our manager: <Manager /> — we will send you the terms.
        </p>
      </>
    ),
  },
  oferta: {
    title: "Публічна оферта",
    en: "Terms of Sale",
    body: <p>Текст публічної оферти буде додано після погодження з юристом бренду. Чернетка.</p>,
    bodyEn: <p>The terms of sale will be added once approved by the brand&apos;s lawyer. Draft.</p>,
  },
  konfidentsiinist: {
    title: "Політика конфіденційності",
    en: "Privacy Policy",
    body: (
      <p>
        Ми використовуємо ваші контактні дані лише для обробки замовлення та зв&apos;язку з вами. Дані не передаються третім особам, окрім служби
        доставки. Повний текст політики буде додано перед запуском.
      </p>
    ),
    bodyEn: (
      <p>
        We use your contact details only to process your order and to get in touch with you. Data is not shared with third parties other than
        the delivery service. The full policy will be added before launch.
      </p>
    ),
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
