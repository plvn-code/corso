"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { IconHeart } from "./Icons";

export interface CardData {
  slug: string;
  name: string;
  line: string;
  price: number | null;
  tag?: string;
  colors: { name: string; hex: string; images: string[] }[];
}

export function ProductCard({ p, priority = false, sizes }: { p: CardData; priority?: boolean; sizes?: string }) {
  const { wishlist, toggleWish, ready } = useStore();
  const [ci, setCi] = useState(0);
  const [slide, setSlide] = useState(0);
  const track = useRef<HTMLAnchorElement>(null);
  const color = p.colors[ci];
  const imgs = color.images.slice(0, 4);
  const href = `/product/${p.slug}${ci ? `?color=${ci}` : ""}`;
  const wished = ready && wishlist.includes(p.slug);

  return (
    <article className="card">
      <div className="card__media">
        <Link href={href} className="card__track" ref={track} aria-label={p.name} draggable={false}
          onScroll={(e) => {
            const el = e.currentTarget;
            setSlide(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {imgs.map((src, i) => (
            <div className="card__slide" key={src}>
              <Image
                src={src}
                alt={i === 0 ? `${p.name} — ${color.name}` : ""}
                fill
                sizes={sizes ?? "(max-width: 760px) 50vw, (max-width: 1200px) 33vw, 25vw"}
                priority={priority && i === 0}
                loading={priority && i === 0 ? undefined : "lazy"}
              />
            </div>
          ))}
        </Link>
        {imgs[1] && (
          <div className="card__hover" aria-hidden>
            <Image src={imgs[1]} alt="" fill sizes="(max-width: 1200px) 33vw, 25vw" loading="lazy" />
          </div>
        )}
        {imgs.length > 1 && (
          <div className="card__bar" aria-hidden>
            <span style={{ width: `${100 / imgs.length}%`, transform: `translateX(${slide * 100}%)` }} />
          </div>
        )}
        {p.tag && <span className="card__tag">{p.tag}</span>}
        <button
          className={`card__wish${wished ? " is-on" : ""}`}
          aria-label={wished ? "Прибрати з обраного" : "Додати в обране"}
          aria-pressed={wished}
          onClick={() => toggleWish(p.slug)}
        >
          <IconHeart filled={wished} width={18} height={18} />
        </button>
      </div>
      <div className="card__info">
        <Link href={href} className="card__name">
          {p.name}
        </Link>
        <p className="card__price">{formatPrice(p.price)}</p>
        {p.colors.length > 1 && (
          <div className="card__colors" role="radiogroup" aria-label="Колір">
            {p.colors.map((c, i) => (
              <button
                key={c.name}
                role="radio"
                aria-checked={i === ci}
                aria-label={c.name}
                title={c.name}
                className={`sw${i === ci ? " is-on" : ""}`}
                style={{ "--c": c.hex } as React.CSSProperties}
                onClick={() => {
                  setCi(i);
                  setSlide(0);
                  track.current?.scrollTo({ left: 0 });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
