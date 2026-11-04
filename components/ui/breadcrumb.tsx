import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type Crumb = { label: string; href?: string };

type BreadcrumbProps = {
  items: readonly Crumb[];
  /** « inverse » sur surface-inverse : texte on-inverse au lieu de ink-muted. */
  tone?: "default" | "inverse";
  className?: string;
};

/** Fil d'Ariane : le dernier élément est la page courante (non cliquable). */
export function Breadcrumb({
  items,
  tone = "default",
  className,
}: BreadcrumbProps) {
  const inverse = tone === "inverse";
  return (
    <nav aria-label="Fil d'Ariane" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-x-2 text-caption",
          inverse ? "text-on-inverse" : "text-ink-muted",
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {index > 0 && (
                <ChevronRight aria-hidden className="size-3.5 shrink-0" />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-11 items-center underline-offset-4 hover:underline",
                    !inverse && "hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center",
                    isLast && "font-semibold",
                    isLast && !inverse && "text-ink",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
