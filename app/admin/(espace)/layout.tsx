import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { Logo } from "@/components/ui/logo";
import { getAdmin } from "@/lib/admin/auth";
import { signOut } from "../connexion/actions";

/**
 * Cadre de l'admin. Ce layout n'est pas une barrière de sécurité : chaque
 * page et chaque action appelle requireAdmin(), et la RLS protège les données.
 *
 * Toutes les pages dépendent de la session : chacune déclare
 * `instant = false` (rendue à chaque requête, navigation non instantanée
 * assumée) ; loading.tsx affiche « Chargement… » pendant l'attente.
 */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line bg-surface">
        <div className="container-site flex min-h-16 flex-wrap items-center gap-x-6 gap-y-2 py-2">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo eager className="w-20" />
            <span className="text-label text-ink-muted">Administration</span>
          </Link>
          <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-11 items-center gap-1.5 text-label underline-offset-4 hover:underline"
            >
              Voir le site
              <ExternalLink aria-hidden className="size-4" />
              <span className="sr-only">(nouvel onglet)</span>
            </Link>
            <Suspense fallback={null}>
              <Account />
            </Suspense>
          </div>
        </div>
        <Suspense fallback={<AdminNav static />}>
          <AdminNav />
        </Suspense>
      </header>
      {/* L'état de chargement des pages est dans loading.tsx. */}
      <main className="container-site flex-1 py-8 lg:py-10">{children}</main>
    </div>
  );
}

async function Account() {
  const admin = await getAdmin();
  if (!admin) return null;
  return (
    <form action={signOut} className="flex items-center gap-3">
      {admin.email && (
        <span className="hidden text-caption text-ink-muted sm:inline">
          {admin.email}
        </span>
      )}
      <button
        type="submit"
        className="inline-flex min-h-11 items-center gap-1.5 text-label underline-offset-4 hover:underline"
      >
        <LogOut aria-hidden className="size-4" />
        Se déconnecter
      </button>
    </form>
  );
}
