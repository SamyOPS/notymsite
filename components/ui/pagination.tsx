import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  pageHref,
  paginationRange,
  type SearchParamsRecord,
} from "@/lib/pagination";

type PaginationProps = {
  page: number;
  totalPages: number;
  pathname: string;
  /** Paramètres courants (filtres, tri), conservés dans les liens. */
  searchParams?: SearchParamsRecord;
  className?: string;
};

const itemClass =
  "inline-flex size-11 items-center justify-center rounded-md text-label tabular-nums transition-colors duration-150";

export function Pagination({
  page,
  totalPages,
  pathname,
  searchParams = {},
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const href = (p: number) => pageHref(pathname, searchParams, p);

  return (
    <nav aria-label="Pagination" className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-1">
        <li>
          {page > 1 ? (
            <Link
              href={href(page - 1)}
              className={cn(itemClass, "hover:bg-teal-soft")}
              aria-label="Page précédente"
            >
              <ChevronLeft aria-hidden className="size-5" />
            </Link>
          ) : (
            <span
              className={cn(itemClass, "text-ink-muted opacity-50")}
              aria-hidden
            >
              <ChevronLeft className="size-5" />
            </span>
          )}
        </li>

        {paginationRange(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <li
              key={`ellipsis-${index}`}
              aria-hidden
              className={cn(itemClass, "text-ink-muted")}
            >
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={href(item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={cn(
                  itemClass,
                  item === page
                    ? "bg-ink text-surface"
                    : "text-ink hover:bg-teal-soft",
                )}
              >
                {item}
              </Link>
            </li>
          ),
        )}

        <li>
          {page < totalPages ? (
            <Link
              href={href(page + 1)}
              className={cn(itemClass, "hover:bg-teal-soft")}
              aria-label="Page suivante"
            >
              <ChevronRight aria-hidden className="size-5" />
            </Link>
          ) : (
            <span
              className={cn(itemClass, "text-ink-muted opacity-50")}
              aria-hidden
            >
              <ChevronRight className="size-5" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
