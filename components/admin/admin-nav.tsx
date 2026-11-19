"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export const adminNav = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/demandes", label: "Demandes" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/marques", label: "Marques" },
  { href: "/admin/actualites", label: "Actualités" },
] as const;

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return href === "/admin"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

/** Navigation de l'admin, défilable horizontalement sur mobile. */
export function AdminNav({ static: isStatic = false }: { static?: boolean }) {
  return isStatic ? <NavList pathname={null} /> : <ActiveNav />;
}

function ActiveNav() {
  return <NavList pathname={usePathname()} />;
}

function NavList({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Administration" className="overflow-x-auto">
      <ul className="container-site flex gap-1">
        {adminNav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-12 items-center border-b-2 px-3 text-label whitespace-nowrap",
                  active
                    ? "border-ink text-ink"
                    : "border-transparent text-ink-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
