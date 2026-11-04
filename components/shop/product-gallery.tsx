"use client";

import Image from "next/image";
import { useState } from "react";
import { GrainCluster } from "@/components/ui/grain";
import { cn } from "@/lib/cn";

type ProductGalleryProps = { images: string[]; productName: string };

/** Image principale + miniatures. Sans photo : zone teal-soft avec le motif des grains. */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const current = images[selected];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-teal-soft">
        {current ? (
          <Image
            src={current}
            alt={`${productName}, photo ${selected + 1} sur ${images.length}`}
            fill
            preload
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-contain p-8"
          />
        ) : (
          <>
            <GrainCluster preset="placeholder" />
            <p className="absolute inset-x-0 bottom-6 text-center text-caption text-ink-muted">
              Photo à venir
            </p>
          </>
        )}
      </div>

      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-3" aria-label="Choisir une photo">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Afficher la photo ${index + 1}`}
                aria-pressed={index === selected}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-md bg-teal-soft ring-2 ring-transparent transition",
                  index === selected
                    ? "ring-teal-deep"
                    : "hover:ring-line-strong",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-contain p-2"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
