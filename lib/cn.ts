import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge doit connaître les tokens personnalisés : sans cela,
 * `text-h1` (taille) et `text-ink` (couleur) seraient vus comme concurrents
 * et l'un des deux serait supprimé.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "h1",
        "h2",
        "h3",
        "body-lg",
        "body",
        "label",
        "caption",
        "price",
      ],
      color: [
        "surface",
        "surface-raised",
        "surface-inverse",
        "line",
        "line-strong",
        "ink",
        "ink-muted",
        "on-inverse",
        "on-accent",
        "teal",
        "teal-deep",
        "on-teal",
        "teal-soft",
        "wheat",
        "wheat-soft",
        "wheat-ink",
        "success",
        "danger",
        "teal-deep-hover",
        "ink-hover",
        "accent-text",
        "accent-fill",
        "focus",
        "logo-plate",
      ],
      radius: ["sm", "md", "lg", "pill"],
      shadow: ["card", "lift"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
