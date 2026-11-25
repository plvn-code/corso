import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";
import { getTr } from "@/i18n/server";
import { IconInstagram, IconPin, IconTelegram } from "@/components/Icons";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await getTr();
  return {
    title: tr("Контакти", "Contacts"),
    description: tr(
      `Контакти CORSO: магазин — ${site.city}, ${site.address}; замовлення та питання — менеджер CORSO в Telegram.`,
      `CORSO contacts: store — ${site.addressEn}, ${site.cityEn}; orders and questions — the CORSO manager on Telegram.`,
    ),
  };
}

/** «Контакти» replaced the separate «Шоурум» page (client, 2026-11-25); the store address lives under «Магазини». */
export default async function Contacts() {
  const { tr } = await getTr();
  return (
    <div className="about">
      <section className="about__hero">
        <div className="about__img">
          <Image src="/images/editorial/trench-black.jpg" alt="" fill priority sizes="(max-width: 960px) 100vw, 50vw" />
        </div>
        <div className="about__intro">
          <p className="eyebrow">Contacts</p>
          <h1 className="h-title h-xl">{tr("Контакти", "Contacts")}</h1>
          <p className="lead">
            {tr(
              "Замовлення, підбір розміру та питання — у Telegram. Приміряти колекцію можна в нашому магазині в Дніпрі.",
              "Orders, sizing help and questions — on Telegram. You can try on the collection in our store in Dnipro.",
            )}
          </p>
          <dl className="contacts">
            <dt>{tr("Магазини", "Stores")}</dt>
            <dd>
              <a href={site.maps} target="_blank" rel="noopener noreferrer">
                <IconPin width={16} height={16} /> {tr(`${site.city}, ${site.address}`, `${site.addressEn}, ${site.cityEn}`)}
              </a>
            </dd>
            <dt>{tr("Замовлення та питання", "Orders & questions")}</dt>
            <dd>
              <a href={site.manager} target="_blank" rel="noopener noreferrer">
                <IconTelegram width={16} height={16} /> {tr("Звʼязок з менеджером", "Contact our manager")}
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
