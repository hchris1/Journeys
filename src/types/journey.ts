export interface JourneyMetadata {
  title: string;
  description: string;
  date: string;
  location: string;
  coverImage?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Journey extends JourneyMetadata {
  slug: string;
  images: ImageData[];
}

export interface ImageData {
  filename: string;
  thumb: string;
  medium: string;
  full: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export interface JourneyCard {
  slug: string;
  title: string;
  description: string;
  date: string;
  location: string;
  coverImage: string;
}
