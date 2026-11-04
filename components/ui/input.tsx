import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { controlStyles, Field, type FieldBaseProps } from "./field";

type InputProps = FieldBaseProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "aria-describedby" | "aria-invalid"
  > & {
    fieldClassName?: string;
  };

export function Input({
  label,
  hint,
  error,
  hideLabel,
  id,
  required,
  className,
  fieldClassName,
  type = "text",
  ...props
}: InputProps) {
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
        <input
          id={inputId}
          type={type}
          required={required}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={cn(controlStyles, "h-12", className)}
          {...props}
        />
      )}
    </Field>
  );
}
