import { formatPrice } from "@/lib/format";
import type { QuoteEstimate } from "@/lib/quote/estimate";
import { site } from "@/lib/site";

/** Récapitulatif : nombre de produits, packs et, si les prix sont affichés, estimation HT. */
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
      className="flex flex-col gap-5 border-t border-ink pt-4 lg:sticky lg:top-24"
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
        {!site.features.showPrices ? (
          <p className="text-body">
            Notre équipe vous répond avec un devis adapté à votre sélection.
          </p>
        ) : pricedLines > 0 ? (
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
          Le devis précise les prix, la TVA et les conditions de livraison ou de
          retrait.
        </p>
      </div>

      <p className="border-t border-line pt-4 text-caption text-ink-muted">
        Une question ?{" "}
        <a
          href={site.contact.phoneHref}
          className="font-semibold text-ink underline underline-offset-4"
        >
          {site.contact.phone}
        </a>
      </p>
    </aside>
  );
}
