import type { Metadata } from "next";
import Link from "next/link";
import { RequestStatusBadge } from "@/components/admin/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { getDashboard } from "@/lib/admin/data";
import { formatDateTime, requestTypeLabel } from "@/lib/admin/labels";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function DashboardPage() {
  const data = await getDashboard();

  const stats = [
    {
      href: "/admin/demandes",
      value: data.newRequests,
      label: data.newRequests > 1 ? "nouvelles demandes" : "nouvelle demande",
    },
    {
      href: "/admin/produits",
      value: data.products,
      label:
        data.hiddenProducts > 0
          ? `produits, dont ${data.hiddenProducts} masqué${data.hiddenProducts > 1 ? "s" : ""}`
          : "produits",
    },
    {
      href: "/admin/actualites",
      value: data.publishedArticles,
      label:
        data.publishedArticles > 1
          ? "actualités publiées"
          : "actualité publiée",
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-6">
        <h1 className="text-h2">Tableau de bord</h1>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/admin/produits/nouveau">
            Ajouter un produit
          </ButtonLink>
          <ButtonLink href="/admin/actualites/nouveau" variant="secondary">
            Rédiger une actualité
          </ButtonLink>
        </div>
      </header>

      <ul className="grid gap-px bg-line sm:grid-cols-3">
        {stats.map((stat) => (
          <li key={stat.href} className="relative bg-surface p-6">
            <p className="font-display text-h1 tabular-nums">{stat.value}</p>
            <Link
              href={stat.href}
              className="mt-1 block text-body text-ink-muted underline-offset-4 after:absolute after:inset-0 hover:text-ink hover:underline"
            >
              {stat.label}
            </Link>
          </li>
        ))}
      </ul>

      <section
        aria-labelledby="dernieres-demandes"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink pb-3">
          <h2 id="dernieres-demandes" className="text-h3">
            Dernières demandes
          </h2>
          <Link
            href="/admin/demandes"
            className="text-label underline underline-offset-4"
          >
            Toutes les demandes
          </Link>
        </div>
        {data.latestRequests.length === 0 ? (
          <p className="text-body text-ink-muted">
            Aucune demande pour le moment. Les demandes de devis et de contact
            envoyées depuis le site apparaîtront ici.
          </p>
        ) : (
          <ul>
            {data.latestRequests.map((request) => (
              <li
                key={request.id}
                className="relative flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line py-3 hover:bg-teal-soft/50"
              >
                <RequestStatusBadge status={request.status} />
                <Link
                  href={`/admin/demandes/${request.id}`}
                  className="font-semibold underline-offset-4 after:absolute after:inset-0 hover:underline"
                >
                  {request.company_name}
                </Link>
                <span className="text-caption text-ink-muted">
                  {requestTypeLabel(request.type)} ·{" "}
                  {formatDateTime(request.received_at)} · {request.reference}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
