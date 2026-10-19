import { useState, useEffect } from "react";
import type { Category } from "../types";
import { getCategories } from "../services/api";

// Fallback initial categories for instantaneous render and offline fallback
export const FALLBACK_CATEGORIES: Category[] = [
  { _id: "action", name: "Action", slug: "action" },
  { _id: "adventure", name: "Adventure", slug: "adventure" },
  { _id: "arcade", name: "Arcade", slug: "arcade" },
  { _id: "casual", name: "Casual", slug: "casual" },
  { _id: "puzzle", name: "Puzzle", slug: "puzzle" },
  { _id: "racing", name: "Racing", slug: "racing" },
  { _id: "sports", name: "Sports", slug: "sports" },
  { _id: "strategy", name: "Strategy", slug: "strategy" },
  { _id: "simulation", name: "Simulation", slug: "simulation" },
  { _id: "kids", name: "Kids", slug: "kids" },
  { _id: "multiplayer", name: "Multiplayer", slug: "multiplayer" },
];

// In-memory cache so categories are fetched at most once across the whole session
let cachedCategories: Category[] | null = null;
let fetchPromise: Promise<Category[]> | null = null;

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(
    cachedCategories || FALLBACK_CATEGORIES,
  );
  const [isLoading, setIsLoading] = useState(!cachedCategories);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    if (cachedCategories) {
      return;
    }

    if (!fetchPromise) {
      fetchPromise = getCategories(1, 50)
        .then((data) => {
          if (data && data.length > 0) {
            cachedCategories = data;
          } else {
            cachedCategories = FALLBACK_CATEGORIES;
          }
          fetchPromise = null;
          return cachedCategories;
        })
        .catch((err) => {
          fetchPromise = null;
          cachedCategories = FALLBACK_CATEGORIES;
          throw err;
        });
    }

    fetchPromise
      .then((data) => {
        if (!ignore) {
          setCategories(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Failed to load categories",
          );
          setCategories(FALLBACK_CATEGORIES);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { categories, isLoading, error };
}
