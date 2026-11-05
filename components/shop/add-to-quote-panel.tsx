"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { addToQuote } from "@/lib/quote/store";

type AddToQuotePanelProps = {
  productId: string;
  productName: string;
  packLabel: string;
  disabled?: boolean;
};

/** Quantité (en packs) + « Ajouter au devis », avec confirmation annoncée. */
export function AddToQuotePanel({
  productId,
  productName,
  packLabel,
  disabled,
}: AddToQuotePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-2">
          <span aria-hidden className="text-label text-ink">
            Quantité
          </span>
          <QuantityStepper
            label={`Quantité de ${productName}, en nombre de packs`}
            value={quantity}
            onValueChange={(value) => {
              setQuantity(value);
              setAdded(null);
            }}
          />
        </div>
        <Button
          size="lg"
          disabled={disabled}
          className="flex-1 sm:flex-none"
          onClick={() => {
            addToQuote(productId, quantity);
            setAdded(quantity);
          }}
        >
          Ajouter au devis
        </Button>
      </div>
      <p className="text-caption text-ink-muted">
        Quantité exprimée en packs ({packLabel}).
      </p>

      <div role="status" className="min-h-6">
        {added !== null && (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body">
            <span className="font-semibold text-success">
              {added} pack{added > 1 ? "s" : ""} ajouté{added > 1 ? "s" : ""} à
              votre devis.
            </span>
            <Link
              href="/devis"
              className="inline-flex min-h-11 items-center gap-1 font-semibold text-teal-deep underline underline-offset-4"
            >
              Voir mon devis
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
