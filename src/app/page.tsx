import { getAllJourneys } from "@/lib/journeys";
import { getSiteConfig } from "@/lib/site";
import { JourneyCard } from "@/components/journey-card";
import { MasonryGrid } from "@/components/masonry-grid";

export const dynamic = "force-dynamic";

export default function Home() {
  const journeys = getAllJourneys();
  const site = getSiteConfig();

  return (
    <main className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-light text-white tracking-tight">
            {site.title}
          </h1>
          <p className="mt-2 text-zinc-500">{site.description}</p>
        </header>

        {journeys.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500">No journeys yet.</p>
            <p className="text-zinc-600 text-sm mt-2">
              Add folders with images to content/journeys/ to get started.
            </p>
          </div>
        ) : (
          <MasonryGrid>
            {journeys.map((journey) => (
              <div key={journey.slug} className="mb-4">
                <JourneyCard journey={journey} />
              </div>
            ))}
          </MasonryGrid>
        )}
      </div>
    </main>
  );
}
