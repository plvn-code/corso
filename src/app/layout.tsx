import type { Metadata, Viewport } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { Suspense } from "react";
import { StoreProvider } from "@/lib/store";
import { Header, type SearchItem } from "@/components/Header";
import { BagDrawer } from "@/components/BagDrawer";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { products, photo, categoryName } from "@/lib/catalog";
import { site } from "@/lib/site";
import "./globals.css";

// Brand type (CORSO logo file): Open Sans for the wordmark / display, Montserrat for everything else.
const sans = Montserrat({ subsets: ["latin", "cyrillic"], weight: ["300", "400", "500", "600"], variable: "--font-sans", display: "swap" });
const display = Open_Sans({ subsets: ["latin", "cyrillic"], weight: ["300", "400"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "CORSO — український бренд жіночого одягу", template: "%s — CORSO" },
  description: site.description,
  openGraph: { title: "CORSO — Ukrainian clothing brand", description: site.description, images: ["/images/editorial/hero-burgundy.jpg"], locale: "uk_UA", type: "website" },
  robots: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover" };

const searchItems: SearchItem[] = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  line: p.line,
  image: photo(p.slug, p.colors[0].photos[0]),
  keywords: [p.name, p.line, categoryName(p.category), ...p.colors.map((c) => c.name), ...p.composition].join(" ").toLowerCase(),
}));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${sans.variable} ${display.variable}`}>
      <body>
        <StoreProvider>
          <a href="#main" className="skip">До змісту</a>
          <Header items={searchItems} />
          <main id="main">{children}</main>
          <Footer />
          <BagDrawer />
          <Suspense>
            <Reveal />
          </Suspense>
        </StoreProvider>
      </body>
    </html>
  );
}
