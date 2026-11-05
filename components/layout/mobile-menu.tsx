"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { mainNav, site } from "@/lib/site";
import { isActive } from "./main-nav";

/**
 * Menu (mobile et tablette) dans un <dialog> natif : piège du focus,
 * fermeture par Échap et retour du focus au bouton gérés par le navigateur.
 */
export function MobileMenu({ className }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  // Ferme le menu après une navigation.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const close = () => dialogRef.current?.close();

  return (
    <div className={className}>
      <button
        type="button"
        aria-label="Ouvrir le menu"
        aria-haspopup="dialog"
        aria-controls="menu-mobile"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex size-11 items-center justify-center rounded-pill text-ink transition-colors hover:bg-teal-soft"
      >
        <Menu aria-hidden className="size-6" />
      </button>

      <dialog
        ref={dialogRef}
        id="menu-mobile"
        aria-label="Menu"
        onClick={(event) => {
          // Clic sur le fond (hors panneau) : fermeture.
          if (event.target === event.currentTarget) close();
        }}
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-surface p-0 text-ink backdrop:bg-ink/50"
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-8">
          <div className="flex h-18 items-center justify-end">
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={close}
              className="inline-flex size-11 items-center justify-center rounded-pill transition-colors hover:bg-teal-soft"
            >
              <X aria-hidden className="size-6" />
            </button>
          </div>

          <nav aria-label="Navigation principale">
            <ul className="border-t border-line">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-16 items-center font-display text-h3",
                        active &&
                          "underline decoration-accent-fill decoration-[3px] underline-offset-8",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-1 pt-10 text-body">
            <a
              href={site.contact.phoneHref}
              className="inline-flex min-h-11 items-center font-semibold"
            >
              {site.contact.phone}
            </a>
            <a
              href={`mailto:${site.contact.email}`}
              className="inline-flex min-h-11 items-center"
            >
              {site.contact.email}
            </a>
            <p className="text-caption text-ink-muted">{site.hours.label}</p>
          </div>
        </div>
      </dialog>
    </div>
  );
}
