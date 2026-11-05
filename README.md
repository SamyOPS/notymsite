# Notym — site B2B

Site du grossiste en boissons et snacks Notym (Montataire, 60) : catalogue pour les professionnels et demandes de devis.

- **Stack** : Next.js 16 (App Router, Cache Components), TypeScript strict, Tailwind CSS 4, déploiement Vercel. Supabase prévu plus tard.
- **Fonctionnement** : pas de compte client ni de paiement en ligne. Le site présente les produits, **sans prix pour l'instant** ; les visiteurs envoient une demande de devis ou de contact. Back-office reporté.

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
| `npm run icons`                   | Régénère favicon et icônes à partir du logo          |

## Structure

```
app/(site)/        pages publiques (header + footer communs)
app/styleguide     tokens et composants (page interne, non indexée)
components/ui      composants génériques (boutons, champs, badges…)
components/shop    composants catalogue (cartes produit, filtres…)
components/layout  header, footer, en-têtes de page
components/forms   champs partagés des formulaires (entreprise, adresse, consentement…)
lib/catalog        données du catalogue et requêtes (seul endroit à changer pour Supabase)
lib/validation     validation des formulaires (SIRET, téléphone…)
lib/site.ts        coordonnées, informations légales, navigation
public/brand       logo (ne pas redessiner, recolorer ni déformer)
```

## Design

Direction sobre et éditoriale, pour éviter l'effet « gabarit » :

- **Bords carrés** partout (cartes, champs, blocs, visuels) ; seul le rayon `rounded-pill` existe, réservé aux boutons et éléments cliquables (bouton « + », pagination, filtres actifs, choix en pilules).
- **Pas d'ombres ni de décors** : la structure passe par des filets (`border-line`, `border-ink` sous les titres de section). Les produits sont présentés dans une grille à filets (`ProductGrid`).
- **Peu d'éléments** : header réduit au logo, à la navigation et au bouton « Devis » ; recherche dans le catalogue ; pas de sur-titres ni d'icônes décoratives.
- **Hero plein écran en trois univers** (`components/home/hero-universes.tsx`) : Boissons à gauche sur toute la hauteur, Épicerie sucrée en haut à droite, Épicerie salée en bas à droite. Chaque panneau est entièrement cliquable. Photo plein cadre (`public/hero/`) sous un voile sombre (`panel-shade`) qui garde le texte blanc lisible ; identique dans les deux thèmes.
- Palette, polices (Bricolage Grotesque, DM Sans), logo et trait sous « livrées vite. » conservés. La page `/styleguide` présente le système.

## Catalogue

