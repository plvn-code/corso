"use client";

import { useLang } from "@/i18n/client";
import type { Measurements } from "@/lib/store";
import type { Lang } from "@/i18n/lang";

/**
 * Body measurements panel (checkout + account). CORSO sews in-house and adapts every model
 * to the client's figure, so height / bust / waist / hips go with each order.
 */
export const MEASURES: { key: keyof Measurements; label: string; en: string; min: number; max: number; hint: string; hintEn: string }[] = [
  { key: "height", label: "Зріст", en: "Height", min: 140, max: 200, hint: "без взуття", hintEn: "without shoes" },
  { key: "bust", label: "Обʼєм грудей", en: "Bust", min: 70, max: 150, hint: "по найвиступаючих точках", hintEn: "at the fullest point" },
  { key: "waist", label: "Обʼєм талії", en: "Waist", min: 50, max: 140, hint: "по найвужчому місцю", hintEn: "at the narrowest point" },
  { key: "hips", label: "Обʼєм стегон", en: "Hips", min: 75, max: 160, hint: "по найширшому місцю", hintEn: "at the widest point" },
];

export const EMPTY_MEASUREMENTS: Measurements = { height: "", bust: "", waist: "", hips: "" };

export function hasMeasurements(m: Measurements | null | undefined): m is Measurements {
  return !!m && MEASURES.every((f) => String(m[f.key] ?? "").trim() !== "");
}

export function measurementsLine(m: Measurements, lang: Lang = "uk") {
  return MEASURES.map((f) => `${lang === "en" ? f.en : f.label} ${m[f.key]}`).join(" · ") + (lang === "en" ? " cm" : " см");
}

export function MeasureFields({
  value,
  onChange,
  required = false,
}: {
  value: Measurements;
  onChange: (m: Measurements) => void;
  required?: boolean;
}) {
  const { lang, tr } = useLang();
  return (
    <div className="measure">
      {MEASURES.map((f) => (
        <label key={f.key} className="measure__f">
          <span className="measure__l">{lang === "en" ? f.en : f.label}</span>
          <span className="measure__in">
            <input
              type="number"
              inputMode="decimal"
              min={f.min}
              max={f.max}
              step="0.5"
              required={required}
              value={value[f.key]}
              onChange={(e) => onChange({ ...value, [f.key]: e.target.value })}
              placeholder="—"
              aria-describedby={`mh-${f.key}`}
            />
            <i>{tr("см", "cm")}</i>
          </span>
          <small id={`mh-${f.key}`}>{lang === "en" ? f.hintEn : f.hint}</small>
        </label>
      ))}
    </div>
  );
}
