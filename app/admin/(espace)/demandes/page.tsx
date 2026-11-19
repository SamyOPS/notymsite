import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminPageHeader,
  SavedNotice,
  savedMessage,
} from "@/components/admin/page-header";
import { RequestStatusBadge } from "@/components/admin/status-badge";
import {
  AdminTable,
  Td,
  Th,
  rowClass,
  stretchedLink,
} from "@/components/admin/table";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/cn";
import { listAdminRequests, type RequestFilter } from "@/lib/admin/data";
import { formatDateTime, requestTypeLabel } from "@/lib/admin/labels";
import { requestStatuses } from "@/lib/admin/schemas";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Demandes reçues" };

const filters: ReadonlyArray<{ value: RequestFilter; label: string }> = [
  { value: "a-traiter", label: "À traiter" },
  ...requestStatuses.map((s) => ({
    value: s.value,
    label: s.label.endsWith("e") ? `${s.label}s` : s.label,
  })),
  { value: "toutes", label: "Toutes" },
];

export default async function RequestsPage({
  searchParams,
}: PageProps<"/admin/demandes">) {
  const params = await searchParams;
  const filter =
    filters.find((f) => f.value === params.statut)?.value ?? "a-traiter";
  const page = Math.max(1, Number(params.page) || 1);
  const { items, total, totalPages } = await listAdminRequests(filter, page);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Demandes reçues"
        description="Demandes de devis et de contact envoyées depuis le site. Changez le statut au fil du traitement."
      />
      <SavedNotice message={savedMessage(params.ok)} />

      <nav aria-label="Filtrer par statut">
        <ul className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <li key={f.value}>
              <Link
                href={
                  f.value === "a-traiter"
                    ? "/admin/demandes"
                    : `/admin/demandes?statut=${f.value}`
                }
                aria-current={f.value === filter ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-pill px-4 text-label",
                  f.value === filter
                    ? "bg-ink text-on-inverse"
                    : "ring-1 ring-line hover:bg-teal-soft",
                )}
              >
                {f.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <p className="text-body text-ink-muted">
        {total} demande{total > 1 ? "s" : ""}
      </p>

      {items.length > 0 && (
        <AdminTable
          caption="Demandes reçues"
          head={
            <>
              <Th>Entreprise</Th>
              <Th>Type</Th>
              <Th>Reçue le</Th>
              <Th>Référence</Th>
              <Th>Statut</Th>
            </>
          }
        >
          {items.map((request) => (
            <tr key={request.id} className={rowClass}>
              <Td>
                <Link
                  href={`/admin/demandes/${request.id}`}
                  className={stretchedLink}
                >
                  {request.company_name}
                </Link>
                <span className="block text-caption text-ink-muted">
                  {request.contact_name}
                </span>
              </Td>
              <Td className="text-caption">{requestTypeLabel(request.type)}</Td>
              <Td className="whitespace-nowrap tabular-nums">
                {formatDateTime(request.received_at)}
              </Td>
              <Td className="font-mono text-caption">{request.reference}</Td>
              <Td>
                <RequestStatusBadge status={request.status} />
              </Td>
            </tr>
          ))}
        </AdminTable>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        pathname="/admin/demandes"
        searchParams={{ statut: params.statut }}
      />
    </div>
  );
}
