import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  "best-seller" | "promo" | "in-stock" | "new" | "out-of-stock";

const styles: Record<BadgeVariant, string> = {
  "best-seller": "bg-wheat text-on-accent",
  promo: "bg-wheat-soft text-wheat-ink",
  "in-stock": "bg-teal-soft text-success",
  new: "bg-ink text-on-inverse",
  "out-of-stock": "bg-surface-raised text-danger ring-1 ring-danger ring-inset",
};

const labels: Record<BadgeVariant, string> = {
  "best-seller": "Best-seller",
  promo: "Promo",
  "in-stock": "En stock",
  new: "Nouveau",
  "out-of-stock": "Rupture",
};

type BadgeProps = {
  variant: BadgeVariant;
  children?: ReactNode;
  className?: string;
};

export function Badge({ variant, children, className }: BadgeProps) {
  const dot = variant === "in-stock" || variant === "out-of-stock";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-caption font-semibold",
        styles[variant],
        className,
      )}
    >
      {dot && <span aria-hidden className="size-2 rounded-pill bg-current" />}
      {children ?? labels[variant]}
    </span>
  );
}
