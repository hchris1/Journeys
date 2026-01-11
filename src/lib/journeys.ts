import fs from "fs";
import path from "path";
import type {
  Journey,
  JourneyCard,
  JourneyMetadata,
  ImageData,
} from "@/types/journey";

const CONTENT_DIR = path.join(process.cwd(), "content/journeys");
const OPTIMIZED_DIR = path.join(process.cwd(), "public/optimized");

function getJourneyMetadata(slug: string): JourneyMetadata | null {
  try {
    const metadataPath = path.join(CONTENT_DIR, slug, "journey.json");
    const content = fs.readFileSync(metadataPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function getOptimizedImages(slug: string): ImageData[] {
  const thumbDir = path.join(OPTIMIZED_DIR, slug, "thumb");

  if (!fs.existsSync(thumbDir)) {
    return [];
  }

  const files = fs.readdirSync(thumbDir);

  return files
    .filter((f) => f.endsWith(".webp"))
    .map((filename) => {
      const baseName = path.parse(filename).name;
      return {
        filename,
        thumb: `/optimized/${slug}/thumb/${filename}`,
        medium: `/optimized/${slug}/medium/${filename}`,
        full: `/optimized/${slug}/full/${filename}`,
        width: 0,
        height: 0,
        aspectRatio: 1.5,
      };
    })
    .sort((a, b) => a.filename.localeCompare(b.filename));
}

function getJourneySlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => dirent.name !== "_example")
    .filter((dirent) => {
      // Only include if it has a journey.json
      const metaPath = path.join(CONTENT_DIR, dirent.name, "journey.json");
      return fs.existsSync(metaPath);
    })
    .map((dirent) => dirent.name);
}

export function getAllJourneys(): JourneyCard[] {
  const slugs = getJourneySlugs();

  return slugs
    .map((slug) => {
      const metadata = getJourneyMetadata(slug);
      if (!metadata) return null;

      const images = getOptimizedImages(slug);

      // Use specified cover image or fall back to first image
      let coverImage = "";
      if (metadata.coverImage) {
        const coverName = metadata.coverImage.replace(/\.[^.]+$/, "");
        const found = images.find((img) => img.filename.startsWith(coverName));
        coverImage = found?.medium || images[0]?.medium || "";
      } else {
        coverImage = images[0]?.medium || "";
      }

      return {
        slug,
        title: metadata.title,
        description: metadata.description,
        date: metadata.date,
        location: metadata.location,
        coverImage,
      };
    })
    .filter((j): j is JourneyCard => j !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getJourney(slug: string): Journey | null {
  const metadata = getJourneyMetadata(slug);
  if (!metadata) return null;

  const images = getOptimizedImages(slug);

  return {
    slug,
    ...metadata,
    images,
  };
}

export function getAllJourneySlugs(): string[] {
  return getJourneySlugs();
}
