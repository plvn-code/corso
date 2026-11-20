import Image from "next/image";
import Link from "next/link";
import { HeroCover } from "@/components/HeroCover";
import { ProductCard } from "@/components/ProductCard";
import { Rail } from "@/components/Rail";
import { getProduct, products, toCard } from "@/lib/catalog";
import { site } from "@/lib/site";
import { IconArrow, IconInstagram, IconPin, IconTelegram } from "@/components/Icons";

const pick = (slugs: string[]) => slugs.map((s) => getProduct(s)!).filter(Boolean).map(toCard);

const NEW_IN = pick(["noir-shell-cropped", "palto-cashmere", "sorochka-vuzol", "set-anorak-winter", "leather-jacket", "noir-shell", "palto-deep-blue", "noir-shell-midi"]);
const BEST = products.filter((p) => p.tags.includes("bestseller")).map(toCard);
const SUMMER = products.filter((p) => p.collection === "ss26").slice(0, 8).map(toCard);

const TILES = [
  { src: "/images/editorial/puffers-duo.jpg", kicker: "Fall Winter 26/27", title: "Пуховики", href: "/catalog?c=puhovyky", pos: "50% 20%" },
  { src: "/images/editorial/grey-coat.jpg", kicker: "A Coat That Stays", title: "Пальта і тренчі", href: "/catalog?c=palta", pos: "50% 30%" },
  { src: "/images/editorial/burgundy-set.jpg", kicker: "Burgundy · Black · Milk", title: "Шкіряна лінійка", href: "/catalog?c=shkira", pos: "50% 30%" },
  { src: "/images/editorial/cult-ecru.jpg", kicker: "The Cult Set", title: "Сети і костюми", href: "/catalog?c=sety", pos: "50% 35%" },
];

const INSTA = ["hero-burgundy", "trench-black", "denim-horse", "burgundy-set", "camel-shirt", "noir-shell"];

