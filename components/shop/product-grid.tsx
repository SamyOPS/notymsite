import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Grille de produits à filets : chaque cellule porte ses bordures droite et
 * basse, la grille ses bordures haute et gauche. Pas de cartes ni d'ombres,
 * et une dernière ligne incomplète reste propre.
 */
export function ProductGrid({
  children,
  columns = "lg:grid-cols-4",
  className,
}: {
  children: ReactNode;
  /** Classes de colonnes selon la largeur d'écran. */
  columns?: string;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 border-t border-l border-line [&>li]:border-r [&>li]:border-b [&>li]:border-line",
        columns,
        className,
      )}
    >
      {children}
    </ul>
  );
}
