import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminPageHeader,
  SavedNotice,
  savedMessage,
} from "@/components/admin/page-header";
import { Tag } from "@/components/admin/status-badge";
import {
  AdminTable,
  Td,
  Th,
  rowClass,
  stretchedLink,
} from "@/components/admin/table";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { listAdminArticles } from "@/lib/admin/data";
import { formatDate } from "@/lib/admin/labels";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Actualités" };

export default async function ArticlesPage({
  searchParams,
}: PageProps<"/admin/actualites">) {
  const [articles, { ok }] = await Promise.all([
    listAdminArticles(),
    searchParams,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Actualités"
        description="Nouveautés, arrivages et informations pratiques, affichés sur la page Actualités du site."
        actions={
          <ButtonLink href="/admin/actualites/nouveau">
            Rédiger une actualité
          </ButtonLink>
        }
      />
      <SavedNotice message={savedMessage(ok)} />

      {articles.length === 0 ? (
        <EmptyState
          title="Aucune actualité"
          description={
            <p>Rédigez la première : elle apparaîtra dès sa publication.</p>
          }
        />
      ) : (
        <AdminTable
          caption="Actualités"
          head={
            <>
              <Th>Titre</Th>
              <Th>Statut</Th>
              <Th>Date</Th>
            </>
          }
        >
          {articles.map((article) => (
            <tr key={article.id} className={rowClass}>
              <Td>
                <Link
                  href={`/admin/actualites/${article.id}`}
                  className={stretchedLink}
                >
                  {article.title}
                </Link>
              </Td>
              <Td>
                {article.published ? (
                  <Tag tone="positive">Publiée</Tag>
                ) : (
                  <Tag tone="muted">Brouillon</Tag>
                )}
              </Td>
              <Td className="whitespace-nowrap tabular-nums">
                {article.published_at
                  ? formatDate(article.published_at)
                  : `Modifiée le ${formatDate(article.updated_at)}`}
              </Td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}
