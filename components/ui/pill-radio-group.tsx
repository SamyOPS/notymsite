import { useId } from "react";
import { cn } from "@/lib/cn";

type Option = { value: string; label: string };

type PillRadioGroupProps = {
  id?: string;
  legend: string;
  name: string;
  options: readonly Option[];
  defaultValue?: string;
  required?: boolean;
  error?: string;
  className?: string;
};

/**
 * Choix unique présenté en pills (type d'établissement, par exemple).
 * Ce sont de vrais boutons radio : navigation au clavier avec les flèches.
 */
export function PillRadioGroup({
  id,
  legend,
  name,
  options,
  defaultValue,
  required,
  error,
  className,
}: PillRadioGroupProps) {
  const errorId = `${useId()}-erreur`;
  return (
    <fieldset
      id={id}
      className={cn("flex flex-col gap-3", className)}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="mb-3 text-label text-ink">
        {legend}
        {required && (
          <span aria-hidden className="text-danger">
            {" "}
            *
          </span>
        )}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center rounded-pill border border-line-strong bg-surface-raised px-5 text-body font-medium text-ink",
              "transition-colors duration-150 hover:border-ink",
              "has-checked:border-ink has-checked:bg-ink has-checked:text-surface",
              "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultValue}
              required={required}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="text-caption font-semibold text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
