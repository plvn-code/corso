"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Magazine-cover hero: one photo on phones, a pair side by side from 760px. */
const SLIDES = [
  {
    imgs: [
      { src: "/images/editorial/hero-burgundy.jpg", pos: "50% 35%" },
      { src: "/images/editorial/hero-coat.jpg", pos: "50% 30%" },
    ],
    kicker: "Noir Shell · Glossy Burgundy",
    title: "Зима в прочитанні CORSO",
    href: "/catalog?c=puhovyky",
  },
  {
    imgs: [
      { src: "/images/editorial/hero-shirt.jpg", pos: "50% 20%" },
      { src: "/images/editorial/hero-navy.jpg", pos: "50% 25%" },
    ],
    kicker: "Basic Collection · Deep Blue",
    title: "Архітектура силуету",
    href: "/catalog?c=new",
  },
  {
    imgs: [
      { src: "/images/editorial/camel-shirt.jpg", pos: "50% 20%" },
      { src: "/images/editorial/puffer-burgundy.jpg", pos: "50% 30%" },
    ],
    kicker: "Camel · Burgundy",
    title: "Колір, що пасує внутрішньому стану",
    href: "/catalog?col=fw26",
  },
];

export function HeroCover() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 6500);
    return () => clearInterval(t);
  }, [i]);
  const s = SLIDES[i];
  return (
    <section className="cover" aria-label="CORSO — осінь-зима 26/27">
      {SLIDES.map((sl, k) => (
        <div key={k} className={`cover__img${k === i ? " is-on" : ""}`} aria-hidden={k !== i}>
          {sl.imgs.map((im, j) => (
            <div className="cover__pane" key={im.src}>
              <Image
                src={im.src}
                alt=""
                fill
                priority={k === 0}
                sizes={j === 0 ? "(max-width: 760px) 100vw, 50vw" : "50vw"}
                quality={90}
                style={{ objectPosition: im.pos }}
              />
            </div>
          ))}
        </div>
      ))}
      <div className="cover__shade" aria-hidden />
      <div className="cover__issue" aria-hidden>
        <span>Edit Club</span>
        <span>Fall Winter 26/27</span>
        <span>Made in Ukraine</span>
      </div>
      <div className="cover__lines">
        <p className="cover__kicker" key={`k${i}`}>
          {s.kicker}
        </p>
        <Link href={s.href} className="cover__title" key={`t${i}`}>
          {s.title}
        </Link>
      </div>
      <h1 className="cover__mast">CORSO</h1>
      <div className="cover__foot">
        <Link href="/catalog?col=fw26" className="ulink">
          Дивитись колекцію
        </Link>
        <div className="cover__dots" role="tablist" aria-label="Слайди">
          {SLIDES.map((sl, k) => (
            <button
              key={k}
              role="tab"
              aria-selected={k === i}
              aria-label={`Слайд ${k + 1}`}
              onClick={() => setI(k)}
              className={k === i ? "is-on" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
