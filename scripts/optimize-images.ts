import fs from "fs";
import path from "path";
import sharp from "sharp";

const CONTENT_DIR = path.join(process.cwd(), "content/journeys");
const OUTPUT_DIR = path.join(process.cwd(), "public/optimized");
const MANIFEST_PATH = path.join(process.cwd(), "src/lib/manifest.json");

const SIZES = {
  thumb: 400,
  medium: 1200,
  full: 2400,
};

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

interface JourneyMeta {
  title: string;
  description: string;
  date: string;
  location: string;
  coverImage?: string;
  coordinates?: { lat: number; lng: number };
}

function validateJourney(slug: string, journeyDir: string): JourneyMeta | null {
  // Skip example template
  if (slug === "_example") {
    return null;
  }

  const metaPath = path.join(journeyDir, "journey.json");

  if (!fs.existsSync(metaPath)) {
    console.error(`  ERROR: Missing journey.json in ${slug}/`);
    console.error(`         Copy from _example/journey.json as a template\n`);
    return null;
  }

  try {
    const content = fs.readFileSync(metaPath, "utf-8");
    const meta = JSON.parse(content) as Partial<JourneyMeta>;

    const required = ["title", "description", "date", "location"] as const;
    const missing = required.filter((key) => !meta[key]);

    if (missing.length > 0) {
      console.error(`  ERROR: journey.json in ${slug}/ missing: ${missing.join(", ")}`);
      return null;
    }

    return meta as JourneyMeta;
  } catch (e) {
    console.error(`  ERROR: Invalid JSON in ${slug}/journey.json`);
    return null;
  }
}

interface ImageInfo {
  filename: string;
  thumb: string;
  medium: string;
  full: string;
  width: number;
  height: number;
  aspectRatio: number;
}

interface JourneyManifest {
  slug: string;
  images: ImageInfo[];
}

async function processImage(
  inputPath: string,
  outputDir: string,
  filename: string
): Promise<ImageInfo> {
  const baseName = path.parse(filename).name;
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const width = metadata.width || 1;
  const height = metadata.height || 1;
  const aspectRatio = width / height;

  const results: Record<string, string> = {};

  for (const [sizeName, maxWidth] of Object.entries(SIZES)) {
    const sizeDir = path.join(outputDir, sizeName);
    fs.mkdirSync(sizeDir, { recursive: true });

    const outputFilename = `${baseName}.webp`;
    const outputPath = path.join(sizeDir, outputFilename);

    await sharp(inputPath)
      .resize(maxWidth, undefined, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    results[sizeName] = outputFilename;
  }

  return {
    filename,
    thumb: results.thumb,
    medium: results.medium,
    full: results.full,
    width,
    height,
    aspectRatio,
  };
}

async function processJourney(journeyDir: string): Promise<JourneyManifest> {
  const slug = path.basename(journeyDir);
  const outputDir = path.join(OUTPUT_DIR, slug);

  console.log(`Processing journey: ${slug}`);

  fs.mkdirSync(outputDir, { recursive: true });

  const files = fs.readdirSync(journeyDir);
  const imageFiles = files.filter((file) =>
    IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())
  );

  const images: ImageInfo[] = [];

  for (const imageFile of imageFiles) {
    const inputPath = path.join(journeyDir, imageFile);
    console.log(`  Processing: ${imageFile}`);
    const imageInfo = await processImage(inputPath, outputDir, imageFile);
    images.push(imageInfo);
  }

  // Sort images by filename for consistent ordering
  images.sort((a, b) => a.filename.localeCompare(b.filename));

  return { slug, images };
}

async function main() {
  console.log("Starting image optimization...\n");

  // Clean output directory contents (but not the dir itself - may be a mount)
  if (fs.existsSync(OUTPUT_DIR)) {
    const entries = fs.readdirSync(OUTPUT_DIR);
    for (const entry of entries) {
      fs.rmSync(path.join(OUTPUT_DIR, entry), { recursive: true });
    }
  } else {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get all journey directories
  const journeyDirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => dirent.name !== "_example")
    .map((dirent) => path.join(CONTENT_DIR, dirent.name));

  if (journeyDirs.length === 0) {
    console.log("No journeys found in content/journeys/");
    console.log("Copy _example/ to create your first journey.\n");
    fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify({ journeys: [] }, null, 2));
    return;
  }

  const manifests: JourneyManifest[] = [];
  let errors = 0;

  for (const journeyDir of journeyDirs) {
    const slug = path.basename(journeyDir);
    const meta = validateJourney(slug, journeyDir);

    if (!meta) {
      errors++;
      continue;
    }

    const manifest = await processJourney(journeyDir);
    manifests.push(manifest);
  }

  if (errors > 0) {
    console.log(`\nWarning: ${errors} journey(s) skipped due to errors.`);
  }

  // Write manifest file
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(
    MANIFEST_PATH,
    JSON.stringify({ journeys: manifests }, null, 2)
  );

  console.log("\nOptimization complete!");
  console.log(`Processed ${manifests.length} journeys`);
  console.log(`Manifest written to: ${MANIFEST_PATH}`);
}

main().catch(console.error);
