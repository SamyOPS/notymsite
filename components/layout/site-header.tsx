import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { MainNav } from "./main-nav";
import { MobileMenu } from "./mobile-menu";
import { QuoteButton } from "./quote-button";

/** En-tête : logo, navigation, bouton « Devis ». Rien d'autre. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="container-site flex h-18 items-center gap-6">
        <Link
          href="/"
          aria-label="Notym, retour à l'accueil"
          className="shrink-0"
        >
          <Logo eager className="w-24 lg:w-28" />
        </Link>

        <MainNav className="hidden lg:block" />

        <div className="ml-auto flex items-center gap-2">
          <QuoteButton />
          <MobileMenu className="lg:hidden" />
        </div>
      </div>
    </header>
  );
}
