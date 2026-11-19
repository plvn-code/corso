import type { Metadata } from "next";
import { AccountView } from "./AccountView";

export const metadata: Metadata = { title: "Особистий кабінет" };

export default function AccountPage() {
  return <AccountView />;
}
