import type { Metadata } from "next";
import { getTr } from "@/i18n/server";
import { CartView } from "./CartView";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await getTr();
  return { title: tr("Кошик", "Shopping bag") };
}

export default function CartPage() {
  return <CartView />;
}
