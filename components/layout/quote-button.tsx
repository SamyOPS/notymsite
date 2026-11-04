"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { QUOTE_ADDED_EVENT, useQuoteCount } from "@/lib/quote/store";

/** Bouton noir « Devis » avec compteur wheat qui rebondit à chaque ajout. */
export function QuoteButton({ className }: { className?: string }) {
  const count = useQuoteCount();
  const [bounce, setBounce] = useState(0);

  useEffect(() => {
    const onAdded = () => setBounce((n) => n + 1);
    window.addEventListener(QUOTE_ADDED_EVENT, onAdded);
    return () => window.removeEventListener(QUOTE_ADDED_EVENT, onAdded);
  }, []);

  const label =
    count === 0
      ? "Mon devis, aucun produit"
      : `Mon devis, ${count} produit${count > 1 ? "s" : ""}`;

  return (
    <Link
      href="/devis"
      aria-label={label}
      className={cn(
        "relative inline-flex h-11 items-center gap-2 rounded-md bg-ink px-3 font-semibold text-surface transition-colors duration-150 hover:bg-ink-hover sm:px-4",
        className,
      )}
    >
      <ClipboardList aria-hidden className="size-5" />
      <span className="hidden sm:inline">Devis</span>
      {count > 0 && (
        <span
          key={bounce}
          aria-hidden
          className={cn(
            "absolute -top-2 -right-2 inline-flex h-6 min-w-6 items-center justify-center rounded-pill bg-wheat px-1.5 text-caption font-bold text-on-accent tabular-nums",
            bounce > 0 && "animate-cart-bounce",
          )}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
