"use client";

import { useLang } from "@/i18n/client";
import { LANGS } from "@/i18n/lang";

const LABEL = { uk: "Укр", en: "Eng" } as const;

/** УКР / ENG switch (menu bottom, footer). */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, tr } = useLang();
  return (
    <div className={`lang ${className}`} role="group" aria-label={tr("Мова сайту", "Site language")}>
      {LANGS.map((l, i) => (
        <span key={l} className="lang__item">
          {i > 0 && <i aria-hidden>/</i>}
          <button type="button" className={l === lang ? "is-on" : ""} aria-pressed={l === lang} lang={l} onClick={() => setLang(l)}>
            {LABEL[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
