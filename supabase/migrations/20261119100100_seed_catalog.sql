-- Reprise du catalogue local (lib/catalog/data.ts, 04/11/2026).
-- Aucun prix ni stock renseigné. Les photos existantes restent servies par le
-- site (/products/…) ; les nouvelles photos sont envoyées dans le bucket media.

insert into public.categories (slug, name, description, sort) values
  ('boissons', 'Boissons', 'Sodas, eaux, énergisants, jus et nectars', 1),
  ('epicerie-sucree', 'Épicerie sucrée', 'Produits sucrés pour les commerces et la restauration', 5),
  ('epicerie-salee', 'Épicerie salée', 'Chips, snacks et produits salés', 6);

insert into public.categories (slug, name, description, sort, parent_id)
select v.slug, v.name, v.description, v.sort, p.id
from (values
  ('sodas-eaux', 'Sodas & Eaux', 'Coca-Cola, Pepsi, Evian, Badoit', 2, 'boissons'),
  ('energisants', 'Énergisants', 'Red Bull, Monster', 3, 'boissons'),
  ('jus-nectars', 'Jus & Nectars', 'Tropicana, Oasis, Innocent', 4, 'boissons'),
  ('chips-snacks', 'Chips & Snacks', 'Lay''s, Brets', 7, 'epicerie-salee')
) as v (slug, name, description, sort, parent_slug)
join public.categories p on p.slug = v.parent_slug;

insert into public.brands (slug, name) values
  ('coca-cola', 'Coca-Cola'),
  ('pepsi', 'Pepsi'),
  ('orangina', 'Orangina'),
  ('oasis', 'Oasis'),
  ('lipton', 'Lipton'),
  ('cristaline', 'Cristaline'),
  ('mogu-mogu', 'Mogu Mogu'),
  ('powerade', 'Powerade'),
  ('red-bull', 'Red Bull'),
  ('blue', 'B''lue'),
  ('hawai', 'Hawaï'),
  ('capri-sun', 'Capri-Sun'),
  ('minute-maid', 'Minute Maid'),
  ('perrier', 'Perrier');

insert into public.products (
  slug, name, brand_id, category_id, volume, units_per_pack, pack_label,
  images, featured, legacy_id, popularity, created_at
)
select
  v.slug, v.name, b.id, c.id, v.volume, v.units_per_pack, v.pack_label,
  v.images, true, v.legacy_id,
  -- Conserve l'ordre d'affichage actuel (« les plus commandés »).
  100 - v.legacy_id,
  '2026-11-04T00:00:00Z'::timestamptz
from (values
  ('coca-cola-1-5-l-x24', 'Coca-Cola 1,5 L', 'coca-cola', 'sodas-eaux', '1,5 L', 24, 'Pack de 24', array['/products/coca-cola-1-5-l-x24.webp'], 1),
  ('blue-33-cl-x24', 'B''lue 33 cl', 'blue', 'sodas-eaux', '33 cl', 24, 'Pack de 24', array[]::text[], 2),
  ('lipton-ice-tea-33-cl-x12', 'Lipton Ice Tea 33 cl', 'lipton', 'sodas-eaux', '33 cl', 12, 'Pack de 12', array['/products/lipton-ice-tea-33-cl-x12.webp'], 3),
  ('hawai-33-cl-x24', 'Hawaï 33 cl', 'hawai', 'sodas-eaux', '33 cl', 24, 'Pack de 24', array['/products/hawai-33-cl-x24.webp'], 4),
  ('capri-sun-20-cl-x10', 'Capri-Sun 20 cl', 'capri-sun', 'jus-nectars', '20 cl', 10, 'Pack de 10', array['/products/capri-sun-20-cl-x10.webp'], 5),
  ('red-bull-25-cl-x24', 'Red Bull 25 cl', 'red-bull', 'energisants', '25 cl', 24, 'Pack de 24', array['/products/red-bull-25-cl-x24.webp'], 6),
  ('minute-maid-orange-33-cl-x24', 'Minute Maid Orange 33 cl', 'minute-maid', 'jus-nectars', '33 cl', 24, 'Pack de 24', array['/products/minute-maid-orange-33-cl-x24.webp'], 7),
  -- Format affiché « 35x25 » sur l'ancien site : à confirmer.
  ('perrier', 'Perrier', 'perrier', 'sodas-eaux', null, null, 'Conditionnement à confirmer', array['/products/perrier.webp'], 8)
) as v (slug, name, brand_slug, category_slug, volume, units_per_pack, pack_label, images, legacy_id)
join public.brands b on b.slug = v.brand_slug
join public.categories c on c.slug = v.category_slug;
