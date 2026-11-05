import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

/** Recherche dans le catalogue : envoie vers /catalogue?q=… (fonctionne sans JavaScript). */
export function SearchForm({
  id,
  defaultValue,
  className,
}: {
  id: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        placeholder="Rechercher un produit"
        autoComplete="off"
        className="h-11 w-full border-b border-ink bg-transparent pr-11 text-body text-ink placeholder:text-ink-muted focus-visible:border-teal-deep focus-visible:outline-offset-4"
      />
      <button
        type="submit"
        aria-label="Lancer la recherche"
        className="absolute top-0 right-0 inline-flex size-11 items-center justify-center rounded-pill text-ink transition-colors hover:bg-teal-soft"
      >
        <Search aria-hidden className="size-5" />
      </button>
    </form>
  );
}
