import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/cn";

type PageHeroProps = {
  title: ReactNode;
  intro?: ReactNode;
  breadcrumb?: readonly Crumb[];
  children?: ReactNode;
  className?: string;
};

/** En-tête de page intérieure : fil d'Ariane, H1, introduction. Sobre, sur le fond de page. */
export function PageHero({
  title,
  intro,
  breadcrumb,
  children,
  className,
}: PageHeroProps) {
  return (
    <header className={cn("container-site pt-6 pb-10 lg:pb-14", className)}>
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      <h1 className="mt-6 max-w-4xl text-h1">{title}</h1>
      {intro && (
        <div className="mt-4 max-w-2xl text-body-lg text-ink-muted">
          {intro}
        </div>
      )}
      {children}
    </header>
  );
}
