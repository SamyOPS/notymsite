import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

/** Recherche en pill : envoie vers /catalogue?q=… (fonctionne sans JavaScript). */
export function SearchForm({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <form
      role="search"
      action="/catalogue"
      method="get"
      className={cn("relative", className)}
    >
      <label htmlFor={id} className="sr-only">
        Rechercher un produit
      </label>
      <input
        id={id}
        type="search"
        name="q"
        placeholder="Rechercher un produit"
        autoComplete="off"
        className="h-11 w-full rounded-pill border border-line-strong bg-surface-raised pr-12 pl-5 text-body text-ink placeholder:text-ink-muted hover:border-ink-muted focus-visible:border-teal-deep"
      />
      <button
        type="submit"
        aria-label="Lancer la recherche"
        className="absolute top-0 right-0 inline-flex size-11 items-center justify-center rounded-pill text-ink-muted transition-colors hover:text-ink"
      >
        <Search aria-hidden className="size-5" />
      </button>
    </form>
  );
}
