import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { legalNav, mainNav, site } from "@/lib/site";

const linkClass =
  "inline-flex min-h-11 items-center hover:underline underline-offset-4";

export function SiteFooter() {
  return (
    <footer className="surface-inverse">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
        <div className="flex flex-col items-start gap-4">
          <Logo className="w-36" />
          <p className="max-w-xs text-body">{site.tagline}.</p>
          <p className="text-caption">
            {site.delivery.shipping}.
            <br />
            {site.delivery.pickup}.
          </p>
        </div>

        <nav aria-labelledby="footer-menu">
          <h2
            id="footer-menu"
            className="mb-2 text-label tracking-[0.08em] text-accent-text uppercase"
          >
            Menu
          </h2>
          <ul>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-legal">
          <h2
            id="footer-legal"
            className="mb-2 text-label tracking-[0.08em] text-accent-text uppercase"
          >
            Informations légales
          </h2>
          <ul>
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-2 text-label tracking-[0.08em] text-accent-text uppercase">
            Nous contacter
          </h2>
          <address className="flex flex-col not-italic">
            <span className="py-2">
              {site.contact.streetAddress}
              <br />
              {site.contact.postalCode} {site.contact.city}
            </span>
            <a href={site.contact.phoneHref} className={linkClass}>
              {site.contact.phone}
            </a>
            <a href={`mailto:${site.contact.email}`} className={linkClass}>
              {site.contact.email}
            </a>
            <span className="py-2 text-caption">{site.hours.label}</span>
          </address>
        </div>
      </div>

      <div className="border-t border-current/15">
        <div className="container-site flex flex-wrap items-center justify-between gap-4 py-5 text-caption">
          <p>
            © <CopyrightYear /> {site.name} — Tous droits réservés
          </p>
          {site.social.length > 0 && (
            <ul className="flex gap-2">
              {site.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    className={linkClass}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}

/** L'année courante, mise en cache (Cache Components interdit new Date() non caché). */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
