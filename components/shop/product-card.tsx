import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GrainCluster } from "@/components/ui/grain";
import { cn } from "@/lib/cn";
import { packagingLabel } from "@/lib/format";
import { site } from "@/lib/site";
import type { ProductBadge, ProductCardData } from "@/types/catalog";
import { AddToQuoteButton } from "./add-to-quote-button";
import { PriceTag } from "./price-tag";

/** Un seul badge par carte, par ordre de priorité. */
const BADGE_PRIORITY: ProductBadge[] = ["best-seller", "promo", "new"];

type ProductCardProps = {
  product: ProductCardData;
  /** Niveau du titre selon la page (h2 dans une grille sans titre de section). */
  headingLevel?: "h2" | "h3";
  className?: string;
};

export function ProductCard({
  product,
  headingLevel: Heading = "h3",
  className,
}: ProductCardProps) {
  const outOfStock = product.inStock === false;
  const badge = outOfStock
    ? undefined
    : BADGE_PRIORITY.find((b) => product.badges.includes(b));
  const packaging = packagingLabel(product.packLabel, product.volume);
  const showPrices = site.features.showPrices;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-lg border border-line bg-surface-raised p-3 text-ink shadow-card",
        "transition-[translate,box-shadow] duration-180 ease-out hover:shadow-lift motion-safe:hover:-translate-y-1",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-teal-soft">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1280px) 290px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-6"
          />
        ) : (
          <GrainCluster preset="placeholder" className="opacity-80" />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {badge && <Badge variant={badge} />}
          {outOfStock && <Badge variant="out-of-stock" />}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="text-caption text-ink-muted">{product.brand}</p>
        <Heading className="mt-1 text-body-lg leading-snug font-bold">
          {/* Lien étiré : toute la carte est cliquable, le bouton « + » reste au-dessus. */}
          <Link
            href={`/produit/${product.slug}`}
            className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </Heading>
        {showPrices && (
          <p className="mt-1 text-caption text-ink-muted">{packaging}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {/* Sans prix affichés, le conditionnement prend la place du prix. */}
          {showPrices ? (
            <PriceTag priceFromHtCents={product.priceFromHtCents} />
          ) : (
            <p className="text-label text-ink">{packaging}</p>
          )}
          <AddToQuoteButton
            productId={product.id}
            productName={product.name}
            disabled={outOfStock}
            className="relative z-10"
          />
        </div>
      </div>
    </article>
  );
}
