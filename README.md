# Notym — site B2B

Site du grossiste en boissons et snacks Notym (Montataire, 60) : catalogue pour les professionnels et demandes de devis.

- **Stack** : Next.js 16 (App Router, Cache Components), TypeScript strict, Tailwind CSS 4, déploiement Vercel. Supabase prévu plus tard.
- **Fonctionnement** : pas de compte client ni de paiement en ligne. Les visiteurs consultent le catalogue (prix « à partir de » HT quand ils sont renseignés, sinon « Prix sur devis ») et envoient une demande de devis ou de contact. Seuls les administrateurs se connecteront.

## Prérequis

- Node.js 22.12 ou plus récent
- npm

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
app/(site)/        pages publiques (header + footer communs)
app/styleguide     tokens et composants (page interne, non indexée)
components/ui      composants génériques (boutons, champs, badges…)
components/shop    composants catalogue (cartes produit, filtres…)
components/layout  header, footer, en-têtes de page
lib/catalog        données du catalogue et requêtes (seul endroit à changer pour Supabase)
lib/validation     validation des formulaires (SIRET, téléphone…)
lib/site.ts        coordonnées, informations légales, navigation
public/brand       logo (ne pas redessiner, recolorer ni déformer)
```

## Catalogue

En attendant la base de données, le catalogue vient de `lib/catalog/data.ts`. Les pages ne lisent que `lib/catalog/queries.ts` (et `lib/catalog/routing.ts` pour les 404) : le passage à Supabase ne touchera que ces fichiers.

- **Filtres dans l'URL** : `/catalogue/sodas-eaux?marque=coca-cola&conditionnement=24&dispo=en-stock&tri=nom&page=2`. La catégorie est dans le chemin, le reste dans la query. Lien partageable, rendu serveur, fonctionne sans JavaScript (formulaires GET).
- **Tri** : les plus commandés (`popularity`), nom, prix croissant (produits « sur devis » en dernier), nouveautés.
- **404** : `proxy.ts` renvoie un vrai statut 404 pour un produit ou une catégorie inconnus (avec le rendu en streaming, la page seule ne le pourrait pas).
- **« Souvent commandés avec »** : affiché pour l'instant comme « Dans la même catégorie », faute d'historique de demandes pour le calculer.

- **Aucun prix réel** : tous les prix valent `null` et s'affichent « Prix sur devis ».
- **À confirmer** : type de contenant (canette, bouteille, poche…), catégorie de chaque produit, format de Perrier (« 35x25 » sur l'ancien site), descriptions, photos et références (SKU).

## Contenus à confirmer

- Engagements repris du site actuel, regroupés dans `site.claims` (`lib/site.ts`) : « Plus de 400 références », « Livraison en 48 h en France métropolitaine », « Réponse sous 48 h ».
- Mentions légales : numéro RCS et directeur de la publication (absents du site actuel).
- CGV et politique de confidentialité : gabarits, les passages « À compléter » sont visibles sur le site.
- URLs des réseaux sociaux (icônes masquées tant qu'elles manquent).

## Formulaire « Devenir client »

Aucun canal d'envoi n'est encore branché (e-mail et base de données à venir) :

- en développement, chaque demande valide est affichée dans la console du serveur ;
- en production, le formulaire indique que l'envoi en ligne n'est pas disponible et renvoie vers le téléphone et l'e-mail. **À brancher avant la mise en ligne.**

## Logo

- `public/brand/notym_logo.png` : fichier source fourni (1024 × 1024, fond transparent).
- `public/brand/notym-logo.png` : même image, recadrée sur sa zone utile (marges transparentes retirées, aucun autre changement). C'est celle qu'utilise le site.
- Pas de version blanche : sur les fonds sombres, le logo couleur est posé sur une pastille claire.

## Avancement

1. [x] Setup du projet
2. [x] Tokens et polices
3. [x] Composants UI
4. [x] Pages statiques (accueil, services, devenir client, légales, 404, redirections)
5. [x] Catalogue et fiche produit (données locales)
6. [ ] Demandes de devis (page `/devis`) et envoi
7. [ ] Back-office
