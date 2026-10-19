export interface Provider {
  _id: string;
  name: string;
  monetizationStatus?: string;
  rightsStatus?: string;
  status?: string;
  type?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  order?: number;
  description?: string;
  image?: string;
}

export interface OriginalVideo {
  playgama_id?: string;
  external_url?: string;
  type?: string;
}

export interface RawOrientation {
  horizontal?: boolean;
  vertical?: boolean;
}

export interface ProviderMetadata {
  playgamaId?: string;
  playgamaSlug?: string;
  howToPlayText?: string;
  playgamaGameUrl?: string;
  supportedLanguages?: string[];
  gender?: string[];
  inGamePurchases?: boolean;
  originalImages?: string[];
  originalVideos?: OriginalVideo[];
  mobileReady?: string[];
  rawOrientation?: RawOrientation;
  genres?: string[];
  images?: string[];
  version?: string;
}

export interface Game {
  _id: string;
  provider: Provider;
  providerGameId: string;
  categories: Array<string | Category>;
  category?: Category | null;
  bannerUrl?: string;
  description: string;
  hoverVideoUrl?: string;
  iframeUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  mobileSupported?: boolean;
  monetizedEmbedUrl?: string;
  orientation?: string;
  playCount?: number;
  providerMetadata?: ProviderMetadata;
  publicEmbedUrl?: string;
  rating?: number;
  rightsStatus?: string;
  slug: string;
  sortOrder?: number;
  tags?: string[];
  thumbnailUrl: string;
  title: string;
  trending?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type GamesResponse = Game[];

export interface TrendingGame {
  _id: string;
  slug: string;
  isFeatured?: boolean;
  playCount?: number;
  tags?: string[];
  thumbnailUrl: string;
  title: string;
}
