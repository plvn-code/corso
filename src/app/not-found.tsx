import Link from "next/link";
import { getTr } from "@/i18n/server";

export default async function NotFound() {
  const { tr } = await getTr();
  return (
    <div className="narrow empty" style={{ minHeight: "60vh" }}>
      <p className="eyebrow">404</p>
      <h1 className="h-title h-xl">{tr("Сторінку не знайдено", "Page not found")}</h1>
      <Link href="/catalog" className="btn btn--dark">
        {tr("До каталогу", "Go to shop")}
      </Link>
    </div>
  );
}
