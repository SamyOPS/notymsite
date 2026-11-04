"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

type BrandMarqueeProps = { brands: readonly string[]; className?: string };

/**
 * Bandeau des marques à défilement lent. En pause au survol et au focus,
 * avec un bouton pause (critère WCAG 2.2.2). Sous prefers-reduced-motion,
 * pas d'animation : les marques s'affichent en liste.
 */
export function BrandMarquee({ brands, className }: BrandMarqueeProps) {
  const [paused, setPaused] = useState(false);

  const item = (name: string, index: number) => (
    <li
      key={`${name}-${index}`}
      className="flex h-16 shrink-0 items-center rounded-pill border border-line bg-surface-raised px-8 font-display text-h3 text-ink"
    >
      {name}
    </li>
  );

  return (
    <div className={cn("group relative", className)}>
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:[mask-image:none]">
        <div
          className={cn(
            "flex w-max group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-safe:animate-marquee",
            "motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center",
            paused && "[animation-play-state:paused]",
          )}
        >
          {/* pr-4 = gap-4 : les deux copies font exactement 50 % de la piste, boucle sans saut. */}
          <ul className="flex gap-4 pr-4 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0">
            {brands.map(item)}
          </ul>
          {/* Copie pour une boucle continue, ignorée par les lecteurs d'écran. */}
          <ul aria-hidden className="flex gap-4 pr-4 motion-reduce:hidden">
            {brands.map(item)}
          </ul>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="mt-4 ml-auto flex min-h-11 items-center gap-2 rounded-md px-3 text-label text-ink-muted transition-colors hover:bg-teal-soft hover:text-ink motion-reduce:hidden"
      >
        {paused ? (
          <Play aria-hidden className="size-4" />
        ) : (
          <Pause aria-hidden className="size-4" />
        )}
        {paused ? "Reprendre le défilement" : "Mettre en pause le défilement"}
      </button>
    </div>
  );
}
