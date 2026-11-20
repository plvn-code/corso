import type { Metadata } from "next";
import { getTr } from "@/i18n/server";
import { formatPrice } from "@/lib/format";
import { GIFT_MIN } from "@/lib/gift";
import { GiftForm } from "./GiftForm";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await getTr();
  return {
    title: tr("Подарунковий сертифікат", "Gift certificate"),
    description: tr(
      `Подарунковий сертифікат CORSO від ${GIFT_MIN} грн — надішліть другу на e-mail з вашим привітанням.`,
      `CORSO gift certificate from ${GIFT_MIN} UAH — send it to a friend by e-mail with your greeting.`,
    ),
  };
}

export default async function GiftPage() {
  const { tr } = await getTr();
  const min = formatPrice(GIFT_MIN);

  // Terms: draft based on the brief — confirm with the client (docs/STATUS.md).
  const terms = [
    tr("Сертифікат діє на всі товари CORSO — на сайті та в шоурумі у Дніпрі.", "Valid for all CORSO pieces — online and at our showroom in Dnipro."),
    tr(`Номінал — від ${min}, сума обирається при покупці.`, `Amount — from ${min}, chosen at purchase.`),
    tr("Сертифікат надсилається отримувачу на e-mail лише після повної оплати.", "The certificate is e-mailed to the recipient only after full payment."),
    tr("Термін дії — 12 місяців з дня покупки.", "Valid for 12 months from the date of purchase."),
    tr("Якщо покупка дорожча за номінал — різницю можна доплатити.", "If the purchase costs more than the certificate, you can pay the difference."),
    tr("Сертифікат не обмінюється на гроші та не підлягає поверненню.", "The certificate cannot be exchanged for cash or refunded."),
    tr(
      "Щоб скористатися, вкажіть номер сертифіката в коментарі до замовлення або покажіть його в шоурумі.",
      "To use it, add the certificate number to your order notes or show it at the showroom.",
    ),
  ];

  return (
    <div className="gift-page">
      <header className="page-head">
        <p className="eyebrow">Gift certificate</p>
        <h1 className="h-title h-xl">{tr("Подарунковий сертифікат", "Gift certificate")}</h1>
        <p className="muted gift-page__lead">
          {tr(
            `Подаруйте другові свободу вибору: сертифікат CORSO від ${min} з вашим привітанням прийде йому на e-mail.`,
            `Give a friend the freedom to choose: a CORSO certificate from ${min} with your greeting, delivered by e-mail.`,
          )}
        </p>
      </header>

      <GiftForm />

      <section className="gift-how" aria-label={tr("Як це працює", "How it works")}>
        {[
          [tr("Оберіть суму", "Choose the amount"), tr(`Від ${min} — готові номінали або своя сума.`, `From ${min} — a preset or your own amount.`)],
          [tr("Вкажіть, кому", "Say who it's for"), tr("Імʼя та e-mail друга, ваше привітання й дату.", "Your friend's name and e-mail, your greeting and the date.")],
          [tr("Оплатіть", "Pay"), tr("Карткою, Apple Pay або Google Pay — онлайн.", "By card, Apple Pay or Google Pay — online.")],
          [tr("Друг отримує подарунок", "Your friend gets the gift"), tr("Лист із сертифікатом і вашим привітанням.", "An e-mail with the certificate and your greeting.")],
        ].map(([t, d], i) => (
          <div key={t} className="perk" data-reveal>
            <span className="perk__n">0{i + 1}</span>
            <p className="perk__t">{t}</p>
            <p className="muted small">{d}</p>
          </div>
        ))}
      </section>

      <section className="gift-terms narrow" id="terms">
        <p className="eyebrow">Terms</p>
        <h2 className="h-title">{tr("Умови використання", "Terms of use")}</h2>
        <ul className="dash">
          {terms.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
