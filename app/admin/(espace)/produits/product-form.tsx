"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";
import {
  FormAlert,
  SubmitButton,
  formValues,
} from "@/components/admin/form-ui";
import { ImageField } from "@/components/admin/image-field";
import { buttonStyles } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  idleState,
  type AdminFormState,
  type FormValues,
} from "@/lib/admin/forms";
import { stockOptions } from "@/lib/admin/schemas";
import { site } from "@/lib/site";

type Option = { id: string; name: string };

export function ProductForm({
  action,
  initial,
  isNew,
  brands,
  categoryOptions,
}: {
  action: (
    state: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  initial: FormValues;
  isNew: boolean;
  brands: Option[];
  /** Options de catégorie, rendues côté serveur (univers et catégories). */
  categoryOptions: ReactNode;
}) {
  const [state, formAction] = useActionState(action, idleState);
  const v = formValues(state, initial);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-8">
      <FormAlert state={state} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-8">
          <Section title="Produit">
            <Input
              label="Nom"
              name="name"
              required
              placeholder="Coca-Cola 33 cl"
              defaultValue={v.text("name")}
              error={v.error("name")}
            />
            <Input
              label="Adresse de la page"
              name="slug"
              hint={
                isNew
                  ? "notym.fr/produit/… Laissez vide pour la créer à partir du nom."
                  : "Attention : changer l'adresse casse les liens déjà partagés vers ce produit."
              }
              defaultValue={v.text("slug")}
              error={v.error("slug")}
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <Select
                label="Catégorie"
                name="categoryId"
                required
                defaultValue={v.text("categoryId")}
                error={v.error("categoryId")}
              >
                <option value="">Choisir…</option>
                {categoryOptions}
              </Select>
              <Select
                label="Marque"
                name="brandId"
                defaultValue={v.text("brandId")}
                error={v.error("brandId")}
                hint="Absente de la liste ? Ajoutez-la dans « Marques »."
              >
                <option value="">Aucune</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </Select>
            </div>
          </Section>

          <Section title="Conditionnement">
            <div className="grid gap-6 sm:grid-cols-3">
              <Input
                label="Contenance"
                name="volume"
                placeholder="33 cl"
                defaultValue={v.text("volume")}
                error={v.error("volume")}
              />
              <Input
                label="Unités par pack"
                name="unitsPerPack"
                inputMode="numeric"
                placeholder="24"
                defaultValue={v.text("unitsPerPack")}
                error={v.error("unitsPerPack")}
              />
              <Input
                label="Libellé affiché"
                name="packLabel"
                placeholder="Pack de 24"
                hint="Vide : « Pack de » + unités."
                defaultValue={v.text("packLabel")}
                error={v.error("packLabel")}
              />
            </div>
            <Input
              label="Référence (SKU)"
              name="sku"
              defaultValue={v.text("sku")}
              error={v.error("sku")}
              fieldClassName="sm:max-w-xs"
            />
          </Section>

          <Section title="Présentation">
            <Textarea
              label="Description"
              name="description"
              rows={6}
              defaultValue={v.text("description")}
              error={v.error("description")}
            />
            <ImageField
              name="images"
              label="Photos"
              folder="products"
              max={8}
              initial={v.list("images")}
              error={v.error("images")}
              hint="La première photo est la photo principale. Idéalement : produit sur fond blanc, format carré. Les photos sont réduites automatiquement."
            />
          </Section>
        </div>

        <div className="flex flex-col gap-8">
          <Section title="Sur le site">
            <Checkbox name="published" defaultChecked={v.checked("published")}>
              Visible sur le site
            </Checkbox>
            <Checkbox name="featured" defaultChecked={v.checked("featured")}>
              Mis en avant sur l&apos;accueil
            </Checkbox>
            <Select
              label="Disponibilité"
              name="stock"
              defaultValue={v.text("stock")}
              error={v.error("stock")}
            >
              {stockOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Section>

          <Section title="Badges">
            <Checkbox
              name="isBestSeller"
              defaultChecked={v.checked("isBestSeller")}
            >
              Best-seller
            </Checkbox>
            <Checkbox name="isNew" defaultChecked={v.checked("isNew")}>
              Nouveau
            </Checkbox>
            <Checkbox name="isPromo" defaultChecked={v.checked("isPromo")}>
              Promo
            </Checkbox>
          </Section>

          <Section title="Classement et prix">
            <Input
              label="Popularité"
              name="popularity"
              inputMode="numeric"
              hint="Plus le nombre est élevé, plus le produit apparaît haut dans « Les plus commandés »."
              defaultValue={v.text("popularity")}
              error={v.error("popularity")}
            />
            <Input
              label="Prix « à partir de » HT (€)"
              name="price"
              inputMode="decimal"
              placeholder="12,90"
              hint={
                site.features.showPrices
                  ? "Prix du pack. Vide : « Prix sur devis »."
                  : "Prix du pack. Les prix sont actuellement masqués sur le site (réglage dans lib/site.ts)."
              }
              defaultValue={v.text("price")}
              error={v.error("price")}
            />
          </Section>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-ink pt-6">
        <SubmitButton>
          {isNew ? "Créer le produit" : "Enregistrer"}
        </SubmitButton>
        <Link
          href="/admin/produits"
          className={buttonStyles({ variant: "secondary" })}
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-5">
      <legend className="mb-4 w-full border-b border-line pb-2 font-display text-h3">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
