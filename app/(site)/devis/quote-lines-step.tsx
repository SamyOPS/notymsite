"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatPrice, packagingLabel } from "@/lib/format";
import type { QuoteLine } from "@/lib/quote/lines";
import { removeFromQuote, updateQuoteQuantity } from "@/lib/quote/store";
import { site } from "@/lib/site";
import type { QuoteProduct } from "@/types/catalog";

type QuoteLinesStepProps = {
  lines: QuoteLine[];
  products: ReadonlyMap<string, QuoteProduct>;
  error?: string;
  onContinue: () => void;
};

/** Étape 1 : sélection, quantités modifiables, suppression. */
export function QuoteLinesStep({
  lines,
  products,
  error,
  onContinue,
}: QuoteLinesStepProps) {
  const [announcement, setAnnouncement] = useState("");

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <p
          role="alert"
          className="border-2 border-danger bg-surface-raised p-4 text-body"
        >
          {error}
        </p>
      )}

      <ul className="border-t border-line">
        {lines.map((line) => {
          const product = products.get(line.productId);
          if (!product) return null;
          return (
            <li
              key={line.productId}
              className="flex gap-4 border-b border-line py-5"
            >
              <div
                className={cn(
                  "relative size-20 shrink-0 overflow-hidden border border-line",
                  product.imageUrl ? "bg-white" : "bg-teal-soft",
                )}
              >
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                ) : null}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <p className="text-caption text-ink-muted">{product.brand}</p>
                  <h3 className="font-sans text-body font-semibold">
                    <Link
                      href={`/produit/${product.slug}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-caption text-ink-muted">
                    {packagingLabel(product.packLabel, product.volume)}
                  </p>
                  {product.inStock === false && (
                    <Badge variant="out-of-stock" className="mt-2" />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <QuantityStepper
                    label={`Quantité de ${product.name}, en nombre de packs`}
                    value={line.quantity}
                    onValueChange={(quantity) =>
                      updateQuoteQuantity(line.productId, quantity)
                    }
                  />
                  {site.features.showPrices && (
                    <p className="min-w-28 text-right">
                      {product.priceFromHtCents === null ? (
                        <span className="text-label text-ink-muted">
                          Sur devis
                        </span>
                      ) : (
                        <>
                          <span className="block text-caption text-ink-muted">
                            à partir de
                          </span>
                          <span className="font-semibold tabular-nums">
                            {formatPrice(
                              product.priceFromHtCents * line.quantity,
                            )}{" "}
                            HT
                          </span>
                        </>
                      )}
                    </p>
                  )}
                  <button
                    type="button"
                    aria-label={`Retirer ${product.name} du devis`}
                    onClick={() => {
                      removeFromQuote(line.productId);
                      setAnnouncement(`${product.name} retiré du devis.`);
                    }}
                    className="inline-flex size-11 items-center justify-center text-ink-muted transition-colors hover:bg-teal-soft hover:text-danger"
                  >
                    <Trash2 aria-hidden className="size-5" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p role="status" className="sr-only">
        {announcement}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ButtonLink href="/catalogue" variant="secondary">
          Ajouter d&apos;autres produits
        </ButtonLink>
        <Button size="lg" onClick={onContinue}>
          Indiquer mes coordonnées
        </Button>
      </div>
    </div>
  );
}
