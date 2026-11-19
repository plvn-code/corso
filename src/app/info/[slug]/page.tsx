import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SizeTable } from "@/components/ProductView";
import { site } from "@/lib/site";

type Page = { title: string; en: string; body: React.ReactNode };

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
          З питань обміну пишіть менеджеру:{" "}
          <a href={site.manager} target="_blank" rel="noopener noreferrer">
            {site.managerHandle}
          </a>
          .
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
          Напишіть нам:{" "}
          <a href={site.manager} target="_blank" rel="noopener noreferrer">
            {site.managerHandle}
          </a>
        </p>
      </>
    ),
  },
  oferta: {
    title: "Публічна оферта",
    en: "Public Offer",
    body: <p>Текст публічної оферти буде додано після погодження з юристом бренду. Чернетка.</p>,
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
  },
};

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = PAGES[(await params).slug];
  return p ? { title: p.title } : {};
}

export default async function InfoPage({ params }: { params: Params }) {
  const slug = (await params).slug;
  const p = PAGES[slug];
  if (!p) notFound();
  return (
    <div className="narrow info">
      <header className="page-head">
        <p className="eyebrow">{p.en}</p>
        <h1 className="h-title h-xl">{p.title}</h1>
      </header>
      <div className="prose">{p.body}</div>
      <nav className="info__nav">
        {Object.entries(PAGES)
          .filter(([s]) => s !== slug)
          .map(([s, x]) => (
            <Link key={s} href={`/info/${s}`} className="chip">
              {x.title}
            </Link>
          ))}
      </nav>
    </div>
  );
}
