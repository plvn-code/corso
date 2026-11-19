import type { Metadata } from "next";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Оформлення замовлення" };

export default function CheckoutPage() {
  return <CheckoutForm />;
}
