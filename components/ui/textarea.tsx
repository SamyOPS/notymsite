import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { controlStyles, Field, type FieldBaseProps } from "./field";

type TextareaProps = FieldBaseProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "aria-describedby" | "aria-invalid"
  > & {
    fieldClassName?: string;
  };

export function Textarea({
  label,
  hint,
  error,
  hideLabel,
  id,
  required,
  className,
  fieldClassName,
  rows = 5,
  ...props
}: TextareaProps) {
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
        <textarea
          id={inputId}
          rows={rows}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={cn(controlStyles, "min-h-32 resize-y py-3", className)}
          {...props}
        />
      )}
    </Field>
  );
}
