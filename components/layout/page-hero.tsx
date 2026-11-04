import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/cn";

type PageHeroProps = {
  title: ReactNode;
  eyebrow?: string;
  intro?: ReactNode;
  breadcrumb?: readonly Crumb[];
  tone?: "inverse" | "teal-soft";
  children?: ReactNode;
  className?: string;
};

/** En-tête de page intérieure : fil d'Ariane, eyebrow, H1, introduction. */
export function PageHero({
  title,
  eyebrow,
  intro,
  breadcrumb,
  tone = "teal-soft",
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        tone === "inverse" ? "surface-inverse" : "surface-teal-soft",
        "relative overflow-hidden",
        className,
      )}
    >
      <div className="container-site py-12 lg:py-16">
        {breadcrumb && (
          <Breadcrumb
            items={breadcrumb}
            tone={tone === "inverse" ? "inverse" : "default"}
            className="mb-6"
          />
        )}
        {eyebrow && (
          <p className="text-label tracking-[0.08em] text-accent-text uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 max-w-4xl text-h1">{title}</h1>
        {intro && <div className="mt-5 max-w-2xl text-body-lg">{intro}</div>}
        {children}
      </div>
    </section>
  );
}
