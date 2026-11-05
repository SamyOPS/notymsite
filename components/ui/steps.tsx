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

/**
 * Indicateur d'étapes en texte : « 01 Sélection  02 Coordonnées  03 Envoi ».
 * L'étape en cours est soulignée ; les étapes terminées sont cliquables.
 */
export function Steps({
  steps,
  current,
  onSelect,
  label,
  className,
}: StepsProps) {
  return (
    <nav aria-label={label} className={className}>
      <ol className="grid grid-cols-3 border-b border-line">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          const content = (
            <>
              <span aria-hidden className="tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={cn(!active && "hidden sm:inline")}>
                <span className="sr-only">Étape {index + 1} : </span>
                {step}
                {done && <span className="sr-only"> (terminée)</span>}
              </span>
            </>
          );
          const base = cn(
            "-mb-px flex min-h-12 w-full items-center gap-3 border-b-2 text-label",
            active
              ? "border-ink text-ink"
              : "border-transparent text-ink-muted",
          );
          return (
            <li key={step} aria-current={active ? "step" : undefined}>
              {done && onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className={cn(base, "text-left hover:text-ink")}
                >
                  {content}
                </button>
              ) : (
                <span className={base}>{content}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
