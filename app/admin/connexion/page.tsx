import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { safeNextPath } from "@/lib/admin/next-path";
import { createSessionClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage({
  searchParams,
}: PageProps<"/admin/connexion">) {
  return (
    <main className="container-site grid min-h-dvh place-items-center py-12">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col items-start gap-4">
          <Logo eager className="w-28" />
          <h1 className="text-h2">Administration</h1>
        </div>
        <Suspense fallback={<div className="min-h-72" />}>
          <LoginGate searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

/** Déjà connecté : on passe directement à l'admin (ou on signale l'absence de droits). */
async function LoginGate({
  searchParams,
}: Pick<PageProps<"/admin/connexion">, "searchParams">) {
  const next = safeNextPath((await searchParams).suite);
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (userId) {
    const { data: admin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (admin) redirect(next);
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-body-lg">
          Le compte <strong>{String(data.claims.email ?? "connecté")}</strong>{" "}
          n&apos;a pas accès à l&apos;administration.
        </p>
        <form action={signOut}>
          <Button type="submit" variant="secondary">
            Changer de compte
          </Button>
        </form>
      </div>
    );
  }

  return <LoginForm next={next} />;
}
