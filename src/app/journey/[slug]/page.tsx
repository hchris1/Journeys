import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { getJourney } from "@/lib/journeys";
import { ImageGallery } from "@/components/image-gallery";

export const dynamic = "force-dynamic";

interface JourneyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: JourneyPageProps) {
  const { slug } = await params;
  const journey = getJourney(slug);

  if (!journey) {
    return { title: "Journey Not Found" };
  }

  return {
    title: `${journey.title} | Journeys`,
    description: journey.description,
  };
}

export default async function JourneyPage({ params }: JourneyPageProps) {
  const { slug } = await params;
  const journey = getJourney(slug);

  if (!journey) {
    notFound();
  }

  const formattedDate = new Date(journey.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to journeys</span>
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-light text-white tracking-tight mb-4">
            {journey.title}
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mb-4">
            {journey.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{journey.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <span className="text-zinc-600">
              {journey.images.length} photos
            </span>
          </div>
        </header>

        <ImageGallery images={journey.images} journeyTitle={journey.title} />
      </div>
    </main>
  );
}
