import { getAllJourneys } from "@/lib/journeys";
import { getSiteConfig } from "@/lib/site";
import { JourneyCard } from "@/components/journey-card";
import { ScrollReveal } from "@/components/scroll-reveal";

export const dynamic = "force-dynamic";

export default function Home() {
  const journeys = getAllJourneys();
  const site = getSiteConfig();

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <header className="mb-20">
          <h1 className="text-sm font-light text-zinc-500 tracking-widest uppercase">
            {site.title}
          </h1>
        </header>

        {journeys.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-600 text-sm">No journeys yet.</p>
          </div>
        ) : (
          <div className="space-y-32">
            {journeys.map((journey, index) => (
              <ScrollReveal key={journey.slug} delay={index * 100}>
                <JourneyCard journey={journey} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
