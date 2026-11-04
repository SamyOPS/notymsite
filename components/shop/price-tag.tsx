import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

type PriceTagProps = {
  /** Prix « à partir de » HT en centimes ; null = prix communiqué sur devis. */
  priceFromHtCents: number | null;
  /** « lg » sur la fiche produit. */
  size?: "md" | "lg";
  className?: string;
};

/** « À partir de 12,90 € HT », ou « Prix sur devis » si aucun prix n'est renseigné. */
export function PriceTag({
  priceFromHtCents,
  size = "md",
  className,
}: PriceTagProps) {
  const large = size === "lg";
  if (priceFromHtCents === null) {
    return (
      <p
        className={cn(
          large ? "font-display text-h3 text-ink" : "text-label text-ink-muted",
          className,
        )}
      >
        Prix sur devis
      </p>
    );
  }
  return (
    <p className={cn("flex flex-col", className)}>
      <span
        className={cn("text-ink-muted", large ? "text-body" : "text-caption")}
      >
        À partir de
      </span>
      <span
        className={cn(
          "text-ink tabular-nums",
          large ? "font-display text-h2" : "text-price",
        )}
      >
        {formatPrice(priceFromHtCents)}{" "}
        <span
          className={cn(
            "font-sans font-semibold text-ink-muted",
            large ? "text-body" : "text-caption",
          )}
        >
          HT
        </span>
      </span>
    </p>
  );
}
