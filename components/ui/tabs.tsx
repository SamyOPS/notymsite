"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type Tab = { id: string; label: string; content: ReactNode };

/**
 * Onglets accessibles (motif WAI-ARIA) : flèches gauche/droite, Début/Fin,
 * un seul onglet dans l'ordre de tabulation.
 */
export function Tabs({
  tabs,
  label,
  className,
}: {
  tabs: Tab[];
  label: string;
  className?: string;
}) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusTab(index: number) {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const keys: Record<string, () => void> = {
      ArrowRight: () => focusTab(active + 1),
      ArrowLeft: () => focusTab(active - 1),
      Home: () => focusTab(0),
      End: () => focusTab(tabs.length - 1),
    };
    const action = keys[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className="flex gap-2 border-b border-line"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-onglet-${tab.id}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panneau-${tab.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={onKeyDown}
            className={cn(
              "relative -mb-px inline-flex min-h-12 items-center px-4 text-body font-semibold transition-colors",
              "after:absolute after:inset-x-2 after:bottom-0 after:h-[3px] after:rounded-pill after:bg-accent-fill",
              index === active
                ? "text-ink after:opacity-100"
                : "text-ink-muted after:opacity-0 hover:text-ink",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panneau-${tab.id}`}
          aria-labelledby={`${baseId}-onglet-${tab.id}`}
          hidden={index !== active}
          tabIndex={0}
          className="pt-6 focus-visible:outline-offset-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
