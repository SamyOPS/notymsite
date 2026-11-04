"use server";

import { z } from "zod";
import { deliverContactRequest } from "@/lib/requests/deliver";
import {
  contactRequestSchema,
  contactRequestTextFields,
  type ContactRequestField,
} from "@/lib/validation/contact-request";

export type FormValues = Partial<Record<ContactRequestField, string>>;
export type FormErrors = Partial<Record<ContactRequestField, string>>;

export type ContactFormState =
  | { status: "idle" }
  | { status: "invalid"; errors: FormErrors; values: FormValues }
  | { status: "unavailable"; values: FormValues }
  | { status: "success" };

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
  const consent = formData.get("consent");
  if (consent === "on") values.consent = "on";

  const parsed = contactRequestSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors as Partial<
      Record<ContactRequestField, string[]>
    >;
    const errors: FormErrors = {};
    for (const [field, messages] of Object.entries(fieldErrors)) {
      if (messages?.[0]) errors[field as ContactRequestField] = messages[0];
    }
    return { status: "invalid", errors, values };
  }

  const result = await deliverContactRequest(parsed.data);
  if (!result.ok) return { status: "unavailable", values };
  return { status: "success" };
}
