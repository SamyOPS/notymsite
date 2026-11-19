import { cn } from "@/lib/cn";
import { statusLabel } from "@/lib/admin/labels";

const styles: Record<string, string> = {
  nouveau: "bg-wheat text-on-accent",
  en_cours: "bg-teal-soft text-ink",
  traite: "bg-surface-raised text-success ring-1 ring-inset ring-line",
  archive: "bg-surface-raised text-ink-muted ring-1 ring-inset ring-line",
};

export function RequestStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 text-caption font-semibold whitespace-nowrap",
        styles[status],
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

/** Pastille simple : « Visible », « Masqué », « Brouillon »… */
export function Tag({
  children,
  tone = "neutral",
}: {
  children: string;
  tone?: "neutral" | "positive" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 text-caption font-semibold whitespace-nowrap",
        tone === "positive" && "bg-teal-soft text-success",
        tone === "muted" &&
          "bg-surface-raised text-ink-muted ring-1 ring-line ring-inset",
        tone === "neutral" && "bg-ink text-on-inverse",
      )}
    >
      {children}
    </span>
  );
}
