import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { controlStyles, Field, type FieldBaseProps } from "./field";

type SelectProps = FieldBaseProps &
  Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "aria-describedby" | "aria-invalid"
  > & {
    fieldClassName?: string;
  };

export function Select({
  label,
  hint,
  error,
  hideLabel,
  id,
  required,
  className,
  fieldClassName,
  children,
  ...props
}: SelectProps) {
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error}
      hideLabel={hideLabel}
      required={required}
      className={fieldClassName}
    >
      {({ id: inputId, describedBy, invalid }) => (
        <div className="relative">
          <select
            id={inputId}
            required={required}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={cn(
              controlStyles,
              "h-12 cursor-pointer appearance-none pr-11",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink-muted"
          />
        </div>
      )}
    </Field>
  );
}
