import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";
import { getTr } from "@/i18n/server";
import { IconInstagram, IconPin, IconTelegram } from "@/components/Icons";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await getTr();
  return {
    title: tr("Шоурум у Дніпрі", "Showroom in Dnipro"),
    description: tr(`Офлайн-примірка CORSO: ${site.city}, ${site.address}.`, `CORSO in-store fitting: ${site.addressEn}, ${site.cityEn}.`),
  };
}

export default async function Showroom() {
  const { lang, tr } = await getTr();
  return (
    <div className="about">
      <section className="about__hero">
        <div className="about__img">
          <Image src="/images/editorial/trench-black.jpg" alt="" fill priority sizes="(max-width: 960px) 100vw, 50vw" />
        </div>
        <div className="about__intro">
          <p className="eyebrow">Showroom · Dnipro</p>
          <h1 className="h-title h-xl">
            {lang === "en" ? (
              <>
                In-store <em>fitting</em>
              </>
            ) : (
              <>
                Офлайн-<em>примірка</em>
              </>
            )}
          </h1>
          <p className="lead">
            {tr(
              "Сезонні колекції CORSO представлені офлайн — приходьте відчути тканини та знайти свій ідеальний образ.",
              "The seasonal CORSO collections are on display in store — come and feel the fabrics and find your perfect look.",
            )}
          </p>
          <dl className="contacts">
            <dt>{tr("Адреса", "Address")}</dt>
            <dd>
              <IconPin width={16} height={16} /> {tr(`${site.city}, ${site.address}`, `${site.addressEn}, ${site.cityEn}`)}
            </dd>
            <dt>{tr("Замовлення та запис", "Orders & appointments")}</dt>
            <dd>
              <a href={site.manager} target="_blank" rel="noopener noreferrer">
                <IconTelegram width={16} height={16} /> {site.managerHandle}
              </a>
            </dd>
            <dt>Instagram</dt>
            <dd>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer">
                <IconInstagram width={16} height={16} /> {site.instagramHandle}
              </a>
            </dd>
            <dt>{tr("Telegram-канал", "Telegram channel")}</dt>
            <dd>
              <a href={site.telegram} target="_blank" rel="noopener noreferrer">
                t.me/emotionbrand
              </a>
            </dd>
          </dl>
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
    </div>
  );
}
