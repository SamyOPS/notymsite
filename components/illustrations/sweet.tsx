import {
  INK,
  TEAL,
  TEAL_DEEP,
  TEAL_LIGHT,
  WHEAT,
  WHEAT_LIGHT,
  WHITE,
} from "./palette";

/** Tablette de chocolat entamée, biscuit croqué et bonbon emballé. Fond prévu : blé. */
export function SweetIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 360"
      preserveAspectRatio="xMaxYMax meet"
      aria-hidden
      focusable="false"
      className={className}
    >
      {/* Tablette de chocolat */}
      <rect x="52" y="60" width="152" height="120" fill={INK} />
      <g stroke="#2f3636" strokeWidth="5">
        <line x1="102" y1="60" x2="102" y2="180" />
        <line x1="153" y1="60" x2="153" y2="180" />
        <line x1="52" y1="120" x2="204" y2="120" />
      </g>
      <rect x="40" y="170" width="176" height="14" fill={TEAL_LIGHT} />
      <rect x="40" y="184" width="176" height="176" fill={TEAL_DEEP} />
      <rect x="40" y="240" width="176" height="38" fill={WHITE} />

      {/* Biscuit croqué */}
      <circle cx="340" cy="262" r="86" fill={WHEAT_LIGHT} />
      <circle cx="410" cy="196" r="30" fill={WHEAT} />
      <g fill={INK}>
        <rect x="300" y="222" width="14" height="14" />
        <rect x="350" y="250" width="12" height="12" />
        <rect x="314" y="290" width="14" height="14" />
        <rect x="370" y="300" width="12" height="12" />
        <rect x="282" y="268" width="10" height="10" />
      </g>

      {/* Bonbon emballé */}
      <path d="M470 170 L430 136 V204 Z" fill={TEAL_DEEP} />
      <path d="M584 170 L624 136 V204 Z" fill={TEAL_DEEP} />
      <rect x="466" y="138" width="122" height="64" rx="32" fill={TEAL} />
      <g fill={WHITE} opacity="0.85">
        <rect x="498" y="138" width="10" height="64" />
        <rect x="526" y="138" width="10" height="64" />
        <rect x="554" y="138" width="10" height="64" />
      </g>
      <circle cx="560" cy="318" r="26" fill={WHITE} />
      <circle cx="604" cy="330" r="16" fill={INK} />
    </svg>
  );
}
