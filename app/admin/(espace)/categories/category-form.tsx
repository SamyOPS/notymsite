"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  FormAlert,
  SubmitButton,
  formValues,
} from "@/components/admin/form-ui";
import { buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  idleState,
  type AdminFormState,
  type FormValues,
} from "@/lib/admin/forms";

export function CategoryForm({
  action,
  initial,
  isNew,
  universes,
  hasChildren,
}: {
  action: (
    state: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  initial: FormValues;
  isNew: boolean;
  /** Univers auxquels la catégorie peut être rattachée. */
  universes: Array<{ id: string; name: string }>;
  /** Un univers qui a des catégories ne peut pas devenir une catégorie. */
  hasChildren: boolean;
}) {
  const [state, formAction] = useActionState(action, idleState);
  const v = formValues(state, initial);

  return (
    <form
      action={formAction}
      noValidate
      className="flex max-w-2xl flex-col gap-6"
    >
      <FormAlert state={state} />
      <Input
        label="Nom"
        name="name"
        required
        defaultValue={v.text("name")}
        error={v.error("name")}
      />
      <Input
        label="Adresse de la page"
        name="slug"
        hint={
          isNew
            ? "notym.fr/catalogue/… Laissez vide pour la créer à partir du nom."
            : "Attention : changer l'adresse casse les liens déjà partagés vers cette catégorie."
        }
        defaultValue={v.text("slug")}
        error={v.error("slug")}
      />
      {hasChildren ? (
        <>
          <input type="hidden" name="parentId" value="" />
          <p className="text-body text-ink-muted">
            C&apos;est un univers : il contient des catégories.
          </p>
        </>
      ) : (
        <Select
          label="Univers"
          name="parentId"
          hint="« Aucun » pour créer un univers (premier niveau)."
          defaultValue={v.text("parentId")}
          error={v.error("parentId")}
        >
          <option value="">Aucun : c&apos;est un univers</option>
          {universes.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </Select>
      )}
      <Textarea
        label="Description"
        name="description"
        rows={3}
        hint="Courte phrase affichée sous le titre de la page, ex. « Coca-Cola, Pepsi, Evian, Badoit »."
        defaultValue={v.text("description")}
        error={v.error("description")}
      />
      <Input
        label="Ordre d'affichage"
        name="sort"
        inputMode="numeric"
        hint="Les plus petits nombres apparaissent en premier dans les menus."
        defaultValue={v.text("sort")}
        error={v.error("sort")}
        fieldClassName="max-w-48"
      />
      <div className="flex flex-wrap gap-3 border-t border-ink pt-6">
        <SubmitButton>{isNew ? "Créer" : "Enregistrer"}</SubmitButton>
        <Link
          href="/admin/categories"
          className={buttonStyles({ variant: "secondary" })}
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
