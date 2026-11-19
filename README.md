# Notym — site B2B

Site du grossiste en boissons et snacks Notym (Montataire, 60) : catalogue pour les professionnels et demandes de devis.

- **Stack** : Next.js 16 (App Router, Cache Components), TypeScript strict, Tailwind CSS 4, Supabase (base de données, connexion admin, stockage des photos), déploiement Vercel.
- **Fonctionnement** : pas de compte client ni de paiement en ligne. Le site présente les produits, **sans prix pour l'instant** ; les visiteurs envoient une demande de devis ou de contact. L'équipe gère le catalogue, les actualités et les demandes reçues dans l'**espace admin** (`/admin`).

## Prérequis

- Node.js 22.12 ou plus récent
- npm

## Installation

```bash
npm install
cp .env.example .env.local   # puis remplir les valeurs (Supabase obligatoire)
npm run dev                  # http://localhost:3000
```

Le site lit le catalogue dans Supabase, y compris pendant `npm run build` : les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` sont nécessaires partout (local et Vercel). `SUPABASE_SECRET_KEY` sert uniquement à enregistrer les demandes de devis et de contact.

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
app/admin/         espace admin (connexion, catalogue, actualités, demandes)
app/styleguide     tokens et composants (page interne, non indexée)
components/ui      composants génériques (boutons, champs, badges…)
components/shop    composants catalogue (cartes produit, filtres…)
components/layout  header, footer, en-têtes de page
components/forms   champs partagés des formulaires (entreprise, adresse, consentement…)
lib/catalog        lecture du catalogue (Supabase, mis en cache) et contrôle des 404
lib/news           lecture des actualités
lib/admin          admin : droits, validation des formulaires, lectures
lib/supabase       clients Supabase (public, session, secret, navigateur)
supabase/migrations  schéma de la base, sécurité (RLS) et reprise du catalogue
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

Le catalogue est stocké dans Supabase et saisi dans l'admin. Il est organisé en **trois univers** : Boissons (Sodas & Eaux, Énergisants, Jus & Nectars), Épicerie sucrée (aucun produit pour l'instant) et Épicerie salée (Chips & Snacks). La page d'un univers regroupe les produits de ses catégories ; une catégorie vide affiche « Pas encore de produits en ligne ». Les pages ne lisent que `lib/catalog/queries.ts`, qui charge tout le catalogue en une requête mise en cache ; chaque modification dans l'admin rafraîchit ce cache (`updateTag`), le site est donc à jour immédiatement. Un produit décoché « Visible sur le site » disparaît du site sans être supprimé.

- **Filtres dans l'URL** : `/catalogue/sodas-eaux?marque=coca-cola&conditionnement=24&dispo=en-stock&tri=nom&page=2`. La catégorie est dans le chemin, le reste dans la query. Lien partageable, rendu serveur, fonctionne sans JavaScript (formulaires GET).
- **Tri** : les plus commandés (`popularity`), nom, prix croissant (produits « sur devis » en dernier), nouveautés.
- **404** : `proxy.ts` renvoie un vrai statut 404 pour un produit, une catégorie ou une actualité inconnus (avec le rendu en streaming, la page seule ne le pourrait pas). La liste des adresses est gardée une minute en mémoire et rechargée dès qu'une adresse inconnue est demandée (`lib/catalog/known-paths.ts`).
- **Anciennes adresses** : `/product/1` redirige vers la fiche du produit dont `legacy_id` vaut 1 (colonne de la table `products`).
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
- Les deux formulaires passent par `lib/requests/deliver.ts`, qui enregistre la demande dans la table `requests` (avec la clé secrète, après validation : le public ne peut ni lire ni écrire cette table). Elle apparaît aussitôt dans `/admin/demandes`.

Sans `SUPABASE_SECRET_KEY` : en développement, la demande est affichée dans la console du serveur ; en production, le formulaire indique que l'envoi en ligne n'est pas disponible et renvoie vers le téléphone et l'e-mail (la saisie est conservée).

**Pas encore de notification par e-mail** : il faut consulter l'admin pour voir les nouvelles demandes (le tableau de bord affiche leur nombre).

## Logo

- `public/brand/notym_logo.png` : fichier source fourni (1024 × 1024, fond transparent).
- `public/brand/notym-logo.png` : même image, recadrée sur sa zone utile (marges transparentes retirées, aucun autre changement). C'est celle qu'utilise le site.
- Pas de version blanche : sur les fonds sombres, le logo couleur est posé sur une pastille claire.
- **Favicon et icônes** (`app/favicon.ico` 16/32/48 px, `app/icon.png` 512 px, `app/apple-icon.png` 180 px) : logo entier centré sur un carré blanc, générés par `npm run icons` (`scripts/generate-icons.mjs`). À relancer si le logo change.

## Images

Toutes les images viennent de sources à licence libre, avec un usage commercial autorisé. Les crédits sont listés dans `lib/image-credits.ts` et affichés dans les mentions légales (section « Crédits photos »). **Toute image ajoutée ou remplacée doit y être reportée.**

- **Produits** (`public/products/<slug>.webp`, 800 × 800, fond blanc) : photos [Open Food Facts](https://fr.openfoodfacts.org) sous licence CC BY-SA 3.0, à créditer, les versions modifiées restant sous la même licence. Seuls des visuels de marque (packshots) déjà sur fond blanc ont été retenus : le fond est rendu blanc pur depuis les bords (l'intérieur du produit n'est pas retouché), puis l'image est recadrée sur le produit et centrée dans un carré, le produit faisant au plus 680 px. Ces photos sont reliées aux produits repris de l'ancien catalogue (colonne `images`) ; sans photo, la carte affiche un emplacement neutre.
- **Photos envoyées depuis l'admin** : réduites dans le navigateur (1600 px maximum, WebP), puis stockées dans le bucket public `media` de Supabase. Elles ne figurent pas dans `lib/image-credits.ts` : n'envoyez que des photos dont Notym a les droits (prises au dépôt, fournies par les marques).
  - B'lue 33 cl : aucune photo fiable trouvée, laissé sans image.
  - Choix à confirmer : Capri-Sun **Multivitamines** (pack de 10), Lipton Ice Tea **pêche** en canette, Minute Maid **Orange en bouteille** 33 cl (aucun visuel propre de la canette), Perrier en **canette slim 25 cl** (cohérent avec le « 35x25 » de l'ancien site).
  - Les marques et emballages restent la propriété de leurs titulaires. Des packshots fournis par les marques ou pris au dépôt seront préférables à terme.
- **Hero** (`public/hero/`) : trois photos [Unsplash](https://unsplash.com/fr/licence) choisies par Notym (usage commercial libre, crédit facultatif ; photographe de la photo Boissons à compléter), réduites à 1600–2000 px de large.

## Espace admin

`/admin` (non indexé). Connexion par e-mail et mot de passe, réservée aux comptes de la table `admins`.

- **Demandes** : devis et contacts reçus, avec statut (nouvelle, en cours, traitée, archivée) et notes internes.
- **Produits** : fiche complète, photos (la première est la principale), visibilité, disponibilité, badges, mise en avant sur l'accueil, popularité (ordre « Les plus commandés »), prix « à partir de ».
- **Catégories** (univers et catégories, deux niveaux) et **marques**. Une catégorie ou une marque encore utilisée ne peut pas être supprimée.
- **Actualités** : titre, résumé, texte (une ligne vide sépare deux paragraphes), photo de couverture, brouillon ou publiée.

**Sécurité** : la RLS (Row Level Security) protège chaque table ; le public ne lit que ce qui est publié. Chaque page et chaque action de l'admin revérifie les droits (`requireAdmin()`), le proxy ne fait que rafraîchir la session.

### Ajouter un administrateur

1. Supabase > Authentication > Users > **Add user** (e-mail + mot de passe, « Auto Confirm User » coché).
2. SQL Editor :
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'prenom@notym.fr';
   ```
3. Conseillé : Authentication > Sign In / Providers > désactiver **Allow new users to sign up** (un compte créé ailleurs n'aurait de toute façon aucun droit).

Mot de passe oublié : Authentication > Users > « Send password recovery », ou définir un nouveau mot de passe depuis le dashboard.

### Base de données

Le schéma est versionné dans `supabase/migrations/` : tables, règles d'accès (RLS), bucket `media`, et reprise du catalogue initial. Après une migration, régénérer `types/database.ts` (`npx supabase gen types typescript --project-id <ref> > types/database.ts`).

## Avancement

1. [x] Setup du projet
2. [x] Tokens et polices
3. [x] Composants UI
4. [x] Pages statiques (accueil, services, devenir client, légales, 404, redirections)
5. [x] Catalogue et fiche produit (données locales)
6. [x] Demandes de devis (page `/devis`) — envoi à brancher
7. [x] Espace admin et base Supabase (catalogue, actualités, demandes reçues)
8. [ ] Notification e-mail des nouvelles demandes
