/** Site languages: Ukrainian (default) and English. The choice lives in a cookie. */
export type Lang = "uk" | "en";
export const LANGS: Lang[] = ["uk", "en"];
export const LANG_COOKIE = "corso_lang";
export const isLang = (v: unknown): v is Lang => v === "uk" || v === "en";

/** Inline translation: tr("Новинки", "New in"). Keeps both texts side by side in the code. */
export type Tr = (uk: string, en: string) => string;
export const makeTr =
  (lang: Lang): Tr =>
  (uk, en) =>
    lang === "en" ? en : uk;

/** Locale for numbers/dates. */
export const locale = (lang: Lang) => (lang === "en" ? "en-GB" : "uk-UA");
