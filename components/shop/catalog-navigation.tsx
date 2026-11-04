"use client";

import { useRouter } from "next/navigation";
import { createContext, use, useTransition, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type CatalogNavigation = {
  /** Navigue vers une URL du catalogue dans une transition (mise à jour optimiste possible). */
  navigate: (href: string, optimisticUpdate?: () => void) => void;
  pending: boolean;
};

const CatalogNavigationContext = createContext<CatalogNavigation | null>(null);

export function CatalogNavigationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const navigate: CatalogNavigation["navigate"] = (href, optimisticUpdate) => {
    startTransition(() => {
      optimisticUpdate?.();
      router.push(href, { scroll: false });
    });
  };

  return (
    <CatalogNavigationContext value={{ navigate, pending }}>
      {children}
    </CatalogNavigationContext>
  );
}

export function useCatalogNavigation(): CatalogNavigation {
  const context = use(CatalogNavigationContext);
  if (!context)
    throw new Error("useCatalogNavigation hors de CatalogNavigationProvider");
  return context;
}

/** Zone des résultats : signale le chargement pendant la mise à jour des filtres. */
export function ResultsRegion({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { pending } = useCatalogNavigation();
  return (
    <div
      aria-busy={pending}
      className={cn(
        "transition-opacity duration-150",
        pending && "opacity-60",
        className,
      )}
    >
      {children}
    </div>
  );
}
