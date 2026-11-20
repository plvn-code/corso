"use client";

import { createContext, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LANG_COOKIE, makeTr, type Lang, type Tr } from "./lang";

const Ctx = createContext<Lang>("uk");

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <Ctx.Provider value={lang}>{children}</Ctx.Provider>;
}

export function useLang(): { lang: Lang; tr: Tr; setLang: (l: Lang) => void } {
  const lang = useContext(Ctx);
  const router = useRouter();
  return useMemo(
    () => ({
      lang,
      tr: makeTr(lang),
      setLang: (l: Lang) => {
        if (l === lang) return;
        document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
        document.documentElement.lang = l;
        router.refresh();
      },
    }),
    [lang, router],
  );
}
