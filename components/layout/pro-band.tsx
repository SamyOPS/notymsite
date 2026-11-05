import { ButtonLink } from "@/components/ui/button";

/** Bandeau pleine largeur « Vous êtes un professionnel ? ». */
export function ProBand({
  title = "Vous êtes un professionnel ?",
  text = "Envoyez-nous votre demande : notre équipe vous recontacte avec un devis adapté à vos volumes.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section
      aria-labelledby="bandeau-pro"
      data-flush-bottom
      className="mt-20 surface-teal"
    >
      <div className="container-site flex flex-col gap-8 py-14 md:flex-row md:items-end md:justify-between lg:py-20">
        <div className="max-w-2xl">
          <h2 id="bandeau-pro" className="text-h1">
            {title}
          </h2>
          <p className="mt-4 text-body-lg">{text}</p>
        </div>
        <ButtonLink
          href="/devenir-client"
          size="lg"
          variant="dark"
          className="self-start md:self-auto"
        >
          Devenir client
        </ButtonLink>
      </div>
    </section>
  );
}
