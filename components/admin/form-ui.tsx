"use client";

import { Trash2 } from "lucide-react";
import { useActionState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonVariant } from "@/components/ui/button";
import type { AdminFormState, FormValues } from "@/lib/admin/forms";
import { idleState } from "@/lib/admin/forms";

/** Bouton d'envoi désactivé pendant l'enregistrement. */
export function SubmitButton({
  children,
  pendingLabel = "Enregistrement…",
  variant = "primary",
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: ButtonVariant;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending}>
      {pending ? pendingLabel : children}
    </Button>
  );
}

/** Message général d'un formulaire (erreur d'enregistrement, champs à corriger). */
export function FormAlert({ state }: { state: AdminFormState }) {
  if (state.status !== "error" || !state.message) return null;
  return (
    <p
      role="alert"
      className="border-2 border-danger bg-surface-raised p-4 text-body font-semibold text-danger"
    >
      {state.message}
    </p>
  );
}

/**
 * Valeurs à afficher dans un formulaire : la saisie renvoyée après une
 * erreur, sinon les valeurs enregistrées.
 */
export function formValues(state: AdminFormState, initial: FormValues) {
  const source = state.values ?? initial;
  return {
    text: (name: string) => {
      const value = source[name];
      return typeof value === "string" ? value : "";
    },
    list: (name: string) => {
      const value = source[name];
      return Array.isArray(value) ? value : value ? [value] : [];
    },
    checked: (name: string) => source[name] === "on",
    error: (name: string) => state.errors?.[name],
  };
}

/** Bouton de suppression, avec confirmation et message d'erreur éventuel. */
export function DeleteForm({
  action,
  confirmMessage,
  label = "Supprimer",
}: {
  action: (
    state: AdminFormState,
    formData: FormData,
  ) => Promise<AdminFormState>;
  confirmMessage: string;
  label?: string;
}) {
  const [state, formAction, pending] = useActionState(action, idleState);
  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
      className="flex flex-col items-start gap-3"
    >
      <Button
        type="submit"
        variant="secondary"
        disabled={pending}
        className="text-danger"
      >
        <Trash2 aria-hidden />
        {pending ? "Suppression…" : label}
      </Button>
      <FormAlert state={state} />
    </form>
  );
}
