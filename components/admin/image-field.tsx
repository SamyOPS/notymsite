"use client";

import { ArrowLeft, ArrowRight, ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { prepareImage } from "@/lib/admin/prepare-image";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { MEDIA_BUCKET } from "@/lib/supabase/env";

type ImageFieldProps = {
  /** Nom du champ : une valeur par photo, dans l'ordre affiché. */
  name: string;
  label: string;
  hint?: string;
  error?: string;
  /** Dossier du bucket : products ou articles. */
  folder: "products" | "articles";
  initial: string[];
  max: number;
};

const iconButton =
  "inline-flex size-9 items-center justify-center rounded-pill bg-surface-raised text-ink ring-1 ring-line hover:bg-teal-soft disabled:opacity-40";

/**
 * Photos d'un produit ou d'un article. Les fichiers sont réduits dans le
 * navigateur puis envoyés directement dans Supabase Storage ; le formulaire
 * ne transmet que leurs URL. La première photo est la photo principale.
 */
export function ImageField({
  name,
  label,
  hint,
  error,
  folder,
  initial,
  max,
}: ImageFieldProps) {
  const [urls, setUrls] = useState(initial);
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const remaining = max - urls.length;

  async function upload(files: File[]) {
    setUploadError(null);
    const selected = files.slice(0, remaining);
    if (files.length > remaining) {
      setUploadError(
        `${max} photo${max > 1 ? "s" : ""} maximum : les fichiers en trop sont ignorés.`,
      );
    }
    if (selected.length === 0) return;
    setUploading(selected.length);
    const supabase = createBrowserSupabase();

    for (const file of selected) {
      try {
        const { blob, extension } = await prepareImage(file);
        const path = `${folder}/${crypto.randomUUID()}.${extension}`;
        const { error: storageError } = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(path, blob, {
            contentType: blob.type,
            cacheControl: "31536000",
            upsert: false,
          });
        if (storageError) {
          throw new Error(
            "L'envoi a échoué. Vérifiez la connexion, ou reconnectez-vous si la session a expiré.",
          );
        }
        const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
        setUrls((current) => [...current, data.publicUrl]);
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "L'envoi a échoué.");
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  function move(index: number, offset: -1 | 1) {
    setUrls((current) => {
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(index + offset, 0, item!);
      return next;
    });
  }

  const message = uploadError ?? error;

  return (
    <fieldset className="flex flex-col gap-3" aria-describedby={`${id}-aide`}>
      <legend className="text-label text-ink">{label}</legend>
      {urls.map((url) => (
        <input key={url} type="hidden" name={name} value={url} />
      ))}

      {urls.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {urls.map((url, index) => (
            <li key={url} className="flex flex-col gap-2">
              <div className="relative aspect-square overflow-hidden bg-white ring-1 ring-line">
                <Image
                  src={url}
                  alt=""
                  fill
                  unoptimized
                  sizes="160px"
                  className="object-contain"
                />
                {index === 0 && max > 1 && (
                  <span className="absolute top-2 left-2 bg-ink px-2 py-0.5 text-caption font-semibold text-on-inverse">
                    Principale
                  </span>
                )}
              </div>
              <div className="flex gap-1.5">
                {max > 1 && (
                  <>
                    <button
                      type="button"
                      className={iconButton}
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Photo ${index + 1} : avancer`}
                    >
                      <ArrowLeft aria-hidden className="size-4" />
                    </button>
                    <button
                      type="button"
                      className={iconButton}
                      onClick={() => move(index, 1)}
                      disabled={index === urls.length - 1}
                      aria-label={`Photo ${index + 1} : reculer`}
                    >
                      <ArrowRight aria-hidden className="size-4" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className={cn(iconButton, "ml-auto text-danger")}
                  onClick={() =>
                    setUrls((current) => current.filter((u) => u !== url))
                  }
                  aria-label={`Retirer la photo ${index + 1}`}
                >
                  <Trash2 aria-hidden className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 && (
        <div>
          <input
            ref={input}
            id={id}
            type="file"
            // « image/* » : l'iPhone convertit alors ses photos HEIC en JPEG.
            accept="image/*"
            multiple={max > 1}
            className="peer sr-only"
            disabled={uploading > 0}
            onChange={(event) => {
              const files = [...(event.target.files ?? [])];
              event.target.value = "";
              void upload(files);
            }}
          />
          <label
            htmlFor={id}
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill border-2 border-current px-5 font-semibold hover:bg-current/10",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus",
              uploading > 0 && "pointer-events-none opacity-60",
            )}
          >
            <ImagePlus aria-hidden className="size-5" />
            {uploading > 0
              ? "Envoi en cours…"
              : max > 1
                ? "Ajouter des photos"
                : "Choisir une photo"}
          </label>
        </div>
      )}

      <p id={`${id}-aide`} className="text-caption text-ink-muted">
        {hint}
      </p>
      {message && (
        <p role="alert" className="text-caption font-semibold text-danger">
          {message}
        </p>
      )}
    </fieldset>
  );
}
