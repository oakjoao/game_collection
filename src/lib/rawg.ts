const RAWG_API_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY || "";
const BASE_URL = "https://api.rawg.io/api";

export interface RawgPlatform {
  id: number;
  name: string;
  slug: string;
}

export interface RawgScreenshot {
  id: number;
  image: string;
}

export interface RawgRating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

export interface RawgStore {
  id: number;
  store: {
    id: number;
    name: string;
    slug: string;
    domain: string;
  };
  url: string;
}

export interface RawgDeveloper {
  id: number;
  name: string;
  slug: string;
}

export interface RawgPublisher {
  id: number;
  name: string;
  slug: string;
}

export interface RawgTag {
  id: number;
  name: string;
  slug: string;
}

export interface RawgEsrbRating {
  id: number;
  name: string;
  slug: string;
}

export interface RawgGame {
  id: number;
  name: string;
  slug: string;
  background_image: string | null;
  background_image_additional: string | null;
  released: string | null;
  metacritic: number | null;
  genres: { id: number; name: string }[];
  platforms: { platform: RawgPlatform }[];
}

export interface RawgGameDetails extends RawgGame {
  description_raw: string | null;
  description: string | null;
  rating: number;
  rating_top: number;
  ratings: RawgRating[];
  ratings_count: number;
  reviews_count: number;
  playtime: number;
  developers: RawgDeveloper[];
  publishers: RawgPublisher[];
  tags: RawgTag[];
  esrb_rating: RawgEsrbRating | null;
  stores: RawgStore[];
  website: string | null;
  reddit_url: string | null;
  updated: string | null;
  achievements_count: number;
  parent_platforms: { platform: { id: number; name: string; slug: string } }[];
}

export interface RawgSearchResponse {
  count: number;
  results: RawgGame[];
  next: string | null;
}

export async function searchGames(
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<RawgSearchResponse> {
  if (!query.trim()) {
    return { count: 0, results: [], next: null };
  }

  const params = new URLSearchParams({
    key: RAWG_API_KEY,
    search: query,
    page: String(page),
    page_size: String(pageSize),
  });

  const res = await fetch(`${BASE_URL}/games?${params}`);

  if (!res.ok) {
    throw new Error(`RAWG API error: ${res.status}`);
  }

  return res.json();
}

export async function getGameDetails(id: number): Promise<RawgGameDetails> {
  const params = new URLSearchParams({ key: RAWG_API_KEY });
  const res = await fetch(`${BASE_URL}/games/${id}?${params}`);

  if (!res.ok) {
    throw new Error(`RAWG API error: ${res.status}`);
  }

  return res.json();
}

export async function getGameScreenshots(id: number): Promise<RawgScreenshot[]> {
  const params = new URLSearchParams({ key: RAWG_API_KEY });
  const res = await fetch(`${BASE_URL}/games/${id}/screenshots?${params}`);

  if (!res.ok) {
    throw new Error(`RAWG API error: ${res.status}`);
  }

  const data = await res.json();
  return data.results;
}

// Map RAWG platform names to our console drawer names
export function mapPlatformToConsole(platformName: string): string | null {
  const map: Record<string, string> = {
    "Nintendo Switch": "Switch",
    "Nintendo Switch 2": "Switch 2",
    "Nintendo 3DS": "3DS",
    "Nintendo DS": "DS",
    "Nintendo DSi": "DS",
    "PS Vita": "PS Vita",
    "PSP": "PS Vita",
    "PlayStation 5": "PS5",
    "Wii": "Wii",
    "Wii U": "Wii",
  };

  return map[platformName] || null;
}
