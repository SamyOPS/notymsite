import { cacheLife } from "next/cache";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";
import { legalNav, mainNav, site } from "@/lib/site";

const linkClass =
  "inline-flex min-h-10 items-center hover:underline underline-offset-4";

/** Pied de page clair, séparé du contenu par un filet. */
export function SiteFooter() {
  return (
    <footer className="border-t border-ink">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-4">
          <Logo className="w-28" />
          <p className="max-w-xs text-body text-ink-muted">
            {site.delivery.shipping}. {site.delivery.pickup}.
          </p>
        </div>

        <FooterColumn title="Menu">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Informations légales">
          {legalNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass}>
                {item.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact">
          <li className="py-2">
            {site.contact.streetAddress}
            <br />
            {site.contact.postalCode} {site.contact.city}
          </li>
          <li>
            <a href={site.contact.phoneHref} className={linkClass}>
              {site.contact.phone}
            </a>
          </li>
          <li>
            <a href={`mailto:${site.contact.email}`} className={linkClass}>
              {site.contact.email}
            </a>
          </li>
          <li className="py-2 text-ink-muted">{site.hours.label}</li>
        </FooterColumn>
      </div>

      <div className="container-site flex flex-wrap justify-between gap-4 border-t border-line py-5 text-caption text-ink-muted">
        <p>
          © <CopyrightYear /> {site.name}
        </p>
        {site.social.length > 0 && (
          <ul className="flex gap-4">
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
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-2 font-sans text-label text-ink">{title}</h2>
      <ul className="text-body">{children}</ul>
    </div>
  );
}

/** L'année courante, mise en cache (Cache Components interdit new Date() non caché). */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
