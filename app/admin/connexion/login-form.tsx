"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/admin/form-ui";
import { Input } from "@/components/ui/input";
import { signIn, type LoginState } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(signIn, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="suite" value={next} />
      {state.error && (
        <p
          role="alert"
          className="border-2 border-danger p-4 text-body font-semibold text-danger"
        >
          {state.error}
        </p>
      )}
      <Input
        label="E-mail"
        name="email"
        type="email"
        autoComplete="username"
        required
        defaultValue={state.email}
      />
      <Input
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <SubmitButton pendingLabel="Connexion…">Se connecter</SubmitButton>
    </form>
  );
}
