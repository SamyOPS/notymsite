import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Tableau de l'admin, défilable horizontalement sur petit écran. */
export function AdminTable({
  caption,
  head,
  children,
}: {
  caption: string;
  head: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-body">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-ink text-label text-ink-muted">
            {head}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <th scope="col" className={cn("px-3 py-3 font-semibold", className)}>
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-3 py-3 align-middle", className)}>{children}</td>
  );
}

/** Ligne entièrement cliquable grâce au lien étiré de sa première cellule. */
export const rowClass =
  "relative border-b border-line hover:bg-teal-soft/50 has-[a:focus-visible]:bg-teal-soft/50";

export const stretchedLink =
  "font-semibold underline-offset-4 hover:underline after:absolute after:inset-0 focus-visible:outline-none";
