import type { Metadata } from "next";
import { getTr } from "@/i18n/server";
import { CheckoutForm } from "./CheckoutForm";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await getTr();
  return { title: tr("Оформлення замовлення", "Checkout") };
}

export default function CheckoutPage() {
  return <CheckoutForm />;
}
