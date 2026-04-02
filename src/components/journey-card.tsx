import Link from "next/link";
import Image from "next/image";
import type { JourneyCard as JourneyCardType } from "@/types/journey";

interface JourneyCardProps {
  journey: JourneyCardType;
}

export function JourneyCard({ journey }: JourneyCardProps) {
  return (
    <Link href={`/journey/${journey.slug}`} className="group block">
      <div className="aspect-[3/2] relative overflow-hidden">
        {journey.coverImage ? (
          <Image
            src={journey.coverImage}
            alt={journey.title}
            fill
            sizes="(max-width: 640px) 100vw, 896px"
            className="object-cover transition-opacity duration-500 group-hover:opacity-90"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <h2 className="text-sm font-light text-zinc-400 group-hover:text-zinc-300 transition-colors">
          {journey.title}
        </h2>
        <span className="text-xs text-zinc-600">
          {journey.location} · {new Date(journey.date).getFullYear()}
        </span>
      </div>
    </Link>
  );
}
