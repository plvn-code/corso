import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";
import { IconInstagram, IconPin, IconTelegram } from "@/components/Icons";

export const metadata: Metadata = { title: "Шоурум у Дніпрі", description: `Офлайн-примірка CORSO: ${site.city}, ${site.address}.` };

export default function Showroom() {
  return (
    <div className="about">
      <section className="about__hero">
        <div className="about__img">
          <Image src="/images/editorial/trench-black.jpg" alt="" fill priority sizes="(max-width: 960px) 100vw, 50vw" />
        </div>
        <div className="about__intro">
          <p className="eyebrow">Showroom · Dnipro</p>
          <h1 className="h-title h-xl">
            Офлайн-<em>примірка</em>
          </h1>
          <p className="lead">Сезонні колекції CORSO представлені офлайн — приходьте відчути тканини та знайти свій ідеальний образ.</p>
          <dl className="contacts">
            <dt>Адреса</dt>
            <dd>
              <IconPin width={16} height={16} /> {site.city}, {site.address}
            </dd>
            <dt>Замовлення та запис</dt>
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
            <dt>Telegram-канал</dt>
            <dd>
              <a href={site.telegram} target="_blank" rel="noopener noreferrer">
                t.me/emotionbrand
              </a>
            </dd>
          </dl>
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
    </div>
  );
}
