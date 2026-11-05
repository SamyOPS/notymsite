import Link from "next/link";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  title: string;
  /** Lien texte à droite du titre (ex. « Tout le catalogue »). */
  href?: string;
  linkLabel?: string;
  /** Id du titre, pour aria-labelledby sur la section. */
  titleId?: string;
  as?: "h2" | "h3";
  className?: string;
};

/** Titre de section et lien éventuel, séparés du contenu par un filet. */
export function SectionHeader({
  title,
  href,
  linkLabel = "Voir tout",
  titleId,
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-ink pb-4",
        className,
      )}
    >
      <Heading id={titleId} className="text-h2">
        {title}
      </Heading>
      {href && (
        <Link
          href={href}
          className="inline-flex min-h-11 items-center text-label text-ink underline underline-offset-4 hover:text-teal-deep"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
