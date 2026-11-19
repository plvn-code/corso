import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Про бренд", description: site.description };

export default function About() {
  return (
    <div className="about">
      <section className="about__hero">
        <div className="about__img">
          <Image src="/images/editorial/hero-coat.jpg" alt="CORSO — пальто максі" fill priority sizes="(max-width: 960px) 100vw, 50vw" />
        </div>
        <div className="about__intro">
          <p className="eyebrow">About · Since 2024</p>
          <h1 className="h-serif h-xl">
            Український бренд жіночого одягу <em>premium</em> якості
          </h1>
          <p className="lead dropcap">
            CORSO — це мінімалістичний гардероб, у якому кожна річ працює з іншими. Ми створюємо колекції навколо того, що має значення:
            тканини, крою та силуету, який залишається з вами довше за один сезон.
          </p>
        </div>
      </section>

      <section className="manifesto">
        {[
          ["Тканина", "Італійська вовна і кашемір, бавовна Burberry, культова тканина дому Gucci, шовк, льон і тенсел. Те, що приховано від очей, має бути таким самим бездоганним, як і те, що зовні."],
          ["Силует", "Архітектурні плечі, скульптурні коміри, змінний об'єм. Деталі, які працюють не лише практично, а й візуально — як частина fashion-концепту."],
          ["Система", "CORSO MATCH: верхній шар, база й готовий образ, що легко поєднуються між собою. Менше випадкових покупок — більше речей, які працюють разом."],
        ].map(([t, d], i) => (
          <div key={t} className="manifesto__item" data-reveal>
            <span className="lb__no">0{i + 1}</span>
            <h2 className="h-serif">{t}</h2>
            <p className="muted">{d}</p>
          </div>
        ))}
      </section>

      <section className="quote" data-reveal>
        <blockquote>«Black, but never basic.»</blockquote>
        <p className="quote__sign">Autumn Collection by CORSO</p>
      </section>

      <section className="about__numbers">
        {[
          ["30K", "спільнота в Instagram"],
          ["1–2", "дні на відправку"],
          ["6+", "одиниць — від них діє опт"],
          ["16", "Вернадського — шоурум у Дніпрі"],
        ].map(([n, t]) => (
          <div key={t} data-reveal>
            <b>{n}</b>
            <span>{t}</span>
          </div>
        ))}
      </section>

      <section className="showroom">
        <div className="showroom__img" data-reveal>
          <Image src="/images/editorial/coffee.jpg" alt="" fill sizes="(max-width: 960px) 100vw, 50vw" />
        </div>
        <div className="showroom__text" data-reveal>
          <p className="eyebrow">Made in Ukraine</p>
          <h2 className="h-serif h-xl">
            Шиємо в Україні.
            <br />
            <em>Обираємо кращі тканини світу.</em>
          </h2>
          <p className="lead">Більшість моделей лімітовані: ми відшиваємо невеликі партії й відкриваємо передзамовлення на нові кольори.</p>
          <div className="story__links">
            <Link href="/catalog" className="btn btn--dark">
              До каталогу
            </Link>
            <Link href="/showroom" className="btn btn--line">
              Шоурум
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
