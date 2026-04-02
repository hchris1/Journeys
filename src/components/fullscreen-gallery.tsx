"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import type { ImageData } from "@/types/journey";

interface FullscreenGalleryProps {
  images: ImageData[];
  journeyTitle: string;
}

export function FullscreenGallery({
  images,
  journeyTitle,
}: FullscreenGalleryProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const slides = images.map((img) => ({
    src: img.full,
    width: img.width,
    height: img.height,
    alt: `${journeyTitle} - ${img.filename}`,
  }));

  const handleClose = () => {
    setOpen(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black">
      <Lightbox
        open={open}
        close={handleClose}
        slides={slides}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.98)" },
        }}
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  );
}
