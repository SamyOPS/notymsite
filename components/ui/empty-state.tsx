import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { GrainCluster } from "./grain";

type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  headingLevel?: "h1" | "h2";
  className?: string;
};

/** État vide (panier vide, 404, aucune actualité) avec le motif des grains. */
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
        "flex flex-col items-center gap-6 py-12 text-center",
        className,
      )}
    >
      <div aria-hidden className="relative h-40 w-56">
        <GrainCluster preset="empty" />
      </div>
      <Heading className={Heading === "h1" ? "text-h1" : "text-h2"}>
        {title}
      </Heading>
      {description && (
        <div className="max-w-md text-body-lg text-ink-muted">
          {description}
        </div>
      )}
      {actions && (
        <div className="flex flex-wrap justify-center gap-3">{actions}</div>
      )}
    </div>
  );
}
