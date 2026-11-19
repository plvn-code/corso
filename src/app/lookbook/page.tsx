import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Лукбук", description: "CORSO — лукбук осінь-зима 26/27: пуховики NOIR SHELL, пальта, тренчі, шкіряна лінійка." };

const STORIES = [
  {
    no: "I",
    title: "Noir Shell",
    sub: "Лаковий блиск, скульптурний комір",
    text: "Ікона зимового гардероба CORSO — у глибокому бургунді та чорному. Технологічна мембрана, еко-пух і манжети Velcro як елемент high-fashion деконструкції.",
    imgs: ["hero-burgundy", "puffer-burgundy", "noir-shell"],
    href: "/catalog?c=puhovyky",
  },
  {
    no: "II",
    title: "Sky-High Quality",
    sub: "Тренч міді у трьох кольорах",
    text: "Італійська тканина преміум-класу, колір неба та ідеальне міді. Той випадок, коли варто один раз побачити, щоб закохатися назавжди.",
    imgs: ["trench-sky", "trench-sky-2", "trench-black"],
    href: "/product/trench-coat",
  },
  {
    no: "III",
    title: "Sculpted Leather",
    sub: "Burgundy · Black · Milk",
    text: "Структурний жакет з акцентним плечем, спідниця міні або міді та бомбер з об'ємними рукавами. Збирай повний leather set або обирай кожну одиницю окремо.",
    imgs: ["leather-milk", "leather-burgundy", "burgundy-set"],
    href: "/catalog?c=shkira",
  },
  {
    no: "IV",
    title: "A Coat That Stays",
    sub: "Вовна і кашемір",
    text: "Архітектурний силует максі у глибокому графіті. Виразні лацкани, двобортна застібка й погони — від класики до стриманого мінімалізму.",
    imgs: ["hero-coat", "grey-coat", "trench-beige"],
    href: "/catalog?c=palta",
  },
];

export default function Lookbook() {
  return (
    <div className="lb">
      <header className="lb__head">
        <p className="eyebrow">Lookbook · Fall Winter 26/27</p>
        <h1 className="lb__title">
          Winter,
          <br />
          <em>the CORSO way</em>
        </h1>
        <p className="lead">Зима в прочитанні CORSO: речі, цінність яких виходить за межі одного сезону.</p>
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
              <p className="eyebrow">{s.sub}</p>
              <p className="lead">{s.text}</p>
              <Link href={s.href} className="ulink">
                Купити образ
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
        <blockquote>«Розкіш — коли нічого не обтяжує. Легкість у русі. М&apos;якість дотику.»</blockquote>
        <Link href="/catalog?col=ss26" className="ulink">
          Літня колекція
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
