"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import type { FieldMap } from "@/components/forms/form-parts";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Steps } from "@/components/ui/steps";
import { estimateQuote } from "@/lib/quote/estimate";
import { clearQuote, removeFromQuote, useQuoteLines } from "@/lib/quote/store";
import { site } from "@/lib/site";
import type { QuoteProduct } from "@/types/catalog";
import {
  loadQuoteProducts,
  submitQuoteRequest,
  type QuoteErrorField,
  type QuoteSubmitResult,
} from "./actions";
import { QuoteDetailsStep } from "./quote-details-step";
import { QuoteLinesStep } from "./quote-lines-step";
import { QuoteReviewStep } from "./quote-review-step";
import { QuoteSummary } from "./quote-summary";

type Step = 1 | 2 | 3;
const STEP_TITLES = ["Sélection", "Coordonnées", "Envoi"] as const;
const STEP_HEADINGS: Record<Step, string> = {
  1: "Votre sélection",
  2: "Réception et coordonnées",
  3: "Vérifiez et envoyez votre demande",
};

const noopSubscribe = () => () => {};

/** Demande de devis en trois étapes : Sélection → Coordonnées → Envoi. */
export function QuoteFlow() {
  // La sélection vit dans le navigateur : rien à afficher avant l'hydratation.
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const lines = useQuoteLines();

  const [catalog, setCatalog] = useState<{
    ids: Set<string>;
    products: Map<string, QuoteProduct>;
  }>(() => ({ ids: new Set(), products: new Map() }));
  const [removedCount, setRemovedCount] = useState(0);
  const [step, setStep] = useState<Step>(1);
  const [details, setDetails] = useState<FieldMap>({});
  const [errors, setErrors] = useState<
    Partial<Record<QuoteErrorField, string>>
  >({});
  const [result, setResult] = useState<QuoteSubmitResult | null>(null);
  const [sending, startSending] = useTransition();

  const headingRef = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const stepChanged = useRef(false);

  // Charge les produits de la sélection qui ne sont pas encore connus.
  const missingKey = useMemo(
    () =>
      [...new Set(lines.map((l) => l.productId))]
        .filter((id) => !catalog.ids.has(id))
        .sort()
        .join(","),
    [lines, catalog.ids],
  );

  useEffect(() => {
    if (!hydrated || !missingKey) return;
    let cancelled = false;
    const requested = missingKey.split(",");
    loadQuoteProducts(requested).then((list) => {
      if (cancelled) return;
      setCatalog((previous) => {
        const ids = new Set(previous.ids);
        const products = new Map(previous.products);
        for (const id of requested) ids.add(id);
        for (const product of list) products.set(product.id, product);
        return { ids, products };
      });
      // Produits retirés du catalogue depuis leur ajout : on les enlève.
      const unknown = requested.filter((id) => !list.some((p) => p.id === id));
      if (unknown.length > 0) {
        unknown.forEach(removeFromQuote);
        setRemovedCount((count) => count + unknown.length);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, missingKey]);

  // À chaque changement d'étape : focus sur le titre et retour en haut.
  useEffect(() => {
    if (!stepChanged.current) return;
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "start" });
  }, [step]);

  useEffect(() => {
    if (result?.status === "success") successRef.current?.focus();
  }, [result]);

  const goTo = (next: Step) => {
    stepChanged.current = true;
    setStep(next);
  };

  const send = (form: { consent?: string; website?: string }) => {
    // Les erreurs de l'envoi précédent ne doivent pas rester affichées.
    setErrors({});
    setResult(null);
    startSending(async () => {
      const response = await submitQuoteRequest({ details, lines, ...form });
      setResult(response);
      if (response.status === "invalid") {
        setErrors(response.errors);
        if (response.step !== step) goTo(response.step);
      } else if (response.status === "success") {
        clearQuote();
      }
    });
  };

  if (result?.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="flex max-w-3xl flex-col items-start gap-4 border-t border-ink pt-8 focus:outline-none"
      >
        <h2 className="text-h2">Votre demande de devis est envoyée.</h2>
        {result.reference && (
          <p className="text-body-lg">
            Référence :{" "}
            <strong className="tabular-nums">{result.reference}</strong>
          </p>
        )}
        <p className="text-body-lg">
          Notre équipe prépare votre devis et revient vers vous.{" "}
          {site.claims.responseTime}.
        </p>
        <p className="text-body">
          Une question ? Appelez-nous au{" "}
          <a
            href={site.contact.phoneHref}
            className="font-semibold text-teal-deep underline"
          >
            {site.contact.phone}
          </a>
          .
        </p>
        <ButtonLink href="/catalogue" size="lg" className="mt-2">
          Retour au catalogue
        </ButtonLink>
      </div>
    );
  }

  if (!hydrated || missingKey) return <QuoteSkeleton />;

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Votre devis est vide"
        description={
          <p>
            {removedCount > 0
              ? "Les produits de votre sélection ne sont plus disponibles. "
              : ""}
            Ajoutez des produits depuis le catalogue avec le bouton « + ».
          </p>
        }
        actions={<ButtonLink href="/catalogue">Voir le catalogue</ButtonLink>}
      />
    );
  }

  const estimate = estimateQuote(lines, catalog.products);

  return (
    <div className="flex flex-col gap-8">
      <Steps
        label="Étapes de la demande de devis"
        steps={STEP_TITLES}
        current={step - 1}
        onSelect={(index) => goTo((index + 1) as Step)}
      />

      {removedCount > 0 && (
        <p role="status" className="bg-wheat-soft p-4 text-body text-wheat-ink">
          {removedCount > 1
            ? `${removedCount} produits ne sont plus disponibles et ont été retirés de votre sélection.`
            : "Un produit n'est plus disponible et a été retiré de votre sélection."}
        </p>
      )}

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="etape-titre" className="min-w-0">
          <h2
            id="etape-titre"
            ref={headingRef}
            tabIndex={-1}
            className="mb-6 scroll-mt-28 text-h2 focus:outline-none"
          >
            {STEP_HEADINGS[step]}
          </h2>

          {step === 1 && (
            <QuoteLinesStep
              lines={lines}
              products={catalog.products}
              error={errors.lines}
              onContinue={() => goTo(2)}
            />
          )}
          {step === 2 && (
            <QuoteDetailsStep
              initialValues={details}
              initialErrors={errors}
              onBack={(values) => {
                setDetails(values);
                goTo(1);
              }}
              onContinue={(values) => {
                setDetails(values);
                setErrors({});
                goTo(3);
              }}
            />
          )}
          {step === 3 && (
            <QuoteReviewStep
              lines={lines}
              products={catalog.products}
              details={details}
              consentError={errors.consent}
              unavailable={result?.status === "unavailable"}
              sending={sending}
              onEdit={(target) => goTo(target)}
              onSend={send}
            />
          )}
        </section>

        <QuoteSummary estimate={estimate} />
      </div>
    </div>
  );
}

function QuoteSkeleton() {
  return (
    <div aria-busy className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <span className="sr-only">Chargement de votre devis…</span>
      <div aria-hidden className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex gap-4 border-b border-line py-5">
            <div className="size-20 bg-teal-soft motion-safe:animate-pulse" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-4 w-1/4 bg-line/60" />
              <div className="h-5 w-1/2 bg-line/60" />
            </div>
          </div>
        ))}
      </div>
      <div aria-hidden className="h-64 bg-line/40 motion-safe:animate-pulse" />
    </div>
  );
}
