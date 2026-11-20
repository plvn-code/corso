import type { Metadata } from "next";
import { getTr } from "@/i18n/server";
import { AccountView } from "./AccountView";

export async function generateMetadata(): Promise<Metadata> {
  const { tr } = await getTr();
  return { title: tr("Особистий кабінет", "My account") };
}

export default function AccountPage() {
  return <AccountView />;
}
