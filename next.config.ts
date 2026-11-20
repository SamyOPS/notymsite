import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/catalog/redirects";

/** Photos envoyées depuis l'admin : bucket public « media » du projet Supabase. */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const mediaPattern = supabaseUrl
  ? new URL("/storage/v1/object/public/media/**", supabaseUrl)
  : null;

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects();
  },
  images: {
    remotePatterns: mediaPattern ? [mediaPattern] : [],
    // En local derrière un accès IPv6 avec NAT64, Supabase se résout en
    // 64:ff9b::…, que Next.js classe comme adresse privée et refuse. Autorisé
    // en développement seulement ; la production garde la protection SSRF.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    // Images optimisées gardées 31 jours (4 h par défaut) : moins de
    // transformations Vercel (5 000/mois sur le plan gratuit). Sans risque :
    // une photo remplacée dans l'admin reçoit toujours un nouveau nom.
    minimumCacheTTL: 2678400,
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
