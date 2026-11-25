"use client";

import { useState } from "react";
import { useLang } from "@/i18n/client";

/**
 * Phones: the home page stops after the quote with a «Дивитись далі» button; the lifestyle
 * sections (Deep Navy, bestsellers, fabrics, summer, store, perks, Instagram) open on tap (client, 2026-11-25).
 * Desktop always shows everything.
 */
export function HomeMore({ children }: { children: React.ReactNode }) {
  const { tr } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <div className={`home-more${open ? " is-open" : ""}`}>
      {!open && (
        <div className="home-more__cta">
          <button type="button" className="btn btn--line" onClick={() => setOpen(true)} aria-expanded={open}>
            {tr("Дивитись далі", "See more")}
          </button>
        </div>
      )}
      <div className="home-more__body">{children}</div>
    </div>
  );
}
