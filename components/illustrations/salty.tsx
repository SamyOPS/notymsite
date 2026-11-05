import { TEAL, TEAL_DEEP, WHEAT, WHEAT_LIGHT, WHITE } from "./palette";

/** Paquet de chips, crackers et chips en vrac. Fond prévu : encre. */
export function SaltyIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 360"
      preserveAspectRatio="xMaxYMax meet"
      aria-hidden
      focusable="false"
      className={className}
    >
      {/* Paquet de chips */}
      <rect x="58" y="24" width="160" height="30" fill={TEAL_DEEP} />
      <g fill={WHITE} opacity="0.35">
        <rect x="76" y="24" width="4" height="30" />
        <rect x="104" y="24" width="4" height="30" />
        <rect x="132" y="24" width="4" height="30" />
        <rect x="160" y="24" width="4" height="30" />
        <rect x="188" y="24" width="4" height="30" />
      </g>
      <rect x="44" y="54" width="188" height="306" fill={TEAL} />
      {/* Une chips sur l'étiquette (forme irrégulière, sans trait : pas de « visage ») */}
      <path
        d="M90 186 C84 150 120 120 160 128 C192 134 196 168 182 192 C168 216 98 222 90 186 Z"
        fill={WHEAT}
      />
      <path
        d="M112 176 C112 160 132 148 152 152 C140 160 126 168 112 176 Z"
        fill={WHEAT_LIGHT}
      />
      <rect x="44" y="258" width="188" height="36" fill={WHITE} />

      {/* Crackers */}
      <rect x="282" y="196" width="128" height="128" fill={WHEAT} />
      <rect x="318" y="232" width="128" height="128" fill={WHEAT_LIGHT} />
      <g fill={WHEAT}>
        <rect x="346" y="260" width="10" height="10" />
        <rect x="378" y="260" width="10" height="10" />
        <rect x="410" y="260" width="10" height="10" />
        <rect x="346" y="292" width="10" height="10" />
        <rect x="378" y="292" width="10" height="10" />
        <rect x="410" y="292" width="10" height="10" />
        <rect x="346" y="324" width="10" height="10" />
        <rect x="378" y="324" width="10" height="10" />
        <rect x="410" y="324" width="10" height="10" />
      </g>

      {/* Chips en vrac */}
      <ellipse
        cx="520"
        cy="300"
        rx="54"
        ry="34"
        fill={WHEAT}
        transform="rotate(-18 520 300)"
      />
      <ellipse
        cx="590"
        cy="244"
        rx="44"
        ry="28"
        fill={WHEAT_LIGHT}
        transform="rotate(16 590 244)"
      />
      <ellipse
        cx="574"
        cy="334"
        rx="40"
        ry="24"
        fill={WHEAT}
        transform="rotate(8 574 334)"
      />
    </svg>
  );
}
