import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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

/**
 * Carte produit : visuel carré avec le bouton « + » dans son coin, puis nom
 * et conditionnement. Pas de cadre ni d'ombre : la grille trace les filets.
 */
export function ProductCard({
  product,
  headingLevel: Heading = "h3",
  className,
}: ProductCardProps) {
  const outOfStock = product.inStock === false;
  const badge = outOfStock
    ? undefined
    : BADGE_PRIORITY.find((b) => product.badges.includes(b));

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col bg-surface-raised text-ink",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-2 has-[a:focus-visible]:outline-focus",
        className,
      )}
    >
      {/* Les photos sont déjà centrées sur un carré blanc : elles remplissent la zone. */}
      <div
        className={cn(
          "relative aspect-square overflow-hidden",
          product.imageUrl ? "bg-white" : "bg-teal-soft",
        )}
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 300px, 50vw"
            className="object-contain transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute bottom-3 left-3 text-caption text-ink-muted sm:left-4">
            Visuel à venir
          </span>
        )}
        {(badge || outOfStock) && (
          <div className="absolute top-3 left-3 flex gap-2">
            {badge && <Badge variant={badge} />}
            {outOfStock && <Badge variant="out-of-stock" />}
          </div>
        )}
        <AddToQuoteButton
          productId={product.id}
          productName={product.name}
          disabled={outOfStock}
          className="absolute right-3 bottom-3 z-10"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <Heading className="font-sans text-body leading-snug font-semibold sm:text-body-lg">
          {/* Lien étiré : toute la carte est cliquable, le bouton « + » reste au-dessus. */}
          <Link
            href={`/produit/${product.slug}`}
            className="underline-offset-4 group-hover:underline after:absolute after:inset-0 focus-visible:outline-none"
          >
            {product.name}
          </Link>
        </Heading>
        <p className="text-caption text-ink-muted sm:text-body">
          {packagingLabel(product.packLabel, product.volume)}
        </p>
        {site.features.showPrices && (
          <PriceTag
            priceFromHtCents={product.priceFromHtCents}
            className="mt-auto pt-2"
          />
        )}
      </div>
    </article>
  );
}
