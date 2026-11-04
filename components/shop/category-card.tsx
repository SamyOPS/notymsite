import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Grain } from "@/components/ui/grain";
import { cn } from "@/lib/cn";
import type { CategoryTone } from "@/types/catalog";

const tones: Record<
  CategoryTone,
  { surface: string; grain: "surface" | "wheat" | "teal" | "ink" }
> = {
  teal: { surface: "surface-teal", grain: "surface" },
  ink: { surface: "surface-inverse", grain: "teal" },
  wheat: { surface: "surface-wheat", grain: "surface" },
  "teal-soft": { surface: "surface-teal-soft", grain: "teal" },
};

type CategoryCardProps = {
  href: string;
  title: string;
  subtitle: string;
  tone: CategoryTone;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/** Grande carte colorée de catégorie. Les grains restent dans le coin, loin du texte. */
export function CategoryCard({
  href,
  title,
  subtitle,
  tone,
  headingLevel: Heading = "h3",
  className,
}: CategoryCardProps) {
  const { surface, grain } = tones[tone];
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex min-h-60 flex-col justify-end overflow-hidden rounded-lg p-6",
        "transition-[translate,box-shadow] duration-180 ease-out hover:shadow-lift motion-safe:hover:-translate-y-1",
        surface,
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-5 right-6 flex gap-3"
      >
        <Grain tone={grain} size="lg" angle={35} />
        <Grain tone={grain} size="md" angle={-35} className="mt-8 opacity-70" />
      </span>
      <Heading className="relative text-h3">{title}</Heading>
      <p className="relative mt-1 text-body">{subtitle}</p>
      <span className="relative mt-5 inline-flex items-center gap-2 text-label">
        Voir les produits
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-150 motion-safe:group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
