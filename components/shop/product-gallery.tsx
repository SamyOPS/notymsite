"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

type ProductGalleryProps = { images: string[]; productName: string };

/** Image principale + miniatures. Sans photo : aplat teal-soft et mention discrète. */
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const current = images[selected];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square bg-teal-soft">
        {current ? (
          <Image
            src={current}
            alt={`${productName}, photo ${selected + 1} sur ${images.length}`}
            fill
            preload
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-contain p-10"
          />
        ) : (
          <p className="absolute bottom-4 left-5 text-caption text-ink-muted">
            Visuel à venir
          </p>
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
                  "relative block aspect-square w-full bg-teal-soft outline-2 -outline-offset-2 transition",
                  index === selected
                    ? "outline-ink"
                    : "outline-transparent hover:outline-line-strong",
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
