import { notFound } from "next/navigation";
import { getJourney } from "@/lib/journeys";
import { FullscreenGallery } from "@/components/fullscreen-gallery";

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

  return (
    <FullscreenGallery
      images={journey.images}
      journeyTitle={journey.title}
    />
  );
}
