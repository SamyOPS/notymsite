"use client";

import { useActionState } from "react";
import {
  FormAlert,
  SubmitButton,
  formValues,
} from "@/components/admin/form-ui";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  idleState,
  type AdminFormState,
  type FormValues,
} from "@/lib/admin/forms";
import { requestStatuses } from "@/lib/admin/schemas";

export function RequestForm({
  action,
  initial,
}: {
  action: (
    state: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  initial: FormValues;
}) {
  const [state, formAction] = useActionState(action, idleState);
  const v = formValues(state, initial);

  return (
    <form action={formAction} className="flex flex-col gap-5 bg-teal-soft p-6">
      <FormAlert state={state} />
      <Select
        label="Statut"
        name="status"
        defaultValue={v.text("status")}
        error={v.error("status")}
      >
        {requestStatuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>
      <Textarea
        label="Notes internes"
        name="notes"
        hint="Visibles uniquement dans l'admin."
        rows={6}
        defaultValue={v.text("notes")}
        error={v.error("notes")}
      />
      <SubmitButton>Enregistrer</SubmitButton>
    </form>
  );
}
