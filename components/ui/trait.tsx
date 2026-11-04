import type { ReactNode } from "react";

/**
 * Motif « trait » : la courbe teal sous le logo, en soulignement épais d'un
 * mot-clé du H1. Une seule fois par écran.
 */
export function Trait({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        focusable="false"
        viewBox="0 0 400 24"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.2em] left-[-2%] h-[0.32em] w-[104%] text-accent-fill"
      >
        {/* Fin à gauche, épais à droite, légèrement incurvé comme sous le logo. */}
        <path
          d="M2 21 C 110 9, 250 3, 398 1 L 396 19 C 250 17, 120 18, 4 23.5 Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
