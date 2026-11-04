import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Styles communs aux champs : 48px de haut, bordure line-strong, focus teal-deep. */
export const controlStyles = cn(
  "block w-full rounded-sm border border-line-strong bg-surface-raised px-4 text-body text-ink",
  "transition-colors duration-150 placeholder:text-ink-muted",
  "hover:border-ink-muted focus-visible:border-teal-deep",
  "disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger",
);

export type FieldBaseProps = {
  label: string;
  hint?: string;
  error?: string;
  /** Masque visuellement le libellé (il reste lu par les lecteurs d'écran). */
  hideLabel?: boolean;
};

type FieldIds = {
  id: string;
  describedBy: string | undefined;
  invalid: true | undefined;
};

/**
 * Enveloppe un champ avec son libellé visible, son aide et son message
 * d'erreur, reliés par aria-describedby.
 */
export function Field({
  id: idProp,
  label,
  hint,
  error,
  hideLabel,
  required,
  className,
  children,
}: FieldBaseProps & {
  id?: string;
  required?: boolean;
  className?: string;
  children: (ids: FieldIds) => ReactNode;
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const hintId = hint ? `${id}-aide` : undefined;
  const errorId = error ? `${id}-erreur` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className={cn("text-label text-ink", hideLabel && "sr-only")}
      >
        {label}
        {required && (
          <span aria-hidden className="text-danger">
            {" "}
            *
          </span>
        )}
      </label>
      {children({ id, describedBy, invalid: error ? true : undefined })}
      {hint && (
        <p id={hintId} className="text-caption text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-caption font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
