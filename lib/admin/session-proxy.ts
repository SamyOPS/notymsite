import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

export const LOGIN_PATH = "/admin/connexion";

/**
 * Rafraîchit la session Supabase d'une requête /admin et réécrit les cookies
 * sur la réponse. Sans session, une page admin (GET) renvoie vers la
 * connexion ; les actions (POST) vérifient elles-mêmes la session.
 */
export async function refreshAdminSession(request: NextRequest) {
  const { url, publishableKey } = supabaseEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  // Ne rien exécuter entre la création du client et getClaims() : c'est cet
  // appel qui vérifie le jeton et le renouvelle si besoin.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  const { pathname, search } = request.nextUrl;

  if (!signedIn && request.method === "GET" && pathname !== LOGIN_PATH) {
    const login = new URL(LOGIN_PATH, request.url);
    login.searchParams.set("suite", `${pathname}${search}`);
    const redirect = NextResponse.redirect(login);
    for (const cookie of response.cookies.getAll()) {
      redirect.cookies.set(cookie);
    }
    return redirect;
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
