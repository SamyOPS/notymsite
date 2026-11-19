/**
 * Page où revenir après la connexion (paramètre ?suite=). Seules les pages
 * de l'admin sont acceptées, pour ne pas servir de redirection ouverte.
 */
export function safeNextPath(value: unknown): string {
  if (
    typeof value === "string" &&
    /^\/admin(?:[/?#]|$)/.test(value) &&
    !/[\\\s]|\/\//.test(value) &&
    !value.startsWith("/admin/connexion")
  ) {
    return value;
  }
  return "/admin";
}
