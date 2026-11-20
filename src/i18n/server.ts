import "server-only";
import { cookies } from "next/headers";
import { isLang, LANG_COOKIE, makeTr, type Lang } from "./lang";

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(v) ? v : "uk";
}

export async function getTr() {
  const lang = await getLang();
  return { lang, tr: makeTr(lang) };
}