export default function Home() {
  return (
    <>
      <HeroCover />

      <div className="ticker" aria-hidden>
        <div className="ticker__in">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              Made in Ukraine <i>✦</i> Minimalist Wardrobe <i>✦</i> Italian Fabrics <i>✦</i> Офлайн-примірка в Дніпрі <i>✦</i> Edit Club
              <i>✦</i>{" "}
            </span>
          ))}
        </div>
      </div>

      <section className="sec">
        <header className="sec__head" data-reveal>
          <p className="eyebrow">New In</p>
          <h2 className="h-title">Новинки сезону</h2>
          <Link href="/catalog?c=new" className="ulink">
            Дивитись усі
          </Link>
        </header>
        <div className="grid grid--home">
          {NEW_IN.map((p, i) => (
            <div key={p.slug} data-reveal style={{ "--d": `${(i % 4) * 70}ms` } as React.CSSProperties}>
              <ProductCard p={p} priority={i < 2} />
            </div>
          ))}
        </div>
      </section>

      <section className="tiles" aria-label="Категорії">
        {TILES.map((t, i) => (
          <Link key={t.href} href={t.href} className="tile" data-reveal>
            <Image src={t.src} alt={t.title} fill sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 25vw" style={{ objectPosition: t.pos }} quality={85} />
            <span className="tile__num">{String(i + 1).padStart(2, "0")}</span>
            <span className="tile__cap">
              <span className="eyebrow">{t.kicker}</span>
              <span className="tile__title">{t.title}</span>
              <span className="ulink">Дивитись</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="quote" data-reveal>
        <p className="eyebrow">Winter, the CORSO way</p>
        <blockquote>
          «Справжня цінність одягу виходить за межі одного сезону. Саме тому ми створюємо колекцію навколо того, що має значення.»
        </blockquote>
        <p className="quote__sign">CORSO · Edit Club</p>
      </section>

      <section className="story">
        <div className="story__media" data-reveal>
          <Image src="/images/editorial/navy-skirt.jpg" alt="Сет Deep Navy: бомбер і спідниця міді" fill sizes="(max-width: 960px) 100vw, 55vw" quality={90} />
        </div>
        <div className="story__text" data-reveal>
          <p className="eyebrow">The Edit Nº 01</p>
          <h2 className="h-title h-xl">
            Deep <em>Navy</em>
          </h2>
          <p className="lead">
            Глибокий, аристократичний і стриманий. Він має ту саму універсальність, що й чорний, але виглядає складніше та цікавіше.
          </p>
          <p className="muted">
            У монохромі — інтелектуально, з денімом — невимушено, зі світлими відтінками — особливо аристократично. Новий колір
            осінньої колекції CORSO: сет бомбер + спідниця міді, утеплений костюм-анорак і пальто.
          </p>
          <div className="story__links">
            <Link href="/product/set-navy-bomber-skirt" className="btn btn--dark">
              Сет бомбер + спідниця
            </Link>
            <Link href="/product/set-anorak-winter" className="btn btn--line">
              Костюм-анорак
            </Link>
          </div>
          <div className="story__small">
            <Image src="/images/editorial/navy-flatlay.jpg" alt="" width={360} height={640} sizes="40vw" />
          </div>
        </div>
      </section>

      <section className="sec sec--grey">
        <header className="sec__head" data-reveal>
          <p className="eyebrow">Bestsellers</p>
          <h2 className="h-title">Моделі, до яких повертаються</h2>
          <Link href="/catalog?c=bestseller" className="ulink">
            Усі бестселери
          </Link>
        </header>
        <Rail label="Бестселери">
          {BEST.map((p) => (
            <div key={p.slug} className="rail__item">
              <ProductCard p={p} sizes="(max-width: 760px) 70vw, 25vw" />
            </div>
          ))}
        </Rail>
      </section>

      <section className="fabric">
        <div className="fabric__grid">
          <div className="fabric__img" data-reveal>
            <Image src="/images/editorial/navy-cuff.jpg" alt="Пальто Deep Blue — деталь" fill sizes="(max-width: 960px) 50vw, 33vw" />
          </div>
          <div className="fabric__img fabric__img--b" data-reveal>
            <Image src="/images/editorial/navy-coat-bag.jpg" alt="Фактура тканини" fill sizes="(max-width: 960px) 50vw, 33vw" />
          </div>
          <div className="fabric__text" data-reveal>
            <p className="eyebrow">Fabric first</p>
            <h2 className="h-title">Тканини, які відчуваєш шкірою</h2>
            <ul className="facts">
              <li>
                <b>50/45</b>
                <span>первинна вовна і кашемір у пальті максі — італійська тканина YSL</span>
              </li>
              <li>
                <b>100%</b>
                <span>бавовна Burberry у культовому бомбері та парці</span>
              </li>
              <li>
                <b>2 шари</b>
                <span>тканина дому Gucci + бавовняний підклад у теплих сорочках</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="sec">
        <header className="sec__head" data-reveal>
          <p className="eyebrow">Summer 26 · Archive</p>
          <h2 className="h-title">Льон, сатин, тенсел</h2>
          <Link href="/catalog?col=ss26" className="ulink">
            Літня колекція
          </Link>
        </header>
        <Rail label="Літня колекція">
          {SUMMER.map((p) => (
            <div key={p.slug} className="rail__item">
              <ProductCard p={p} sizes="(max-width: 760px) 70vw, 25vw" />
            </div>
          ))}
        </Rail>
      </section>

      <section className="showroom">
        <div className="showroom__img" data-reveal>
          <Image src="/images/editorial/trench-beige.jpg" alt="Тренч Light Beige" fill sizes="(max-width: 960px) 100vw, 50vw" />
        </div>
        <div className="showroom__text" data-reveal>
          <p className="eyebrow">Showroom · Dnipro</p>
          <h2 className="h-title h-xl">
            Офлайн-<em>примірка</em>
          </h2>
          <p className="lead">Сезонні колекції CORSO представлені в шоурумі — приходьте відчути тканини та знайти свій ідеальний образ.</p>
          <p className="showroom__addr">
            <IconPin width={18} height={18} /> {site.city}, {site.address}
          </p>
          <div className="story__links">
            <a href={site.maps} target="_blank" rel="noopener noreferrer" className="btn btn--dark">
              Прокласти маршрут
            </a>
            <a href={site.manager} target="_blank" rel="noopener noreferrer" className="btn btn--line">
              Записатися на примірку
            </a>
          </div>
        </div>
      </section>

      <section className="perks" aria-label="Переваги">
        {[
          ["01", "Італійські тканини", "Вовна, кашемір, бавовна Burberry, шовк і льон преміальної якості"],
          ["02", "Відправка за 1–2 дні", "Новою поштою по всій Україні, самовивіз у Дніпрі"],
          ["03", "Обмін розміру", "Підберемо іншу посадку, якщо модель не підійшла"],
          ["04", "Особистий стиліст", "Менеджер допоможе з розміром і підбором образу"],
        ].map(([n, t, d]) => (
          <div key={n} className="perk" data-reveal>
            <span className="perk__n">{n}</span>
            <p className="perk__t">{t}</p>
            <p className="muted small">{d}</p>
          </div>
        ))}
      </section>

      <section className="insta">
        <header className="sec__head" data-reveal>
          <p className="eyebrow">{site.instagramHandle} · 30K</p>
          <h2 className="h-title">CORSO у вашій стрічці</h2>
        </header>
        <div className="insta__grid">
          {INSTA.map((n) => (
            <a key={n} href={site.instagram} target="_blank" rel="noopener noreferrer" className="insta__item" aria-label="Instagram CORSO" data-reveal>
              <Image src={`/images/editorial/${n}.jpg`} alt="" fill sizes="(max-width: 760px) 33vw, 16vw" />
            </a>
          ))}
        </div>
        <div className="insta__links">
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn--line">
            <IconInstagram width={18} height={18} /> Instagram
          </a>
          <a href={site.telegram} target="_blank" rel="noopener noreferrer" className="btn btn--line">
            <IconTelegram width={18} height={18} /> Telegram
          </a>
          <Link href="/lookbook" className="btn btn--dark">
            Лукбук <IconArrow width={18} height={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
