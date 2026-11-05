import { INK, TEAL_DEEP, TEAL_LIGHT, WHEAT, WHITE } from "./palette";

/** Bouteilles, canettes et brique de jus, posées sur la base du panneau. */
export function DrinksIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 600"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
      focusable="false"
      className={className}
    >
      {/* Grande bouteille 1,5 L */}
      <rect x="88" y="62" width="44" height="40" fill={INK} />
      <rect x="80" y="102" width="60" height="12" fill={INK} />
      <path
        d="M92 114 H128 C128 176 186 176 186 236 V600 H34 V236 C34 176 92 176 92 114 Z"
        fill={INK}
      />
      <rect x="34" y="330" width="152" height="120" fill={WHITE} />
      <rect x="34" y="376" width="152" height="28" fill={WHEAT} />
      <rect x="52" y="246" width="12" height="64" fill={WHITE} opacity="0.25" />

      {/* Canette 50 cl */}
      <rect x="212" y="372" width="92" height="228" fill={WHEAT} />
      <rect x="218" y="358" width="80" height="14" fill={INK} />
      <rect x="212" y="446" width="92" height="40" fill={INK} />
      <rect x="226" y="390" width="10" height="44" fill={WHITE} opacity="0.4" />

      {/* Bouteille en verre */}
      <rect x="342" y="148" width="30" height="22" fill={INK} />
      <path
        d="M344 170 H370 V250 C370 292 404 292 404 334 V600 H310 V334 C310 292 344 292 344 250 Z"
        fill={TEAL_DEEP}
      />
      <rect x="310" y="404" width="94" height="76" fill={WHITE} />
      <rect x="330" y="430" width="54" height="22" fill={WHEAT} />

      {/* Brique de jus */}
      <rect x="440" y="234" width="84" height="16" fill={WHITE} />
      <path d="M424 300 L444 250 H520 L540 300 Z" fill={TEAL_LIGHT} />
      <rect x="424" y="300" width="116" height="300" fill={WHITE} />
      <circle cx="482" cy="410" r="36" fill={WHEAT} />
      <path
        d="M482 374 C490 356 506 352 516 356 C510 368 498 374 482 374 Z"
        fill={TEAL_DEEP}
      />
      <rect x="424" y="492" width="116" height="26" fill={INK} />

      {/* Petite canette */}
      <rect x="560" y="452" width="70" height="148" fill={WHITE} />
      <rect x="566" y="440" width="58" height="12" fill={INK} />
      <rect x="560" y="500" width="70" height="30" fill={TEAL_DEEP} />

      {/* Bulles */}
      <circle cx="258" cy="318" r="9" fill={WHITE} opacity="0.7" />
      <circle cx="278" cy="290" r="6" fill={WHITE} opacity="0.7" />
      <circle cx="250" cy="268" r="4" fill={WHITE} opacity="0.7" />
      <circle cx="596" cy="408" r="7" fill={WHITE} opacity="0.7" />
      <circle cx="612" cy="380" r="4" fill={WHITE} opacity="0.7" />
    </svg>
  );
}
