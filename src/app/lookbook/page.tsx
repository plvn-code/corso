import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTr } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await getTr();
  return {
    title: tr("Лукбук", "Lookbook"),
    description: tr(
      "CORSO — лукбук осінь-зима 26/27: пуховики NOIR SHELL, пальта, тренчі, шкіряна лінійка.",
      "CORSO lookbook fall-winter 26/27: NOIR SHELL puffers, coats, trench coats, the leather line.",
    ),
  };
}

const STORIES = [
  {
    no: "I",
    title: "Noir Shell",
    sub: "Лаковий блиск, скульптурний комір",
    subEn: "Patent shine, sculptural collar",
    text: "Ікона зимового гардероба CORSO — у глибокому бургунді та чорному. Технологічна мембрана, еко-пух і манжети Velcro як елемент high-fashion деконструкції.",
    textEn: "The icon of the CORSO winter wardrobe — in deep burgundy and black. A technical membrane, eco-down and Velcro cuffs as an element of high-fashion deconstruction.",
    imgs: ["hero-burgundy", "puffer-burgundy", "noir-shell"],
    href: "/catalog?c=puhovyky",
  },
  {
    no: "II",
    title: "Sky-High Quality",
    sub: "Тренч міді у трьох кольорах",
    subEn: "A midi trench in three colours",
    text: "Італійська тканина преміум-класу, колір неба та ідеальне міді. Той випадок, коли варто один раз побачити, щоб закохатися назавжди.",
    textEn: "Premium Italian fabric, the colour of the sky and the perfect midi. The kind of piece you see once and fall in love with forever.",
    imgs: ["trench-sky", "trench-sky-2", "trench-black"],
    href: "/product/trench-coat",
  },
  {
    no: "III",
    title: "Sculpted Leather",
    sub: "Burgundy · Black · Milk",
    subEn: "Burgundy · Black · Milk",
    text: "Структурний жакет з акцентним плечем, спідниця міні або міді та бомбер з об'ємними рукавами. Збирай повний leather set або обирай кожну одиницю окремо.",
    textEn: "A structured jacket with statement shoulders, a mini or midi skirt and a bomber with voluminous sleeves. Build the full leather set or choose each piece separately.",
    imgs: ["leather-milk", "leather-burgundy", "burgundy-set"],
    href: "/catalog?c=shkira",
  },
  {
    no: "IV",
    title: "A Coat That Stays",
    sub: "Вовна і кашемір",
    subEn: "Wool and cashmere",
    text: "Архітектурний силует максі у глибокому графіті. Виразні лацкани, двобортна застібка й погони — від класики до стриманого мінімалізму.",
    textEn: "An architectural maxi silhouette in deep graphite. Bold lapels, a double-breasted fastening and epaulettes — from classic to restrained minimalism.",
    imgs: ["hero-coat", "grey-coat", "trench-beige"],
    href: "/catalog?c=palta",
  },
];

export default async function Lookbook() {
  const { lang, tr } = await getTr();
  const en = lang === "en";
  return (
    <div className="lb">
      <header className="lb__head">
        <p className="eyebrow">Lookbook · Fall Winter 26/27</p>
        <h1 className="lb__title">
          Winter,
          <br />
          <em>the CORSO way</em>
        </h1>
        <p className="lead">{tr("Зима в прочитанні CORSO: речі, цінність яких виходить за межі одного сезону.", "Winter, the CORSO way: pieces whose value reaches beyond a single season.")}</p>
      </header>
      {STORIES.map((s, i) => (
        <section key={s.no} className={`lb__story${i % 2 ? " lb__story--rev" : ""}`}>
          <div className="lb__main" data-reveal>
            <Image src={`/images/editorial/${s.imgs[0]}.jpg`} alt={s.title} fill sizes="(max-width: 960px) 100vw, 60vw" quality={90} />
          </div>
          <div className="lb__side">
            <div className="lb__text" data-reveal>
              <span className="lb__no">{s.no}</span>
              <h2 className="h-title h-xl">{s.title}</h2>
              <p className="eyebrow">{en ? s.subEn : s.sub}</p>
              <p className="lead">{en ? s.textEn : s.text}</p>
              <Link href={s.href} className="ulink">
                {tr("Купити образ", "Shop the look")}
              </Link>
            </div>
            <div className="lb__pair">
              {s.imgs.slice(1).map((n) => (
                <div key={n} className="lb__small" data-reveal>
                  <Image src={`/images/editorial/${n}.jpg`} alt="" fill sizes="(max-width: 960px) 50vw, 20vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="quote" data-reveal>
        <p className="eyebrow">Summer 26 · Archive</p>
        <blockquote>{tr("«Розкіш — коли нічого не обтяжує. Легкість у русі. Мʼякість дотику.»", "“Luxury is when nothing weighs you down. Ease of movement. Softness of touch.”")}</blockquote>
        <Link href="/catalog?col=ss26" className="ulink">
          {tr("Літня колекція", "Summer collection")}
        </Link>
      </section>
      <div className="lb__summer">
        {["satin", "tencel", "linen", "lilac"].map((n) => (
          <div key={n} className="lb__small" data-reveal>
            <Image src={`/images/editorial/${n}.jpg`} alt="" fill sizes="(max-width: 960px) 50vw, 25vw" />
          </div>
        ))}
      </div>
    </div>
  );
}