En attendant la base de données, le catalogue vient de `lib/catalog/data.ts`. Il est organisé en **trois univers** : Boissons (Sodas & Eaux, Énergisants, Jus & Nectars), Épicerie sucrée (aucun produit pour l'instant) et Épicerie salée (Chips & Snacks). La page d'un univers regroupe les produits de ses catégories ; une catégorie vide affiche « Pas encore de produits en ligne ». Les pages ne lisent que `lib/catalog/queries.ts` (et `lib/catalog/routing.ts` pour les 404) : le passage à Supabase ne touchera que ces fichiers.

- **Filtres dans l'URL** : `/catalogue/sodas-eaux?marque=coca-cola&conditionnement=24&dispo=en-stock&tri=nom&page=2`. La catégorie est dans le chemin, le reste dans la query. Lien partageable, rendu serveur, fonctionne sans JavaScript (formulaires GET).
- **Tri** : les plus commandés (`popularity`), nom, prix croissant (produits « sur devis » en dernier), nouveautés.
- **404** : `proxy.ts` renvoie un vrai statut 404 pour un produit ou une catégorie inconnus (avec le rendu en streaming, la page seule ne le pourrait pas).
- **« Souvent commandés avec »** : affiché pour l'instant comme « Dans la même catégorie », faute d'historique de demandes pour le calculer.

- **Prix masqués** : `site.features.showPrices = false` (`lib/site.ts`). Aucun prix, « Prix sur devis », estimation ni tri par prix n'apparaît. Le code reste en place : passer le réglage à `true` réaffiche les prix « à partir de » HT dès qu'ils sont saisis (`priceFromHtCents`, aujourd'hui `null` partout).
- **Stock non renseigné** : `inStock = null` partout, donc ni badge « En stock » ni filtre « Disponibilité ». Ils réapparaissent dès qu'un produit a un stock connu (`true` ou `false`).
- **À confirmer** : type de contenant (canette, bouteille, poche…), catégorie de chaque produit, format de Perrier (« 35x25 » sur l'ancien site), descriptions et références (SKU). Les photos actuelles sont provisoires (voir « Images »).

## Contenus à confirmer

- Engagements repris du site actuel, regroupés dans `site.claims` (`lib/site.ts`) : « Plus de 400 références », « Livraison en 48 h en France métropolitaine », « Réponse sous 48 h ».
- Pages légales rédigées (mentions légales, CGV, confidentialité) à partir du registre national des entreprises ; données dans `site.legal` (`lib/site.ts`). À faire relire par un conseil juridique avant mise en ligne, notamment les CGV (vente entre professionnels, sur devis) et les durées de conservation.
- Ville du greffe pour la mention « RCS Ville 980 484 190 » : à reporter depuis le Kbis dans `site.legal.rcsCity` (la page affiche sinon « Immatriculée au RCS sous le numéro 980 484 190 »).
- URLs des réseaux sociaux (icônes masquées tant qu'elles manquent).

## Demandes de devis et de contact

- **`/devis`** : la sélection est gardée dans le navigateur (`localStorage`, pas de compte). Parcours en 3 étapes : Sélection (quantités en packs, suppression) → Coordonnées (livraison ou retrait au dépôt ; l'adresse n'est demandée qu'en livraison) → Envoi (relecture, consentement). Le récapitulatif additionne seulement les prix « à partir de » renseignés.
- **`/devenir-client`** : demande de contact ou de devis libre.
- Le serveur revalide tout (SIRET, téléphone, produits encore au catalogue…) et attribue une référence lisible (`D-20261105-7K3F` pour un devis, `C-…` pour un contact).
- Les deux formulaires passent par `lib/requests/deliver.ts`, le seul fichier à modifier pour brancher l'envoi.

Aucun canal d'envoi n'est encore branché (e-mail et base de données à venir) :

- en développement, chaque demande valide est affichée dans la console du serveur ;
- en production, le formulaire indique que l'envoi en ligne n'est pas disponible et renvoie vers le téléphone et l'e-mail (la saisie est conservée). **À brancher avant la mise en ligne.**

## Logo

- `public/brand/notym_logo.png` : fichier source fourni (1024 × 1024, fond transparent).
- `public/brand/notym-logo.png` : même image, recadrée sur sa zone utile (marges transparentes retirées, aucun autre changement). C'est celle qu'utilise le site.
- Pas de version blanche : sur les fonds sombres, le logo couleur est posé sur une pastille claire.
- **Favicon et icônes** (`app/favicon.ico` 16/32/48 px, `app/icon.png` 512 px, `app/apple-icon.png` 180 px) : logo entier centré sur un carré blanc, générés par `npm run icons` (`scripts/generate-icons.mjs`). À relancer si le logo change.

## Images

Toutes les images viennent de sources à licence libre, avec un usage commercial autorisé. Les crédits sont listés dans `lib/image-credits.ts` et affichés dans les mentions légales (section « Crédits photos »). **Toute image ajoutée ou remplacée doit y être reportée.**

- **Produits** (`public/products/<slug>.webp`, 800 × 800, fond blanc) : photos [Open Food Facts](https://fr.openfoodfacts.org) sous licence CC BY-SA 3.0, à créditer, les versions modifiées restant sous la même licence. Seuls des visuels de marque (packshots) déjà sur fond blanc ont été retenus : le fond est rendu blanc pur depuis les bords (l'intérieur du produit n'est pas retouché), puis l'image est recadrée sur le produit et centrée dans un carré, le produit faisant au plus 680 px. Le lien entre un produit et sa photo se fait dans `productImages` (`lib/catalog/data.ts`) ; sans photo, la carte affiche un emplacement neutre.
  - B'lue 33 cl : aucune photo fiable trouvée, laissé sans image.
  - Choix à confirmer : Capri-Sun **Multivitamines** (pack de 10), Lipton Ice Tea **pêche** en canette, Minute Maid **Orange en bouteille** 33 cl (aucun visuel propre de la canette), Perrier en **canette slim 25 cl** (cohérent avec le « 35x25 » de l'ancien site).
  - Les marques et emballages restent la propriété de leurs titulaires. Des packshots fournis par les marques ou pris au dépôt seront préférables à terme.
- **Hero** (`public/hero/`) : photos du domaine public (CC0). Les photos sucrée et salée ne font que 1024 px de large : elles peuvent paraître un peu douces sur grand écran Retina.

## Avancement

1. [x] Setup du projet
2. [x] Tokens et polices
3. [x] Composants UI
4. [x] Pages statiques (accueil, services, devenir client, légales, 404, redirections)
5. [x] Catalogue et fiche produit (données locales)
6. [x] Demandes de devis (page `/devis`) — envoi à brancher
7. [ ] Back-office (reporté : nécessite une base de données)
