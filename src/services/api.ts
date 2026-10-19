import type { Game, Category, TrendingGame } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export interface PlayGameResponse {
  gameId: string;
  playCount: number;
}

export async function recordGamePlay(
  id: string,
  signal?: AbortSignal,
): Promise<PlayGameResponse> {
  if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/games/play`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
      signal,
    });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Network error";
    throw new Error(`Failed to record game play: ${message}`);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to record game play (HTTP ${response.status}: ${response.statusText})`,
    );
  }

  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    typeof (data as PlayGameResponse).gameId !== "string" ||
    typeof (data as PlayGameResponse).playCount !== "number"
  ) {
    throw new Error("Unexpected API response shape for game play.");
  }

  return data as PlayGameResponse;
}

export async function getGames(
  page: number = 1,
  limit: number = 20,
  signal?: AbortSignal,
): Promise<Game[]> {
  if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  const url = `${BASE_URL}/games?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Network error";
    throw new Error(`Failed to fetch games: ${message}`);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch games (HTTP ${response.status}: ${response.statusText})`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(
      "Unexpected API response shape: expected an array of games.",
    );
  }

  return data as Game[];
}

export async function getGameById(
  id: string,
  signal?: AbortSignal,
): Promise<Game> {
  if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  const url = `${BASE_URL}/games/${encodeURIComponent(id)}`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Network error";
    throw new Error(`Failed to fetch game: ${message}`);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch game (HTTP ${response.status}: ${response.statusText})`,
    );
  }

  const data: unknown = await response.json();

  // Handle both array response [ { ...game } ] and single object { ...game }
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error("Game not found.");
    }
    return data[0] as Game;
  }

  if (data && typeof data === "object") {
    return data as Game;
  }

  throw new Error("Unexpected API response shape: expected game data.");
}

export async function getCategories(
  page: number = 1,
  limit: number = 10,
  signal?: AbortSignal,
): Promise<Category[]> {
  if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  const url = `${BASE_URL}/categories?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Network error";
    throw new Error(`Failed to fetch categories: ${message}`);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch categories (HTTP ${response.status}: ${response.statusText})`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(
      "Unexpected API response shape: expected an array of categories.",
    );
  }

  return data as Category[];
}

export async function getGamesByCategory(
  categoryName: string,
  page: number = 1,
  limit: number = 20,
  signal?: AbortSignal,
): Promise<Game[]> {
  if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  const isAll = !categoryName || categoryName.toLowerCase() === "all";
  const url = isAll
    ? `${BASE_URL}/games?category&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`
    : `${BASE_URL}/games?category=${encodeURIComponent(categoryName)}&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Network error";
    throw new Error(`Failed to fetch games by category: ${message}`);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch games by category (HTTP ${response.status}: ${response.statusText})`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(
      "Unexpected API response shape: expected an array of games.",
    );
  }

  return data as Game[];
}

export async function searchGames(
  query: string,
  page: number = 1,
  limit: number = 20,
  signal?: AbortSignal,
): Promise<Game[]> {
  if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const url = `${BASE_URL}/games?search=${encodeURIComponent(trimmedQuery)}&page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Network error";
    throw new Error(`Failed to search games: ${message}`);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to search games (HTTP ${response.status}: ${response.statusText})`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(
      "Unexpected API response shape: expected an array of games.",
    );
  }

  return data as Game[];
}

export async function getTrendingGames(
  signal?: AbortSignal,
): Promise<TrendingGame[]> {
  if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  const url = `${BASE_URL}/games/trending`;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    const message = err instanceof Error ? err.message : "Network error";
    throw new Error(`Failed to fetch trending games: ${message}`);
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch trending games (HTTP ${response.status}: ${response.statusText})`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error(
      "Unexpected API response shape: expected an array of trending games.",
    );
  }

  return data as TrendingGame[];
}
