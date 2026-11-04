import Link from "next/link";
import type { ChangeEvent } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/cn";

export type FilterOption = { value: string; label: string; count: number };

type FilterGroupProps = {
  legend: string;
  /** Nom du paramètre d'URL (ex. « marque ») ; le formulaire parent est en GET. */
  name: string;
  options: readonly FilterOption[];
  selected: readonly string[];
  /** URL du catalogue sans ce filtre, pour « Réinitialiser ». */
  resetHref?: string;
  /**
   * Mode contrôlé (avec JavaScript) : les cases reflètent `selected` et chaque
   * changement est remonté. Sans ce rappel, cases non contrôlées (formulaire GET).
   */
  onToggle?: (value: string, checked: boolean) => void;
  className?: string;
};

/**
 * Groupe de cases à cocher d'un filtre de catalogue, avec le nombre de
 * produits par option. À placer dans un <form method="get">.
 */
export function FilterGroup({
  legend,
  name,
  options,
  selected,
  resetHref,
  onToggle,
  className,
}: FilterGroupProps) {
  return (
    <fieldset className={cn("relative border-b border-line py-4", className)}>
      <legend className="float-left flex min-h-11 w-full items-center pr-28 text-label text-ink">
        {legend}
        {selected.length > 0 && (
          <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-pill bg-ink px-2 text-caption font-semibold text-surface">
            {selected.length}
            <span className="sr-only">
              {" "}
              sélectionné{selected.length > 1 ? "s" : ""}
            </span>
          </span>
        )}
      </legend>
      {resetHref && selected.length > 0 && (
        <Link
          href={resetHref}
          className="absolute top-4 right-0 inline-flex min-h-11 items-center text-caption font-semibold text-accent-text underline underline-offset-4"
        >
          Réinitialiser<span className="sr-only"> le filtre {legend}</span>
        </Link>
      )}
      <div className="clear-both flex flex-col">
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={name}
            value={option.value}
            {...(onToggle
              ? {
                  checked: selected.includes(option.value),
                  onChange: (event: ChangeEvent<HTMLInputElement>) =>
                    onToggle(option.value, event.target.checked),
                }
              : { defaultChecked: selected.includes(option.value) })}
            disabled={option.count === 0 && !selected.includes(option.value)}
            aside={
              <span className="text-caption text-ink-muted tabular-nums">
                <span aria-hidden>{option.count}</span>
                <span className="sr-only">
                  , {option.count} produit{option.count > 1 ? "s" : ""}
                </span>
              </span>
            }
          >
            {option.label}
          </Checkbox>
        ))}
      </div>
    </fieldset>
  );
}
