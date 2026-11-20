import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { getTr } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await getTr();
  return { title: tr("Про бренд", "About"), description: tr(site.description, site.descriptionEn) };
}

export default async function About() {
  const { tr } = await getTr();
  return (
    <div className="about">
      <section className="about__hero">
        <div className="about__img">
          <Image src="/images/editorial/hero-coat.jpg" alt={tr("CORSO — пальто максі", "CORSO — maxi coat")} fill priority sizes="(max-width: 960px) 100vw, 50vw" />
        </div>
        <div className="about__intro">
          <p className="eyebrow">About · Since 2024</p>
          <h1 className="h-title h-xl">
            {tr("Український бренд жіночого одягу", "A Ukrainian women's clothing brand of")} <em>premium</em> {tr("якості", "quality")}
          </h1>
          <p className="lead">
            {tr(
              "CORSO — це мінімалістичний гардероб, у якому кожна річ працює з іншими. Ми створюємо колекції навколо того, що має значення: тканини, крою та силуету, який залишається з вами довше за один сезон.",
              "CORSO is a minimalist wardrobe where every piece works with the others. We build collections around what matters: fabric, cut and a silhouette that stays with you longer than one season.",
            )}
          </p>
        </div>
      </section>

      <section className="manifesto">
        {[
          [
            tr("Тканина", "Fabric"),
            tr(
              "Італійська вовна і кашемір, бавовна Burberry, культова тканина дому Gucci, шовк, льон і тенсел. Те, що приховано від очей, має бути таким самим бездоганним, як і те, що зовні.",
              "Italian wool and cashmere, Burberry cotton, the cult fabric of the house of Gucci, silk, linen and tencel. What is hidden from view must be as flawless as what is on the outside.",
            ),
          ],
          [
            tr("Силует", "Silhouette"),
            tr(
              "Архітектурні плечі, скульптурні коміри, змінний об'єм. Деталі, які працюють не лише практично, а й візуально — як частина fashion-концепту.",
              "Architectural shoulders, sculptural collars, adjustable volume. Details that work not only practically but visually — as part of a fashion concept.",
            ),
          ],
          [
            tr("Система", "System"),
            tr(
              "CORSO MATCH: верхній шар, база й готовий образ, що легко поєднуються між собою. Менше випадкових покупок — більше речей, які працюють разом.",
              "CORSO MATCH: an outer layer, basics and a finished look that combine easily. Fewer random purchases — more pieces that work together.",
            ),
          ],
        ].map(([t, d], i) => (
          <div key={t} className="manifesto__item" data-reveal>
            <span className="lb__no">0{i + 1}</span>
            <h2 className="h-title">{t}</h2>
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
          ["30K", tr("спільнота в Instagram", "Instagram community")],
          ["1–2", tr("дні на відправку", "days to ship")],
          ["6+", tr("одиниць — від них діє опт", "pieces — wholesale minimum")],
          ["16", tr("Вернадського — шоурум у Дніпрі", "Vernadskoho St. — our Dnipro showroom")],
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
          <h2 className="h-title h-xl">
            {tr("Шиємо в Україні.", "Sewn in Ukraine.")}
            <br />
            <em>{tr("Обираємо кращі тканини світу.", "From the world's finest fabrics.")}</em>
          </h2>
          <p className="lead">{tr("Більшість моделей лімітовані: ми відшиваємо невеликі партії й відкриваємо передзамовлення на нові кольори.", "Most pieces are limited: we sew small batches and open pre-orders for new colours.")}</p>
          <div className="story__links">
            <Link href="/catalog" className="btn btn--dark">
              {tr("До каталогу", "Go to shop")}
            </Link>
            <Link href="/showroom" className="btn btn--line">
              {tr("Шоурум", "Showroom")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
