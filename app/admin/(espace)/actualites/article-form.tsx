"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  FormAlert,
  SubmitButton,
  formValues,
} from "@/components/admin/form-ui";
import { ImageField } from "@/components/admin/image-field";
import { buttonStyles } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  idleState,
  type AdminFormState,
  type FormValues,
} from "@/lib/admin/forms";

export function ArticleForm({
  action,
  initial,
  isNew,
}: {
  action: (
    state: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  initial: FormValues;
  isNew: boolean;
}) {
  const [state, formAction] = useActionState(action, idleState);
  const v = formValues(state, initial);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-8">
      <FormAlert state={state} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <Input
            label="Titre"
            name="title"
            required
            defaultValue={v.text("title")}
            error={v.error("title")}
          />
          <Textarea
            label="Résumé"
            name="excerpt"
            rows={3}
            hint="Une ou deux phrases, affichées dans la liste des actualités et dans les résultats de recherche Google."
            defaultValue={v.text("excerpt")}
            error={v.error("excerpt")}
          />
          <Textarea
            label="Texte"
            name="content"
            rows={16}
            hint="Laissez une ligne vide entre deux paragraphes."
            defaultValue={v.text("content")}
            error={v.error("content")}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 bg-teal-soft p-5">
            <Checkbox name="published" defaultChecked={v.checked("published")}>
              Publiée sur le site
            </Checkbox>
            <Input
              label="Date affichée"
              name="publishedOn"
              type="date"
              hint="Vide : date du jour de la première publication."
              defaultValue={v.text("publishedOn")}
              error={v.error("publishedOn")}
            />
          </div>
          <ImageField
            name="coverUrl"
            label="Photo de couverture"
            folder="articles"
            max={1}
            initial={v.list("coverUrl")}
            error={v.error("coverUrl")}
            hint="Format paysage de préférence."
          />
          <Textarea
            label="Description de la photo"
            name="coverAlt"
            rows={2}
            hint="Ce que montre la photo, en quelques mots (lu par les lecteurs d'écran)."
            defaultValue={v.text("coverAlt")}
            error={v.error("coverAlt")}
          />
          <Input
            label="Adresse de la page"
            name="slug"
            hint={
              isNew
                ? "notym.fr/actualites/… Laissez vide pour la créer à partir du titre."
                : "Attention : changer l'adresse casse les liens déjà partagés."
            }
            defaultValue={v.text("slug")}
            error={v.error("slug")}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-ink pt-6">
        <SubmitButton>
          {isNew ? "Créer l'actualité" : "Enregistrer"}
        </SubmitButton>
        <Link
          href="/admin/actualites"
          className={buttonStyles({ variant: "secondary" })}
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
