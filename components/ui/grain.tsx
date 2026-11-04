import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Motif « grain » : les grains de l'épi du logo, en pills inclinées à ±35°.
 * Décor du hero et des états vides uniquement. Jamais derrière du texte courant.
 */

export type GrainTone = "teal" | "wheat" | "surface" | "ink";
export type GrainSize = "sm" | "md" | "lg" | "xl";

const tones: Record<GrainTone, string> = {
  teal: "bg-teal",
  wheat: "bg-wheat",
  surface: "bg-surface",
  ink: "bg-ink",
};

const sizes: Record<GrainSize, string> = {
  sm: "h-7 w-3",
  md: "h-12 w-5",
  lg: "h-20 w-8",
  xl: "h-32 w-13",
};

type GrainProps = {
  tone?: GrainTone;
  size?: GrainSize;
  angle?: 35 | -35;
  className?: string;
  style?: CSSProperties;
};

export function Grain({
  tone = "teal",
  size = "md",
  angle = 35,
  className,
  style,
}: GrainProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none block rounded-pill",
        angle === 35 ? "rotate-35" : "-rotate-35",
        tones[tone],
        sizes[size],
        className,
      )}
      style={style}
    />
  );
}

type GrainSpec = {
  tone: GrainTone;
  size: GrainSize;
  angle: 35 | -35;
  top: string;
  left: string;
};

const presets: Record<"hero" | "empty" | "placeholder", GrainSpec[]> = {
  hero: [
    { tone: "surface", size: "xl", angle: 35, top: "8%", left: "18%" },
    { tone: "surface", size: "lg", angle: -35, top: "40%", left: "58%" },
    { tone: "wheat", size: "md", angle: 35, top: "64%", left: "22%" },
    { tone: "surface", size: "md", angle: -35, top: "14%", left: "74%" },
    { tone: "ink", size: "sm", angle: 35, top: "78%", left: "70%" },
  ],
  empty: [
    { tone: "teal", size: "lg", angle: 35, top: "6%", left: "34%" },
    { tone: "wheat", size: "md", angle: -35, top: "36%", left: "62%" },
    { tone: "teal", size: "md", angle: -35, top: "52%", left: "16%" },
    { tone: "ink", size: "sm", angle: 35, top: "18%", left: "78%" },
  ],
  placeholder: [
    { tone: "teal", size: "lg", angle: 35, top: "26%", left: "30%" },
    { tone: "teal", size: "md", angle: -35, top: "40%", left: "58%" },
    { tone: "wheat", size: "sm", angle: 35, top: "62%", left: "40%" },
  ],
};

/** Composition de grains positionnés en absolu dans un parent `relative`. */
export function GrainCluster({
  preset,
  className,
}: {
  preset: keyof typeof presets;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {presets[preset].map((grain, index) => (
        <Grain
          key={index}
          tone={grain.tone}
          size={grain.size}
          angle={grain.angle}
          className="absolute"
          style={{ top: grain.top, left: grain.left }}
        />
      ))}
    </div>
  );
}
