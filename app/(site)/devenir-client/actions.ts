"use server";

import { deliverRequest } from "@/lib/requests/deliver";
import { createReference } from "@/lib/requests/reference";
import {
  contactRequestSchema,
  contactRequestTextFields,
  type ContactRequestField,
} from "@/lib/validation/contact-request";
import { firstErrors } from "@/lib/validation/fields";

export type FormValues = Partial<Record<ContactRequestField, string>>;
export type FormErrors = Partial<Record<ContactRequestField, string>>;

export type ContactFormState =
  | { status: "idle" }
  | { status: "invalid"; errors: FormErrors; values: FormValues }
  | { status: "unavailable"; values: FormValues }
  | { status: "success"; reference?: string };

export async function submitContactRequest(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Pot de miel : un humain ne voit pas ce champ. S'il est rempli, c'est un robot :
  // on répond comme si tout s'était bien passé, sans rien transmettre.
  if (String(formData.get("website") ?? "") !== "")
    return { status: "success" };

  const values: FormValues = {};
  for (const field of contactRequestTextFields) {
    const value = formData.get(field);
    if (typeof value === "string") values[field] = value;
  }
  if (formData.get("consent") === "on") values.consent = "on";

  const parsed = contactRequestSchema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "invalid",
      errors: firstErrors<ContactRequestField>(parsed.error),
      values,
    };
  }

  const reference = createReference("C");
  const result = await deliverRequest({
    type: "contact",
    reference,
    receivedAt: new Date().toISOString(),
    data: parsed.data,
  });
  if (!result.ok) return { status: "unavailable", values };
  return { status: "success", reference };
}
