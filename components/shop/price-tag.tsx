import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

type PriceTagProps = {
  /** Prix « à partir de » HT en centimes ; null = prix communiqué sur devis. */
  priceFromHtCents: number | null;
  className?: string;
};

/** « À partir de 12,90 € HT », ou « Prix sur devis » si aucun prix n'est renseigné. */
export function PriceTag({ priceFromHtCents, className }: PriceTagProps) {
  if (priceFromHtCents === null) {
    return (
      <p className={cn("text-label text-ink-muted", className)}>
        Prix sur devis
      </p>
    );
  }
  return (
    <p className={cn("flex flex-col", className)}>
      <span className="text-caption text-ink-muted">À partir de</span>
      <span className="text-price text-ink tabular-nums">
        {formatPrice(priceFromHtCents)}{" "}
        <span className="text-caption font-semibold text-ink-muted">HT</span>
      </span>
    </p>
  );
}
