"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type MobileFiltersProps = {
  activeCount: number;
  total: number;
  children: ReactNode;
};

/** Tiroir de filtres (mobile et tablette), dans un <dialog> natif. */
export function MobileFilters({
  activeCount,
  total,
  children,
}: MobileFiltersProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        aria-controls="tiroir-filtres"
        className="lg:hidden"
      >
        <SlidersHorizontal aria-hidden />
        Filtres
        {activeCount > 0 && (
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-pill bg-ink px-1.5 text-caption font-bold text-surface">
            {activeCount}
            <span className="sr-only"> actif{activeCount > 1 ? "s" : ""}</span>
          </span>
        )}
      </Button>

      <dialog
        ref={dialogRef}
        id="tiroir-filtres"
        aria-labelledby="tiroir-filtres-titre"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="m-0 mr-auto h-dvh max-h-none w-full max-w-sm bg-surface p-0 text-ink backdrop:bg-ink/50"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-line px-6 py-3">
            <h2 id="tiroir-filtres-titre" className="text-h3">
              Filtres
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Fermer les filtres"
              className="inline-flex size-11 items-center justify-center hover:bg-teal-soft"
            >
              <X aria-hidden className="size-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-2">{children}</div>
          <div className="border-t border-line p-4">
            <Button size="lg" className="w-full" onClick={close}>
              Voir {total} produit{total > 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
