import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  headingLevel?: "h1" | "h2";
  className?: string;
};

/** État vide (devis vide, 404, aucune actualité) : un titre, une phrase, une action. */
export function EmptyState({
  title,
  description,
  actions,
  headingLevel: Heading = "h2",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex max-w-xl flex-col items-start gap-4 py-12",
        className,
      )}
    >
      <Heading className={Heading === "h1" ? "text-h1" : "text-h2"}>
        {title}
      </Heading>
      {description && (
        <div className="text-body-lg text-ink-muted">{description}</div>
      )}
      {actions && <div className="mt-2 flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
