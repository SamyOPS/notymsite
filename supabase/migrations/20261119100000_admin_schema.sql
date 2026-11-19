-- Espace admin Notym : catalogue, actualités, demandes reçues.
--
-- Sécurité (Row Level Security partout) :
-- - le public (clé publishable) lit les catégories, les marques, les produits
--   visibles et les actualités publiées ; il n'écrit rien ;
-- - les administrateurs (table admins) lisent et modifient tout ;
-- - les demandes de devis et de contact sont enregistrées par le serveur du
--   site avec la clé secrète (qui ignore la RLS), après validation : le public
--   ne peut ni les lire ni en créer directement.

create schema if not exists private;

-- ---------------------------------------------------------------------------
-- Administrateurs
-- ---------------------------------------------------------------------------

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is
  'Comptes autorisés dans /admin. Ajouter un compte : créer l''utilisateur dans Authentication, puis insérer son id ici.';

alter table public.admins enable row level security;

-- Un administrateur peut vérifier sa propre appartenance (rien d'autre).
create policy "admins: lecture de sa propre ligne"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()));

-- Dans un schéma non exposé par l'API : appelable seulement depuis les policies.
create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  description text not null default '' check (char_length(description) <= 300),
  -- null = univers (Boissons, Épicerie sucrée…), sinon catégorie d'un univers.
  parent_id uuid references public.categories (id) on delete restrict,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (parent_id is distinct from id)
);

comment on table public.categories is
  'Deux niveaux : univers (parent_id null) et catégories rattachées à un univers.';

create index categories_parent_id_idx on public.categories (parent_id);

-- Deux niveaux au plus : le parent doit être un univers, et un univers qui a
-- des catégories ne peut pas devenir lui-même une catégorie.
create function private.check_category_depth()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.parent_id is not null then
    if exists (
      select 1 from public.categories
      where id = new.parent_id and parent_id is not null
    ) then
      raise exception 'Le parent doit être un univers (premier niveau).'
        using errcode = 'check_violation';
    end if;
    if exists (select 1 from public.categories where parent_id = new.id) then
      raise exception 'Cet univers contient des catégories : il ne peut pas être rattaché à un autre.'
        using errcode = 'check_violation';
    end if;
  end if;
  return new;
end;
$$;

create trigger categories_check_depth
  before insert or update of parent_id on public.categories
  for each row execute function private.check_category_depth();

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 100),
  sku text unique check (char_length(sku) <= 50),
  name text not null check (char_length(btrim(name)) between 1 and 150),
  brand_id uuid references public.brands (id) on delete restrict,
  category_id uuid not null references public.categories (id) on delete restrict,
  -- Contenance unitaire : « 33 cl », « 1,5 L »
  volume text check (char_length(volume) <= 30),
  units_per_pack integer check (units_per_pack between 1 and 9999),
  -- Conditionnement affiché : « Pack de 24 »
  pack_label text not null check (char_length(btrim(pack_label)) between 1 and 60),
  description text check (char_length(description) <= 5000),
  -- URL des photos, la première est la photo principale.
  images text[] not null default '{}',
  is_best_seller boolean not null default false,
  is_new boolean not null default false,
  is_promo boolean not null default false,
  -- true = en stock, false = rupture, null = non renseigné (rien n'est affiché)
  in_stock boolean,
  -- Mis en avant sur l'accueil
  featured boolean not null default false,
  popularity integer not null default 0,
  -- Prix « à partir de » HT en centimes ; null = « Prix sur devis »
  price_from_ht_cents integer check (price_from_ht_cents >= 0),
  -- Identifiant sur l'ancien site (/product/1), pour les redirections 301
  legacy_id integer unique,
  -- false = masqué sur le site (brouillon, produit retiré…)
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_brand_id_idx on public.products (brand_id);
create index products_category_id_idx on public.products (category_id);

-- ---------------------------------------------------------------------------
-- Actualités
-- ---------------------------------------------------------------------------

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 100),
  title text not null check (char_length(btrim(title)) between 1 and 150),
  -- Résumé affiché dans la liste et en description pour les moteurs de recherche
  excerpt text not null default '' check (char_length(excerpt) <= 300),
  -- Texte brut : les paragraphes sont séparés par une ligne vide.
  content text not null default '' check (char_length(content) <= 50000),
  cover_url text,
  cover_alt text not null default '' check (char_length(cover_alt) <= 200),
  published boolean not null default false,
  -- Date affichée ; renseignée à la première publication.
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not published or published_at is not null)
);

