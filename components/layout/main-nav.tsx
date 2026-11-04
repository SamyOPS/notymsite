"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { mainNav } from "@/lib/site";

/** Le catalogue reste actif sur les fiches produit. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/catalogue") {
    return pathname.startsWith("/catalogue") || pathname.startsWith("/produit");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Navigation principale (desktop), état actif souligné teal. */
export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigation principale" className={className}>
      <ul className="flex items-center gap-1">
        {mainNav.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-11 items-center px-3 text-body font-medium text-ink transition-colors hover:text-teal-deep",
                  "after:absolute after:inset-x-3 after:bottom-1 after:h-[3px] after:rounded-pill after:bg-accent-fill after:transition-opacity",
                  active
                    ? "font-semibold after:opacity-100"
                    : "after:opacity-0",
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
