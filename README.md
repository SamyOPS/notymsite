# Notym — site B2B

Site du grossiste en boissons et snacks Notym (Montataire, 60) : catalogue pour les professionnels et demandes de devis.

- **Stack** : Next.js 16 (App Router, Cache Components), TypeScript strict, Tailwind CSS 4, Supabase, déploiement Vercel.
- **Fonctionnement** : pas de compte client ni de paiement en ligne. Les visiteurs consultent le catalogue (prix « à partir de » HT quand ils sont renseignés) et envoient une demande de devis ou de contact. Seuls les administrateurs se connectent.

## Prérequis

- Node.js 22.12 ou plus récent
- npm
- Supabase CLI et Docker Desktop pour la base locale (à partir de l'étape 5)

## Installation

```bash
npm install
cp .env.example .env.local   # puis remplir les valeurs
npm run dev                  # http://localhost:3000
```

## Scripts

| Commande                          | Rôle                                                 |
| --------------------------------- | ---------------------------------------------------- |
| `npm run dev`                     | Serveur de développement                             |
| `npm run build`                   | Build de production                                  |
| `npm run start`                   | Sert le build de production                          |
| `npm run lint`                    | ESLint                                               |
| `npm run typecheck`               | Génère les types de routes puis lance `tsc --noEmit` |
| `npm run format` / `format:check` | Prettier (avec tri des classes Tailwind)             |
| `npm test`                        | Tests unitaires (Vitest)                             |

## Structure

```
app/              routes (App Router)
components/ui     composants génériques (boutons, champs, badges…)
components/shop   composants catalogue (cartes produit, filtres…)
components/layout header, footer
lib/              utilitaires, accès aux données, validation
public/brand      logo (ne pas redessiner, recolorer ni déformer)
supabase/         migrations SQL et seed (étape 5)
```

## Logo

- `public/brand/notym_logo.png` : fichier source fourni (1024 × 1024, fond transparent).
- `public/brand/notym-logo.png` : même image, recadrée sur sa zone utile (marges transparentes retirées, aucun autre changement). C'est celle qu'utilise le site.
- Version blanche pour fonds sombres : **à fournir**. En attendant, le logo couleur est posé sur une pastille claire sur les fonds sombres.

## Avancement

1. [x] Setup du projet
2. [ ] Tokens et polices
3. [ ] Composants UI
4. [ ] Pages statiques
5. [ ] Catalogue et fiche produit (Supabase)
6. [ ] Demandes de devis et de contact
7. [ ] Back-office
