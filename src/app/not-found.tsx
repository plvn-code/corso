import Link from "next/link";

export default function NotFound() {
  return (
    <div className="narrow empty" style={{ minHeight: "60vh" }}>
      <p className="eyebrow">404</p>
      <h1 className="h-title h-xl">Сторінку не знайдено</h1>
      <Link href="/catalog" className="btn btn--dark">
        До каталогу
      </Link>
    </div>
  );
}
