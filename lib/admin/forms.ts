/** État renvoyé par les actions des formulaires de l'admin. */
export type FormValues = Record<string, string | string[]>;

export type AdminFormState = {
  status: "idle" | "error";
  /** Message général affiché en tête du formulaire. */
  message?: string;
  /** Premier message d'erreur par champ. */
  errors?: Partial<Record<string, string>>;
  /** Saisie renvoyée pour pré-remplir le formulaire après une erreur. */
  values?: FormValues;
};

export const idleState: AdminFormState = { status: "idle" };

/** Champs texte d'un formulaire ; `lists` désigne les champs à valeurs multiples. */
export function readForm(
  formData: FormData,
  lists: readonly string[] = [],
): FormValues {
  const values: FormValues = {};
  for (const key of new Set(formData.keys())) {
    if (key.startsWith("$ACTION")) continue;
    const all = formData
      .getAll(key)
      .filter((v): v is string => typeof v === "string");
    values[key] = lists.includes(key) ? all : (all[0] ?? "");
  }
  for (const key of lists) values[key] ??= [];
  return values;
}

type DbError = { code?: string; message?: string; details?: string };

/**
 * Suppression bloquée par des éléments rattachés : 23001 pour une clé
 * étrangère « on delete restrict », 23503 pour « no action ».
 */
export function isInUseError(error: DbError | null): boolean {
  return error?.code === "23001" || error?.code === "23503";
}

/**
 * Message compréhensible pour une erreur de la base. `unique` associe un
 * mot du nom de la contrainte (slug, sku…) au message à afficher.
 */
export function dbErrorMessage(
  error: DbError,
  unique: Record<string, string> = {},
): string {
  const text = `${error.message ?? ""} ${error.details ?? ""}`;
  if (error.code === "23505") {
    for (const [column, message] of Object.entries(unique)) {
      if (text.includes(`_${column}_key`)) return message;
    }
    return "Cette valeur est déjà utilisée par un autre élément.";
  }
  if (isInUseError(error)) {
    return "Impossible : des éléments y sont encore rattachés.";
  }
  if (error.code === "23514" && error.message && !text.includes("violates")) {
    // Message rédigé dans la base (règle des deux niveaux de catégories).
    return error.message;
  }
  if (error.code === "42501" || error.code === "PGRST116") {
    return "Action refusée : votre session a peut-être expiré. Reconnectez-vous.";
  }
  return "L'enregistrement a échoué. Réessayez dans un instant.";
}
