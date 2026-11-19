"use server";

import { redirect } from "next/navigation";
import { safeNextPath } from "@/lib/admin/next-path";
import { LOGIN_PATH } from "@/lib/admin/session-proxy";
import { createSessionClient } from "@/lib/supabase/server";

export type LoginState = { error?: string; email?: string };

export async function signIn(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("suite"));
  if (!email || !password) {
    return { error: "Indiquez votre e-mail et votre mot de passe.", email };
  }

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) {
    return {
      error:
        error?.status === 429
          ? "Trop de tentatives. Patientez quelques minutes avant de réessayer."
          : "E-mail ou mot de passe incorrect.",
      email,
    };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "Ce compte n'a pas accès à l'administration.", email };
  }

  redirect(next);
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}
