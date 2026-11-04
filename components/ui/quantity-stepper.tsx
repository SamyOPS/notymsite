"use client";

import { Minus, Plus } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { MAX_QUANTITY, MIN_QUANTITY } from "@/lib/quote/lines";

type QuantityStepperProps = {
  /** Libellé lu par les lecteurs d'écran, ex. « Quantité de Coca-Cola 1,5 L ». */
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Nom du champ pour une soumission de formulaire classique. */
  name?: string;
  className?: string;
};

/** − / valeur / +, minimum 1. Contrôlé (value) ou non (defaultValue). */
export function QuantityStepper({
  label,
  value,
  defaultValue,
  onValueChange,
  min = MIN_QUANTITY,
  max = MAX_QUANTITY,
  name,
  className,
}: QuantityStepperProps) {
  const [internal, setInternal] = useState(defaultValue ?? min);
  const [draft, setDraft] = useState<string | null>(null);
  const current = value ?? internal;

  const clamp = (n: number) => Math.min(max, Math.max(min, Math.trunc(n)));

  function commit(next: number) {
    const clamped = clamp(Number.isFinite(next) ? next : current);
    setDraft(null);
    if (value === undefined) setInternal(clamped);
    if (clamped !== current) onValueChange?.(clamped);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      commit(current + 1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      commit(current - 1);
    } else if (event.key === "Enter" && draft !== null) {
      event.preventDefault();
      commit(draft === "" ? current : Number(draft));
    }
  }

  const buttonClass =
    "flex size-11 shrink-0 items-center justify-center text-ink transition-colors duration-150 hover:bg-teal-soft disabled:cursor-not-allowed disabled:text-ink-muted disabled:opacity-50 disabled:hover:bg-transparent [&_svg]:size-4";

  return (
    <div
      className={cn(
        "inline-flex w-fit items-center overflow-hidden rounded-md border border-line-strong bg-surface-raised",
        className,
      )}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => commit(current - 1)}
        disabled={current <= min}
        aria-label="Diminuer la quantité"
      >
        <Minus aria-hidden />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        name={name}
        aria-label={label}
        value={draft ?? String(current)}
        onChange={(event) =>
          setDraft(event.target.value.replace(/\D/g, "").slice(0, 3))
        }
        onBlur={() =>
          draft !== null && commit(draft === "" ? current : Number(draft))
        }
        onKeyDown={onKeyDown}
        className="h-11 w-12 bg-transparent text-center text-body font-semibold text-ink tabular-nums focus-visible:-outline-offset-2"
      />
      <button
        type="button"
        className={buttonClass}
        onClick={() => commit(current + 1)}
        disabled={current >= max}
        aria-label="Augmenter la quantité"
      >
        <Plus aria-hidden />
      </button>
    </div>
  );
}
