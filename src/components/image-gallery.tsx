"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { ImageData } from "@/types/journey";
import { MasonryGrid } from "./masonry-grid";

interface ImageGalleryProps {
  images: ImageData[];
  journeyTitle: string;
}

export function ImageGallery({ images, journeyTitle }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const slides = images.map((img) => ({
    src: img.full,
    width: img.width,
    height: img.height,
    alt: `${journeyTitle} - ${img.filename}`,
  }));

  return (
    <>
      <MasonryGrid>
        {images.map((image, index) => (
          <div key={image.filename} className="mb-4">
            <button
              onClick={() => openLightbox(index)}
              className="block w-full overflow-hidden rounded-lg bg-zinc-900 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <div
                className="relative w-full"
                style={{ aspectRatio: image.aspectRatio }}
              >
                <Image
                  src={image.thumb}
                  alt={`${journeyTitle} - ${image.filename}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </button>
          </div>
        ))}
      </MasonryGrid>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
}
