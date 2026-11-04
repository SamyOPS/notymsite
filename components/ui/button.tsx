import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "inverse" | "dark";
export type ButtonSize = "md" | "lg";

type StyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const variants: Record<ButtonVariant, string> = {
  /** Action principale : teal-deep */
  primary: "bg-teal-deep text-on-teal hover:bg-teal-deep-hover",
  /** Contour de la couleur du texte courant : fonctionne sur toutes les surfaces */
  secondary: "border-2 border-current bg-transparent hover:bg-current/10",
  /** Bouton clair sur fond sombre (hero, bandeaux) */
  inverse:
    "bg-on-inverse text-surface-inverse hover:bg-teal-soft hover:text-ink",
  /** Bouton ink */
  dark: "bg-ink text-surface hover:bg-ink-hover",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-body [&_svg]:size-5", // 44px
  lg: "min-h-13 px-7 text-body-lg [&_svg]:size-5", // 52px
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: StyleOptions = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap",
    "transition-colors duration-150 ease-out select-none [&_svg]:shrink-0",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** Même apparence qu'un bouton, mais c'est un lien (navigation). */
export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props} />
  );
}
