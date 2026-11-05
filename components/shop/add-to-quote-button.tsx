"use client";

import { Check, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { addToQuote } from "@/lib/quote/store";

type AddToQuoteButtonProps = {
  productId: string;
  productName: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
};

/** Bouton carré 44px « + » : ajoute le produit à la demande de devis. */
export function AddToQuoteButton({
  productId,
  productName,
  quantity = 1,
  disabled,
  className,
}: AddToQuoteButtonProps) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        aria-label={`Ajouter ${productName} au devis`}
        onClick={() => {
          addToQuote(productId, quantity);
          setAdded(true);
        }}
        className={cn(
          "inline-flex size-11 shrink-0 items-center justify-center rounded-pill bg-teal-deep text-on-teal",
          "transition-colors duration-150 hover:bg-teal-deep-hover",
          "disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
      >
        {added ? (
          <Check aria-hidden className="size-5" />
        ) : (
          <Plus aria-hidden className="size-5" />
        )}
      </button>
      <span role="status" className="sr-only">
        {added ? `${productName} ajouté au devis` : ""}
      </span>
    </>
  );
}
