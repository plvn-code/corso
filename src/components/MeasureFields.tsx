"use client";

import type { Measurements } from "@/lib/store";

/**
 * Body measurements panel (checkout + account). CORSO sews in-house and adapts every model
 * to the client's figure, so height / bust / waist / hips go with each order.
 */
export const MEASURES: { key: keyof Measurements; label: string; min: number; max: number; hint: string }[] = [
  { key: "height", label: "Зріст", min: 140, max: 200, hint: "без взуття" },
  { key: "bust", label: "Обʼєм грудей", min: 70, max: 150, hint: "по найвиступаючих точках" },
  { key: "waist", label: "Обʼєм талії", min: 50, max: 140, hint: "по найвужчому місцю" },
  { key: "hips", label: "Обʼєм стегон", min: 75, max: 160, hint: "по найширшому місцю" },
];

export const EMPTY_MEASUREMENTS: Measurements = { height: "", bust: "", waist: "", hips: "" };

export function hasMeasurements(m: Measurements | null | undefined): m is Measurements {
  return !!m && MEASURES.every((f) => String(m[f.key] ?? "").trim() !== "");
}

export function measurementsLine(m: Measurements) {
  return MEASURES.map((f) => `${f.label} ${m[f.key]}`).join(" · ") + " см";
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
  return (
    <div className="measure">
      {MEASURES.map((f) => (
        <label key={f.key} className="measure__f">
          <span className="measure__l">{f.label}</span>
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
            <i>см</i>
          </span>
          <small id={`mh-${f.key}`}>{f.hint}</small>
        </label>
      ))}
    </div>
  );
}
