import Image from "next/image";
import Link from "next/link";
import { HeroCover } from "@/components/HeroCover";
import { HomeMore } from "@/components/HomeMore";
import { ProductCard } from "@/components/ProductCard";
import { Rail } from "@/components/Rail";
import { getProduct, localize, products, toCard } from "@/lib/catalog";
import { getTr } from "@/i18n/server";
import type { Lang } from "@/i18n/lang";
import { site } from "@/lib/site";
import { IconArrow, IconInstagram, IconPin, IconTelegram } from "@/components/Icons";

const NEW_IN_SLUGS = ["noir-shell-cropped", "palto-cashmere", "sorochka-vuzol", "set-anorak-winter", "leather-jacket", "noir-shell", "palto-deep-blue", "noir-shell-midi"];
const cards = (lang: Lang) => ({
  newIn: NEW_IN_SLUGS.map((s) => getProduct(s, lang)!).filter(Boolean).map(toCard),
  best: products.filter((p) => p.tags.includes("bestseller")).map((p) => toCard(localize(p, lang))),
  summer: products.filter((p) => p.collection === "ss26").slice(0, 8).map((p) => toCard(localize(p, lang))),
});

const TILES = [
  { src: "/images/editorial/puffers-duo.jpg", kicker: "Fall Winter 26/27", uk: "Пуховики", en: "Puffers", href: "/catalog?c=puhovyky", pos: "50% 20%" },
  { src: "/images/editorial/grey-coat.jpg", kicker: "A Coat That Stays", uk: "Пальта і тренчі", en: "Coats & trenches", href: "/catalog?c=palta", pos: "50% 30%" },
  { src: "/images/editorial/burgundy-set.jpg", kicker: "Burgundy · Black · Milk", uk: "Шкіряна лінійка", en: "Leather line", href: "/catalog?c=shkira", pos: "50% 30%" },
  { src: "/images/editorial/cult-ecru.jpg", kicker: "The Cult Set", uk: "Сети і костюми", en: "Sets", href: "/catalog?c=sety", pos: "50% 35%" },
];

const INSTA = ["hero-burgundy", "trench-black", "denim-horse", "burgundy-set", "camel-shirt", "noir-shell"];

