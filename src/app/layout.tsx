import type { Metadata, Viewport } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { Suspense } from "react";
import { StoreProvider } from "@/lib/store";
import { Header, type SearchItem } from "@/components/Header";
import { BagDrawer } from "@/components/BagDrawer";
import { WelcomePopup } from "@/components/WelcomePopup";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { products, photo, categoryName, localize } from "@/lib/catalog";
import { getLang } from "@/i18n/server";
import { LangProvider } from "@/i18n/client";
import type { Lang } from "@/i18n/lang";
import { site } from "@/lib/site";
import "./globals.css";

// Brand type (CORSO logo file): Open Sans for the wordmark / display, Montserrat for everything else.
const sans = Montserrat({ subsets: ["latin", "cyrillic"], weight: ["300", "400", "500", "600"], variable: "--font-sans", display: "swap" });
const display = Open_Sans({ subsets: ["latin", "cyrillic"], weight: ["300", "400"], variable: "--font-display", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const en = (await getLang()) === "en";
  const description = en ? site.descriptionEn : site.description;
  return {
    metadataBase: new URL(site.url),
    title: { default: en ? "CORSO — Ukrainian women's clothing brand" : "CORSO — український бренд жіночого одягу", template: "%s — CORSO" },
    description,
    openGraph: { title: "CORSO Edit Club", description, images: ["/images/editorial/hero-burgundy.jpg"], locale: en ? "en_GB" : "uk_UA", type: "website" },
    robots: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" ? undefined : { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover" };

/** Search index: shown in the current language, matches both languages. */
const searchItems = (lang: Lang): SearchItem[] =>
  products.map((p) => {
    const en = localize(p, "en");
    const cur = lang === "en" ? en : p;
    return {
      slug: p.slug,
      name: cur.name,
      line: p.line,
      image: photo(p.slug, p.colors[0].photos[0]),
      keywords: [p.name, en.name, p.line, categoryName(p.category), categoryName(p.category, "en"), ...p.colors.map((c) => c.name), ...p.composition, ...en.composition]
        .join(" ")
        .toLowerCase(),
    };
  });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`${sans.variable} ${display.variable}`}>
      <body>
        <LangProvider lang={lang}>
        <StoreProvider>
          <a href="#main" className="skip">{lang === "en" ? "Skip to content" : "До змісту"}</a>
          <Header items={searchItems(lang)} />
          <main id="main">{children}</main>
          <Footer />
          <BagDrawer />
          <WelcomePopup />
          <Suspense>
            <Reveal />
          </Suspense>
        </StoreProvider>
        </LangProvider>
      </body>
    </html>
  );
}
