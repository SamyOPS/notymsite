import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  /** Lien « Voir tout → » à droite du titre. */
  href?: string;
  linkLabel?: string;
  description?: string;
  /** Id du titre, pour aria-labelledby sur la section. */
  titleId?: string;
  as?: "h2" | "h3";
  className?: string;
};

/** Eyebrow en capitales + titre H2 + lien « Voir tout ». */
export function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "Voir tout",
  description,
  titleId,
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-x-8 gap-y-4",
        className,
      )}
    >
      <div className="max-w-2xl">
        <p className="text-label tracking-[0.08em] text-accent-text uppercase">
          {eyebrow}
        </p>
        <Heading id={titleId} className="mt-2 text-h2">
          {title}
        </Heading>
        {description && (
          <p className="mt-3 text-body-lg text-ink-muted">{description}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex min-h-11 items-center gap-2 text-label text-accent-text underline-offset-4 hover:underline"
        >
          {linkLabel}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-150 motion-safe:group-hover:translate-x-1"
          />
        </Link>
      )}
    </div>
  );
}
