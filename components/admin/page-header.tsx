import { ArrowLeft, CircleCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/** Titre d'une page de l'admin, avec retour éventuel et actions à droite. */
export function AdminPageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: ReactNode;
  back?: { href: string; label: string };
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-ink pb-6">
      {back && (
        <Link
          href={back.href}
          className="inline-flex min-h-11 w-fit items-center gap-2 text-label text-ink-muted underline-offset-4 hover:text-ink hover:underline"
        >
          <ArrowLeft aria-hidden className="size-4" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-h2">{title}</h1>
          {description && (
            <div className="max-w-2xl text-body text-ink-muted">
              {description}
            </div>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </header>
  );
}

/** Confirmation après un enregistrement (lue depuis l'URL : ?ok=…). */
export function SavedNotice({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="status"
      className="flex items-center gap-2 bg-teal-soft p-4 text-body font-semibold text-success"
    >
      <CircleCheck aria-hidden className="size-5 shrink-0" />
      {message}
    </p>
  );
}

/** Messages de confirmation, par valeur du paramètre ?ok=. */
export const savedMessages: Record<string, string> = {
  cree: "Élément créé.",
  enregistre: "Modifications enregistrées.",
  supprime: "Élément supprimé.",
};

export function savedMessage(
  value: string | string[] | undefined,
): string | null {
  return typeof value === "string" ? (savedMessages[value] ?? null) : null;
}
