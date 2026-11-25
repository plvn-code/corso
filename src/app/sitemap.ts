import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/catalog", "/lookbook", "/about", "/contacts", "/gift-certificate"].map((p) => ({ url: `${site.url}${p}` }));
  return [...pages, ...products.map((p) => ({ url: `${site.url}/product/${p.slug}` }))];
}