export default async function Home() {
  const { lang, tr } = await getTr();
  const { newIn: NEW_IN, best: BEST, summer: SUMMER } = cards(lang);
  return (
    <>
      <HeroCover />

      <div className="ticker" aria-hidden>
        <div className="ticker__in">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              Made in Ukraine <i>✦</i> Minimalist Wardrobe <i>✦</i> Italian Fabrics <i>✦</i> {tr("Офлайн-примірка в Дніпрі", "Store in Dnipro")} <i>✦</i> Edit Club
              <i>✦</i>{" "}
            </span>
          ))}
        </div>
      </div>

      <section className="sec">
        <header className="sec__head" data-reveal>
          <p className="eyebrow">New In</p>
          <h2 className="h-title">{tr("Новинки сезону", "New this season")}</h2>
          <Link href="/catalog?c=new" className="ulink">
            {tr("Дивитись усі", "View all")}
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

      <section className="tiles" aria-label={tr("Категорії", "Categories")}>
        {TILES.map((t, i) => (
          <Link key={t.href} href={t.href} className="tile" data-reveal>
            <Image src={t.src} alt={t[lang]} fill sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 25vw" style={{ objectPosition: t.pos }} quality={85} />
            <span className="tile__num">{String(i + 1).padStart(2, "0")}</span>
            <span className="tile__cap">
              <span className="eyebrow">{t.kicker}</span>
              <span className="tile__title">{t[lang]}</span>
              <span className="ulink">{tr("Дивитись", "Shop now")}</span>
            </span>
          </Link>
        ))}
      </section>

      <section className="quote" data-reveal>
        <p className="eyebrow">Winter, the CORSO way</p>
        <blockquote>
          {tr(
            "«Справжня цінність одягу виходить за межі одного сезону. Саме тому ми створюємо колекцію навколо того, що має значення.»",
            "“The true value of clothing reaches beyond a single season. That is why we build the collection around what matters.”",
          )}
        </blockquote>
        <p className="quote__sign">CORSO · Edit Club</p>
      </section>

      <HomeMore>

      <section className="story">
        <div className="story__media" data-reveal>
          <Image src="/images/editorial/navy-skirt.jpg" alt={tr("Сет Deep Navy: бомбер і спідниця міді", "Deep Navy set: bomber and midi skirt")} fill sizes="(max-width: 960px) 100vw, 55vw" quality={90} />
        </div>
        <div className="story__text" data-reveal>
          <p className="eyebrow">The Edit Nº 01</p>
          <h2 className="h-title h-xl">
            Deep <em>Navy</em>
          </h2>
          <p className="lead">
            {tr(
              "Глибокий, аристократичний і стриманий. Він має ту саму універсальність, що й чорний, але виглядає складніше та цікавіше.",
              "Deep, aristocratic and restrained. It is as versatile as black, yet looks more complex and more interesting.",
            )}
          </p>
          <p className="muted">
            {tr(
              "У монохромі — інтелектуально, з денімом — невимушено, зі світлими відтінками — особливо аристократично. Новий колір осінньої колекції CORSO: сет бомбер + спідниця міді, утеплений костюм-анорак і пальто.",
              "In monochrome — intellectual, with denim — effortless, with light shades — especially aristocratic. The new colour of the CORSO autumn collection: a bomber + midi skirt set, an insulated anorak set and a coat.",
            )}
          </p>
          <div className="story__links">
            <Link href="/product/set-navy-bomber-skirt" className="btn btn--dark">
              {tr("Сет бомбер + спідниця", "Bomber + skirt set")}
            </Link>
            <Link href="/product/set-anorak-winter" className="btn btn--line">
              {tr("Костюм-анорак", "Anorak set")}
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
          <h2 className="h-title">{tr("Моделі, до яких повертаються", "Pieces they come back for")}</h2>
          <Link href="/catalog?c=bestseller" className="ulink">
            {tr("Усі бестселери", "All bestsellers")}
          </Link>
        </header>
        <Rail label={tr("Бестселери", "Bestsellers")}>
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
            <Image src="/images/editorial/navy-cuff.jpg" alt={tr("Пальто Deep Blue — деталь", "Deep Blue coat — detail")} fill sizes="(max-width: 960px) 50vw, 33vw" />
          </div>
          <div className="fabric__img fabric__img--b" data-reveal>
            <Image src="/images/editorial/navy-coat-bag.jpg" alt={tr("Фактура тканини", "Fabric texture")} fill sizes="(max-width: 960px) 50vw, 33vw" />
          </div>
          <div className="fabric__text" data-reveal>
            <p className="eyebrow">Fabric first</p>
            <h2 className="h-title">{tr("Тканини, які відчуваєш шкірою", "Fabrics you feel on your skin")}</h2>
            <ul className="facts">
              <li>
                <b>50/45</b>
                <span>{tr("первинна вовна і кашемір у пальті максі — італійська тканина YSL", "virgin wool and cashmere in the maxi coat — Italian YSL fabric")}</span>
              </li>
              <li>
                <b>100%</b>
                <span>{tr("бавовна Burberry у культовому бомбері та парці", "Burberry cotton in the cult bomber and parka")}</span>
              </li>
              <li>
                <b>{tr("2 шари", "2 layers")}</b>
                <span>{tr("тканина дому Gucci + бавовняний підклад у теплих сорочках", "Gucci house fabric + cotton lining in the warm shirts")}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="sec">
        <header className="sec__head" data-reveal>
          <p className="eyebrow">Summer 26 · Archive</p>
          <h2 className="h-title">{tr("Льон, сатин, тенсел", "Linen, satin, tencel")}</h2>
          <Link href="/catalog?col=ss26" className="ulink">
            {tr("Літня колекція", "Summer collection")}
          </Link>
        </header>
        <Rail label={tr("Літня колекція", "Summer collection")}>
          {SUMMER.map((p) => (
            <div key={p.slug} className="rail__item">
              <ProductCard p={p} sizes="(max-width: 760px) 70vw, 25vw" />
            </div>
          ))}
        </Rail>
      </section>

      <section className="showroom">
        <div className="showroom__img" data-reveal>
          <Image src="/images/editorial/trench-beige.jpg" alt={tr("Тренч Light Beige", "Light Beige trench coat")} fill sizes="(max-width: 960px) 100vw, 50vw" />
        </div>
        <div className="showroom__text" data-reveal>
          <p className="eyebrow">Store · Dnipro</p>
          <h2 className="h-title h-xl">
            {lang === "en" ? (
              <>
                In-store <em>fitting</em>
              </>
            ) : (
              <>
                Офлайн-<em>примірка</em>
              </>
            )}
          </h2>
          <p className="lead">
            {tr(
              "Сезонні колекції CORSO представлені в нашому магазині — приходьте відчути тканини та знайти свій ідеальний образ.",
              "The seasonal CORSO collections are in our store — come and feel the fabrics and find your perfect look.",
            )}
          </p>
          <p className="showroom__addr">
            <IconPin width={18} height={18} /> {tr(`${site.city}, ${site.address}`, `${site.addressEn}, ${site.cityEn}`)}
          </p>
          <div className="story__links">
            <a href={site.maps} target="_blank" rel="noopener noreferrer" className="btn btn--dark">
              {tr("Прокласти маршрут", "Get directions")}
            </a>
            <a href={site.manager} target="_blank" rel="noopener noreferrer" className="btn btn--line">
              {tr("Записатися на примірку", "Book a fitting")}
            </a>
          </div>
        </div>
      </section>

      <section className="perks" aria-label={tr("Переваги", "Why CORSO")}>
        {[
          ["01", tr("Італійські тканини", "Italian fabrics"), tr("Вовна, кашемір, бавовна Burberry, шовк і льон преміальної якості", "Premium wool, cashmere, Burberry cotton, silk and linen")],
          ["02", tr("Відправка за 1–2 дні", "Shipping in 1–2 days"), tr("Новою поштою по всій Україні, самовивіз у Дніпрі", "Nova Poshta across Ukraine, pickup in Dnipro")],
          ["03", tr("Обмін розміру", "Size exchange"), tr("Підберемо іншу посадку, якщо модель не підійшла", "We will find another fit if the piece doesn't suit you")],
          ["04", tr("Особистий стиліст", "Personal stylist"), tr("Менеджер допоможе з розміром і підбором образу", "Our manager will help with the size and the look")],
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
          <h2 className="h-title">{tr("CORSO у вашій стрічці", "CORSO in your feed")}</h2>
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
            {tr("Лукбук", "Lookbook")} <IconArrow width={18} height={18} />
          </Link>
        </div>
      </section>
      </HomeMore>
    </>
  );
}
