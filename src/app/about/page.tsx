import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { getTr } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await getTr();
  return { title: tr("Про нас", "About us"), description: tr(site.description, site.descriptionEn) };
}

/** «Про нас» — text from the client (2026-11-25). */
export default async function About() {
  const { tr } = await getTr();

  const pillars = [
    {
      word: "CORSO",
      kicker: tr("це фундамент", "is the foundation"),
      text: tr(
        "Шлях, яким ми йдемо разом з тобою. Це історія про рух, естетику та ритм великого міста. Це база, на якій будується все інше — надійна, впізнавана і справжня.",
        "The path we walk together with you. A story of movement, aesthetics and the rhythm of a big city. The base everything else is built on — reliable, recognisable and real.",
      ),
    },
    {
      word: "EDIT",
      kicker: tr("це наповнення", "is the substance"),
      text: tr(
        "Найголовніше слово нашого нового етапу. Ми більше не пропонуємо «все підряд». Ми відсікаємо зайве і залишаємо лише те, що має сенс. Це кураторський підхід, де кожна річ пройшла суворий відбір за якістю та стилем.",
        "The key word of our new chapter. We no longer offer «a bit of everything». We cut the excess and keep only what makes sense. A curated approach where every piece has passed a strict selection for quality and style.",
      ),
    },
    {
      word: "CLUB",
      kicker: tr("це приналежність", "is belonging"),
      text: tr(
        "Для нас ти не просто клієнт, ти — частина спільноти. Це коло людей з ідентичним смаком і спільними цінностями. Бути в клубі — значить розуміти контекст без зайвих слів. Це простір, де «свої» впізнають «своїх» за однією деталлю.",
        "To us you are not just a client — you are part of a community. A circle of people with the same taste and shared values. Being in the club means understanding the context without extra words. A space where your own recognise each other by a single detail.",
      ),
    },
  ];

  return (
    <div className="about">
      <section className="about__hero">
        <div className="about__img">
          <Image src="/images/editorial/hero-coat.jpg" alt={tr("CORSO — пальто максі", "CORSO — maxi coat")} fill priority sizes="(max-width: 960px) 100vw, 50vw" />
        </div>
        <div className="about__intro">
          <p className="eyebrow">About · Since 2022</p>
          <h1 className="h-title h-xl">CORSO EDIT CLUB</h1>
          <p className="lead">
            {tr(
              "Український бренд одягу з історією, що почалася у 2022 році. За роки роботи ми пройшли шлях від EMOTION до CORSO — зберігши досвід, майстерність і любов до своєї справи, але відкривши нову сторінку в історії бренду.",
              "A Ukrainian clothing brand whose story began in 2022. Over the years we have gone from EMOTION to CORSO — keeping our experience, craftsmanship and love for what we do, while opening a new chapter in the brand's story.",
            )}
          </p>
          <p className="muted">
            {tr(
              "У 2025 році ми провели ребрендинг, сформувавши нову естетику та філософію CORSO — сучасну, впевнену й позачасову.",
              "In 2025 we rebranded, shaping a new CORSO aesthetic and philosophy — modern, confident and timeless.",
            )}
          </p>
        </div>
      </section>

      <section className="about__text narrow" data-reveal>
        <p>
          {tr(
            "В основі нашого підходу — власне виробництво у місті Дніпро та безкомпромісний вибір матеріалів.",
            "At the heart of our approach is our own production in Dnipro and an uncompromising choice of materials.",
          )}
        </p>
        <p>
          {tr(
            "Ми працюємо виключно з преміальними італійськими тканинами, приділяючи особливу увагу їхній якості, фактурі та досконалості в кожній деталі.",
            "We work exclusively with premium Italian fabrics, paying special attention to their quality, texture and perfection in every detail.",
          )}
        </p>
        <p>
          {tr(
            "Для нас одяг — це більше, ніж тренди. Це культура стилю, відчуття себе та увага до деталей, які залишаються актуальними поза часом.",
            "To us clothing is more than trends. It is a culture of style, a sense of self and attention to details that stay relevant beyond time.",
          )}
        </p>
      </section>

      <section className="quote" data-reveal>
        <blockquote>
          {tr(
            "CORSO EDIT CLUB — створюємо речі, які говорять про вас без зайвих слів.",
            "CORSO EDIT CLUB — we create pieces that speak for you without extra words.",
          )}
        </blockquote>
      </section>

      <section className="manifesto">
        {pillars.map((p, i) => (
          <div key={p.word} className="manifesto__item" data-reveal>
            <span className="lb__no">0{i + 1}</span>
            <h2 className="h-title">
              {p.word} <em>— {p.kicker}</em>
            </h2>
            <p className="muted">{p.text}</p>
          </div>
        ))}
      </section>

      <section className="about__numbers">
        {[
          ["2022", tr("початок історії бренду", "the brand's story begins")],
          ["2025", tr("ребрендинг: від EMOTION до CORSO", "rebrand: from EMOTION to CORSO")],
          [tr("Дніпро", "Dnipro"), tr("власне виробництво", "our own production")],
          ["30K", tr("спільнота в Instagram", "Instagram community")],
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
            {tr("Власне виробництво.", "Our own production.")}
            <br />
            <em>{tr("Преміальні італійські тканини.", "Premium Italian fabrics.")}</em>
          </h2>
          <div className="story__links">
            <Link href="/catalog" className="btn btn--dark">
              {tr("До каталогу", "Go to shop")}
            </Link>
            <Link href="/contacts" className="btn btn--line">
              {tr("Контакти", "Contacts")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
