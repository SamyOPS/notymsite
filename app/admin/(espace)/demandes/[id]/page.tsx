import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { DeleteForm } from "@/components/admin/form-ui";
import {
  AdminPageHeader,
  SavedNotice,
  savedMessage,
} from "@/components/admin/page-header";
import { RequestStatusBadge } from "@/components/admin/status-badge";
import { getAdminRequest } from "@/lib/admin/data";
import {
  establishmentLabel,
  formatDateTime,
  receptionLabel,
  requestTypeLabel,
} from "@/lib/admin/labels";
import { formatPrice } from "@/lib/format";
import { deleteRequest, updateRequest } from "../actions";
import { RequestForm } from "./request-form";

// Dépend de la session : rendue à chaque requête (voir le layout).
export const instant = false;

export const metadata: Metadata = { title: "Demande" };

type Details = Partial<Record<string, string>>;
type Line = {
  slug?: string;
  name?: string;
  packLabel?: string;
  quantity?: number;
  priceFromHtCents?: number | null;
};

export default async function RequestPage({
  params,
  searchParams,
}: PageProps<"/admin/demandes/[id]">) {
  const { id } = await params;
  const request = await getAdminRequest(id);
  if (!request) notFound();
  const { ok } = await searchParams;

  const details = (request.details ?? {}) as Details;
  const lines = (Array.isArray(request.lines) ? request.lines : []) as Line[];
  const address = [
    details.addressLine,
    [details.postalCode, details.city].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  const rows: Array<[string, ReactNode]> = [
    ["Type", requestTypeLabel(request.type, details.kind)],
    ["Reçue le", formatDateTime(request.received_at)],
    ["Établissement", establishmentLabel(details.establishmentType)],
    ["Raison sociale", request.company_name],
    ["SIRET", details.siret],
    ["Contact", request.contact_name],
    [
      "Téléphone",
      <a
        key="tel"
        href={`tel:${request.phone}`}
        className="underline underline-offset-4"
      >
        {request.phone}
      </a>,
    ],
    [
      "E-mail",
      <a
        key="mail"
        href={`mailto:${request.email}?subject=${encodeURIComponent(`Votre demande ${request.reference}`)}`}
        className="underline underline-offset-4"
      >
        {request.email}
      </a>,
    ],
    ["Réception", receptionLabel(details.receptionMode)],
    ["Adresse", address || undefined],
    ["Code de réduction", details.discountCode],
  ];

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title={`${request.company_name}`}
        description={
          <span className="flex flex-wrap items-center gap-3">
            <RequestStatusBadge status={request.status} />
            <span className="font-mono">{request.reference}</span>
          </span>
        }
        back={{ href: "/admin/demandes", label: "Demandes reçues" }}
      />
      <SavedNotice message={savedMessage(ok)} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-10">
          <dl className="grid grid-cols-[minmax(0,11rem)_1fr] gap-x-6 text-body">
            {rows
              .filter(([, value]) => value !== undefined && value !== "")
              .map(([term, value]) => (
                <div
                  key={term}
                  className="col-span-2 grid grid-cols-subgrid border-b border-line py-3"
                >
                  <dt className="text-ink-muted">{term}</dt>
                  <dd className="font-semibold break-words">{value}</dd>
                </div>
              ))}
          </dl>

          {details.message && (
            <section
              aria-labelledby="message-titre"
              className="flex flex-col gap-3"
            >
              <h2 id="message-titre" className="text-h3">
                Message
              </h2>
              <p className="text-body whitespace-pre-line">{details.message}</p>
            </section>
          )}

          {lines.length > 0 && (
            <section
              aria-labelledby="produits-titre"
              className="flex flex-col gap-3"
            >
              <h2 id="produits-titre" className="text-h3">
                Produits demandés
              </h2>
              <ul className="border-t border-ink">
                {lines.map((line, index) => (
                  <li
                    key={`${line.slug}-${index}`}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-3"
                  >
                    <span>
                      <a
                        href={`/produit/${line.slug}`}
                        target="_blank"
                        className="font-semibold underline-offset-4 hover:underline"
                      >
                        {line.name}
                      </a>
                      <span className="block text-caption text-ink-muted">
                        {line.packLabel}
                        {typeof line.priceFromHtCents === "number" &&
                          ` · à partir de ${formatPrice(line.priceFromHtCents)} HT`}
                      </span>
                    </span>
                    <span className="font-semibold tabular-nums">
                      {line.quantity} pack{(line.quantity ?? 0) > 1 ? "s" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-8">
          <RequestForm
            action={updateRequest.bind(null, request.id)}
            initial={{ status: request.status, notes: request.notes }}
          />
          <div className="border-t border-line pt-6">
            <DeleteForm
              action={deleteRequest.bind(null, request.id)}
              confirmMessage={`Supprimer définitivement la demande ${request.reference} ? Préférez « Archivée » pour la garder.`}
              label="Supprimer la demande"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
