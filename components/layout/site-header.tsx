import { Clock, Phone, Truck } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { site } from "@/lib/site";
import { MainNav } from "./main-nav";
import { MobileMenu } from "./mobile-menu";
import { QuoteButton } from "./quote-button";
import { SearchForm } from "./search-form";

export function SiteHeader() {
  return (
    <>
      {/* Bandeau d'infos (défile avec la page) */}
      <div className="surface-inverse text-caption">
        <div className="container-site flex min-h-11 items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <Truck aria-hidden className="size-4 shrink-0 text-accent-fill" />
            <span>
              {site.delivery.shipping}
              <span className="hidden md:inline">
                {" "}
                · {site.delivery.pickup}
              </span>
            </span>
          </p>
          <div className="flex items-center gap-6">
            <p className="hidden items-center gap-2 lg:flex">
              <Clock aria-hidden className="size-4 text-accent-fill" />
              {site.hours.label}
            </p>
            <a
              href={site.contact.phoneHref}
              className="inline-flex min-h-11 items-center gap-2 font-semibold hover:underline"
            >
              <Phone aria-hidden className="size-4 text-accent-fill" />
              <span className="sr-only">Téléphone : </span>
              {site.contact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Barre principale, collante */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
        <div className="container-site flex h-20 items-center gap-4">
          <Link
            href="/"
            aria-label="Notym, retour à l'accueil"
            className="shrink-0 rounded-md"
          >
            <Logo eager className="w-28 lg:w-32" />
          </Link>

          <MainNav className="ml-4 hidden xl:block" />

          <div className="ml-auto flex items-center gap-3">
            <SearchForm
              id="recherche"
              className="hidden w-56 md:block lg:w-64"
            />
            <QuoteButton />
            <MobileMenu className="xl:hidden" />
          </div>
        </div>
      </header>
    </>
  );
}
