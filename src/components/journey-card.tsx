import Link from "next/link";
import Image from "next/image";
import type { JourneyCard as JourneyCardType } from "@/types/journey";

interface JourneyCardProps {
  journey: JourneyCardType;
}

export function JourneyCard({ journey }: JourneyCardProps) {
  return (
    <Link href={`/journey/${journey.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-zinc-900">
        <div className="aspect-[4/5] relative">
          {journey.coverImage ? (
            <Image
              src={journey.coverImage}
              alt={journey.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <span>{journey.location}</span>
            <span className="text-zinc-600">·</span>
            <span>{new Date(journey.date).getFullYear()}</span>
          </div>
          <h2 className="text-lg font-medium text-white">{journey.title}</h2>
        </div>
      </div>
    </Link>
  );
}
