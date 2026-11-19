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
import {
  idleState,
  type AdminFormState,
  type FormValues,
} from "@/lib/admin/forms";

export function BrandForm({
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
        label="Identifiant"
        name="slug"
        hint="Utilisé dans les filtres du catalogue (?marque=…). Laissez vide pour le créer à partir du nom."
        defaultValue={v.text("slug")}
        error={v.error("slug")}
      />
      <div className="flex flex-wrap gap-3 border-t border-ink pt-6">
        <SubmitButton>{isNew ? "Créer" : "Enregistrer"}</SubmitButton>
        <Link
          href="/admin/marques"
          className={buttonStyles({ variant: "secondary" })}
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