create index articles_published_idx on public.articles (published_at desc)
  where published;

-- ---------------------------------------------------------------------------
-- Demandes reçues (devis et contact)
-- ---------------------------------------------------------------------------

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  -- Référence communiquée au client : D-20261105-7K3F
  reference text not null unique,
  type text not null check (type in ('devis', 'contact')),
  status text not null default 'nouveau'
    check (status in ('nouveau', 'en_cours', 'traite', 'archive')),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  -- Formulaire complet, tel que validé par le serveur
  details jsonb not null,
  -- Devis : produits et quantités au moment de la demande
  lines jsonb not null default '[]',
  -- Notes internes de l'équipe
  notes text not null default '' check (char_length(notes) <= 5000),
  received_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index requests_status_received_idx
  on public.requests (status, received_at desc);
create index requests_received_idx on public.requests (received_at desc);

-- ---------------------------------------------------------------------------
-- updated_at automatique
-- ---------------------------------------------------------------------------

create trigger categories_updated_at before update on public.categories
  for each row execute function private.set_updated_at();
create trigger brands_updated_at before update on public.brands
  for each row execute function private.set_updated_at();
create trigger products_updated_at before update on public.products
  for each row execute function private.set_updated_at();
create trigger articles_updated_at before update on public.articles
  for each row execute function private.set_updated_at();
create trigger requests_updated_at before update on public.requests
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- Droits d'accès à l'API (explicites : les projets récents ne les accordent
-- plus automatiquement). La RLS ci-dessous filtre ensuite ligne par ligne.
-- ---------------------------------------------------------------------------

grant select on public.categories, public.brands, public.products, public.articles
  to anon, authenticated;
grant insert, update, delete
  on public.categories, public.brands, public.products, public.articles
  to authenticated;
grant select, update, delete on public.requests to authenticated;
grant select on public.admins to authenticated;
grant all
  on public.admins, public.categories, public.brands, public.products,
     public.articles, public.requests
  to service_role;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.articles enable row level security;
alter table public.requests enable row level security;

-- Lecture publique
create policy "categories: lecture publique"
  on public.categories for select to anon, authenticated
  using (true);

create policy "brands: lecture publique"
  on public.brands for select to anon, authenticated
  using (true);

create policy "products: produits visibles, ou tout pour un admin"
  on public.products for select to anon, authenticated
  using (published or (select private.is_admin()));

create policy "articles: articles publiés, ou tout pour un admin"
  on public.articles for select to anon, authenticated
  using (published or (select private.is_admin()));

create policy "requests: lecture admin"
  on public.requests for select to authenticated
  using ((select private.is_admin()));

-- Écriture réservée aux administrateurs
create policy "categories: création admin" on public.categories
  for insert to authenticated with check ((select private.is_admin()));
create policy "categories: modification admin" on public.categories
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "categories: suppression admin" on public.categories
  for delete to authenticated using ((select private.is_admin()));

create policy "brands: création admin" on public.brands
  for insert to authenticated with check ((select private.is_admin()));
create policy "brands: modification admin" on public.brands
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "brands: suppression admin" on public.brands
  for delete to authenticated using ((select private.is_admin()));

create policy "products: création admin" on public.products
  for insert to authenticated with check ((select private.is_admin()));
create policy "products: modification admin" on public.products
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "products: suppression admin" on public.products
  for delete to authenticated using ((select private.is_admin()));

create policy "articles: création admin" on public.articles
  for insert to authenticated with check ((select private.is_admin()));
create policy "articles: modification admin" on public.articles
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "articles: suppression admin" on public.articles
  for delete to authenticated using ((select private.is_admin()));

-- Demandes : pas de création côté public (le serveur utilise la clé secrète).
create policy "requests: modification admin" on public.requests
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "requests: suppression admin" on public.requests
  for delete to authenticated using ((select private.is_admin()));

-- ---------------------------------------------------------------------------
-- Stockage des photos (produits, actualités)
-- ---------------------------------------------------------------------------

-- Bucket public : les photos sont servies par URL publique, sans policy de
-- lecture (ce qui empêche aussi de lister le contenu du bucket).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880, -- 5 Mo (les photos sont réduites dans le navigateur avant l'envoi)
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do nothing;

create policy "media: lecture admin"
  on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
create policy "media: envoi admin"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select private.is_admin()));
create policy "media: modification admin"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
create policy "media: suppression admin"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
