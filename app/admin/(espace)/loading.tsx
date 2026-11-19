/** Affiché aussitôt pendant le chargement d'une page de l'admin. */
export default function AdminLoading() {
  return (
    <p role="status" className="text-body text-ink-muted">
      Chargement…
    </p>
  );
}
