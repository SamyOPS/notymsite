import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

type StepsProps = {
  steps: readonly string[];
  /** Index de l'étape en cours (à partir de 0). */
  current: number;
  /** Retour à une étape terminée. */
  onSelect?: (index: number) => void;
  label: string;
  className?: string;
};

/** Indicateur d'étapes. Les étapes terminées sont cliquables pour revenir en arrière. */
export function Steps({
  steps,
  current,
  onSelect,
  label,
  className,
}: StepsProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          const content = (
            <>
              <span
                aria-hidden
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-pill text-label tabular-nums",
                  active && "bg-ink text-surface",
                  done && "bg-teal-deep text-on-teal",
                  !active &&
                    !done &&
                    "border border-line-strong text-ink-muted",
                )}
              >
                {done ? <Check className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-label",
                  active ? "text-ink" : "hidden text-ink-muted sm:inline",
                )}
              >
                <span className="sr-only">Étape {index + 1} : </span>
                {step}
                {done && <span className="sr-only"> (terminée)</span>}
              </span>
            </>
          );
          return (
            <li
              key={step}
              aria-current={active ? "step" : undefined}
              className="flex items-center gap-2"
            >
              {index > 0 && (
                <span aria-hidden className="h-px w-5 bg-line-strong sm:w-10" />
              )}
              {done && onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md pr-2 hover:underline"
                >
                  {content}
                </button>
              ) : (
                <span className="inline-flex min-h-11 items-center gap-2">
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
