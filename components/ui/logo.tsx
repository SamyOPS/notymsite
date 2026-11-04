import Image from "next/image";
import logo from "@/public/brand/notym-logo.png";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  /** À activer pour le logo du header (visible dès le chargement). */
  eager?: boolean;
};

/**
 * Logo Notym, jamais redessiné, recoloré ni déformé (ratio conservé).
 * Tant que la version blanche n'est pas fournie, une pastille claire
 * apparaît derrière le logo sur les fonds sombres (variable --logo-plate).
 */
export function Logo({ className, eager }: LogoProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md bg-logo-plate px-2 py-1",
        className,
      )}
    >
      <Image
        src={logo}
        alt="Notym"
        sizes="160px"
        loading={eager ? "eager" : undefined}
        fetchPriority={eager ? "high" : undefined}
        className="h-auto w-full"
      />
    </span>
  );
}
