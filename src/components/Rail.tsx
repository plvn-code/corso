"use client";

import { useLang } from "@/i18n/client";
import { useRef } from "react";
import { IconArrow, IconBack } from "./Icons";

/** Horizontal scroll-snap rail with desktop arrows. */
export function Rail({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { tr } = useLang();
  const go = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="rail">
      <div className="rail__track" ref={ref} role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
      <div className="rail__nav">
        <button className="icon-btn" aria-label={tr("Назад", "Previous")} onClick={() => go(-1)}>
          <IconBack />
        </button>
        <button className="icon-btn" aria-label={tr("Далі", "Next")} onClick={() => go(1)}>
          <IconArrow />
        </button>
      </div>
    </div>
  );
}
