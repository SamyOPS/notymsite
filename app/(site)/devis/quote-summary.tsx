import { Phone, Store, Truck } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { QuoteEstimate } from "@/lib/quote/estimate";
import { site } from "@/lib/site";

/** Récapitulatif : nombre de produits, packs et estimation indicative HT. */
export function QuoteSummary({ estimate }: { estimate: QuoteEstimate }) {
  const {
    lineCount,
    totalPacks,
    pricedLines,
    unpricedLines,
    pricedTotalCents,
  } = estimate;
  return (
    <aside
      aria-labelledby="recap-titre"
      className="flex flex-col gap-5 rounded-lg border border-line bg-surface-raised p-6 shadow-card lg:sticky lg:top-28"
    >
      <h2 id="recap-titre" className="text-h3">
        Récapitulatif
      </h2>
      <dl className="flex flex-col gap-2 text-body">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Produits</dt>
          <dd className="font-semibold tabular-nums">{lineCount}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">Packs</dt>
          <dd className="font-semibold tabular-nums">{totalPacks}</dd>
        </div>
      </dl>

      <div className="border-t border-line pt-4">
        {pricedLines > 0 ? (
          <>
            <p className="text-caption text-ink-muted">
              Estimation à partir de
            </p>
            <p className="text-price tabular-nums">
              {formatPrice(pricedTotalCents)}{" "}
              <span className="text-caption font-semibold text-ink-muted">
                HT
              </span>
            </p>
            {unpricedLines > 0 && (
              <p className="mt-1 text-caption text-ink-muted">
                + {unpricedLines} produit{unpricedLines > 1 ? "s" : ""} au prix
                communiqué sur le devis
              </p>
            )}
          </>
        ) : (
          <p className="text-label">Prix communiqués sur le devis</p>
        )}
        <p className="mt-3 text-caption text-ink-muted">
          Le devis précise les prix définitifs, la TVA et les conditions de
          livraison ou de retrait.
        </p>
      </div>

      <ul className="flex flex-col gap-2 border-t border-line pt-4 text-caption">
        <li className="flex items-center gap-2">
          <Truck aria-hidden className="size-4 text-teal-deep" />{" "}
          {site.delivery.shipping}
        </li>
        <li className="flex items-center gap-2">
          <Store aria-hidden className="size-4 text-teal-deep" />{" "}
          {site.delivery.pickup}
        </li>
        <li>
          <a
            href={site.contact.phoneHref}
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-teal-deep"
          >
            <Phone aria-hidden className="size-4" /> {site.contact.phone}
          </a>
        </li>
      </ul>
    </aside>
  );
}
