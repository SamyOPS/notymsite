import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  children: ReactNode;
  /** Élément aligné à droite (compteur de résultats, par exemple). */
  aside?: ReactNode;
};

/** Case à cocher native, libellé cliquable sur toute la ligne (44px de haut). */
export function Checkbox({
  children,
  aside,
  className,
  ...props
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-3 text-body text-ink",
        "has-disabled:cursor-not-allowed has-disabled:opacity-60",
        className,
      )}
    >
      <input
        type="checkbox"
        className="size-5 shrink-0 cursor-pointer accent-teal-deep"
        {...props}
      />
      <span className="flex-1">{children}</span>
      {aside}
    </label>
  );
}
