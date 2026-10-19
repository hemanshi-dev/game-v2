import { useState, useEffect, useRef, useCallback } from "react";
import type { Game } from "../types";

export const PAGE_SIZE = 20;
export const CHECKPOINT_SIZE = 100;

export type FetchGamesFn = (
  page: number,
  limit: number,
  signal?: AbortSignal,
) => Promise<Game[]>;

interface UseInfiniteGamesOptions {
  fetchFn: FetchGamesFn;
  enabled?: boolean;
  pauseAtCheckpoints?: boolean;
  // Optional key (e.g. categoryName, query) that triggers complete state reset when changed
  resetKey?: string;
}

export function useInfiniteGames({
  fetchFn,
  enabled = true,
  pauseAtCheckpoints = true,
  resetKey = "",
}: UseInfiniteGamesOptions) {
  const [games, setGames] = useState<Game[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [isCheckpointReached, setIsCheckpointReached] = useState(false);

  // Guard refs to prevent race conditions and duplicate calls
  const isFetchingRef = useRef(false);
  const inFlightPageRef = useRef<number | null>(null);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const gamesCountRef = useRef(0);
  const prevResetKeyRef = useRef(resetKey);
  const activeControllerRef = useRef<AbortController | null>(null);
  const checkpointTargetRef = useRef(CHECKPOINT_SIZE);
  const isCheckpointReachedRef = useRef(false);

  // Track whether the user has actually initiated scrolling down on the current dataset
  const hasUserScrolledRef = useRef(false);

  // Sync refs inside effect
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    isCheckpointReachedRef.current = isCheckpointReached;
  }, [isCheckpointReached]);

  // Detect user scroll/interaction on this dataset to prevent initial mount from auto-firing page 2
  useEffect(() => {
    hasUserScrolledRef.current = false;

    const handleScroll = () => {
      if (window.scrollY > 10) {
        hasUserScrolledRef.current = true;
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("wheel", handleInteraction);
        window.removeEventListener("touchmove", handleInteraction);
      }
    };

    const handleInteraction = () => {
      hasUserScrolledRef.current = true;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("touchmove", handleInteraction);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleInteraction, { passive: true });
    window.addEventListener("touchmove", handleInteraction, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("touchmove", handleInteraction);
    };
  }, [resetKey]);

  // Reset function when query/category changes
  const reset = useCallback(() => {
    if (activeControllerRef.current) {
      activeControllerRef.current.abort();
      activeControllerRef.current = null;
    }
    isFetchingRef.current = false;
    inFlightPageRef.current = null;
    pageRef.current = 1;
    hasMoreRef.current = true;
    gamesCountRef.current = 0;
    checkpointTargetRef.current = CHECKPOINT_SIZE;
    isCheckpointReachedRef.current = false;
    hasUserScrolledRef.current = false;
    setGames([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setLoadMoreError(null);
    setIsCheckpointReached(false);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // Core fetch function for page N
  const fetchPage = useCallback(
    async (pageToFetch: number) => {
      // 1. Verification guards
      if (
        isFetchingRef.current ||
        inFlightPageRef.current !== null ||
        !hasMoreRef.current
      ) {
        return;
      }

      const isInitial = pageToFetch === 1;

      // Prevent re-requesting already loaded pages on subsequent requests
      if (!isInitial && pageToFetch <= pageRef.current) {
        return;
      }

      isFetchingRef.current = true;
      inFlightPageRef.current = pageToFetch;

      if (isInitial) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
        setLoadMoreError(null);
      }

      // Abort previous request if still in flight
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
      }
      const controller = new AbortController();
      activeControllerRef.current = controller;

      try {
        const newGames = await fetchFn(
          pageToFetch,
          PAGE_SIZE,
          controller.signal,
        );

        // Determine if more pages exist: if returned items < PAGE_SIZE, this is the last page
        const moreAvailable = newGames.length >= PAGE_SIZE;
        hasMoreRef.current = moreAvailable;
        setHasMore(moreAvailable);

        if (isInitial) {
          gamesCountRef.current = newGames.length;
          setGames(newGames);
        } else {
          setGames((prev) => {
            // Avoid potential duplicate IDs if backend order shifts
            const existingIds = new Set(prev.map((g) => g._id));
            const filteredNew = newGames.filter((g) => !existingIds.has(g._id));
            const updated = [...prev, ...filteredNew];
            gamesCountRef.current = updated.length;
            return updated;
          });
        }

        pageRef.current = pageToFetch;
        setPage(pageToFetch);

        // Evaluate checkpoint:
        // Pause automatic loading when current total games reaches or exceeds the checkpoint target
        const currentTotal = isInitial
          ? newGames.length
          : gamesCountRef.current + newGames.length;
        if (
          pauseAtCheckpoints &&
          moreAvailable &&
          currentTotal >= checkpointTargetRef.current
        ) {
          isCheckpointReachedRef.current = true;
          setIsCheckpointReached(true);
        } else {
          isCheckpointReachedRef.current = false;
          setIsCheckpointReached(false);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Handled or canceled intentionally; do not set error
          return;
        }
        const errorMsg =
          pageToFetch === 1
            ? "Unable to load games."
            : "Unable to load more games.";

        if (isInitial) {
          setError(errorMsg);
        } else {
          setLoadMoreError(errorMsg);
        }
      } finally {
        isFetchingRef.current = false;
        inFlightPageRef.current = null;
        if (isInitial) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [fetchFn, pauseAtCheckpoints],
  );

  // Handle resetKey changes (e.g. category switch or new search query)
  useEffect(() => {
    if (prevResetKeyRef.current !== resetKey) {
      prevResetKeyRef.current = resetKey;
      reset();
      if (enabled) {
        const timer = setTimeout(() => {
          fetchPage(1);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [resetKey, enabled, reset, fetchPage]);

  // Initial load on mount or when enabled transitions from false to true
  useEffect(() => {
    if (
      enabled &&
      games.length === 0 &&
      !isFetchingRef.current &&
      hasMoreRef.current &&
      !error
    ) {
      const timer = setTimeout(() => {
        fetchPage(1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [enabled, games.length, error, fetchPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
      }
    };
  }, []);

  // Public: load next page (called by IntersectionObserver sentinel during automatic infinite scroll)
  const loadMore = useCallback(() => {
    // Prevent old scroll position / initial mount transition from triggering page 2
    if (
      pageRef.current === 1 &&
      !hasUserScrolledRef.current &&
      window.scrollY <= 10
    ) {
      return;
    }

    if (
      isFetchingRef.current ||
      inFlightPageRef.current !== null ||
      !hasMoreRef.current ||
      isLoading ||
      isLoadingMore ||
      error ||
      loadMoreError ||
      isCheckpointReachedRef.current
    ) {
      return;
    }
    const nextPage = pageRef.current + 1;
    fetchPage(nextPage);
  }, [fetchPage, isLoading, isLoadingMore, error, loadMoreError]);

  // Public: handle explicit user click on [ Load More Games ] button at a checkpoint
  const handleLoadMoreClick = useCallback(() => {
    if (
      isFetchingRef.current ||
      inFlightPageRef.current !== null ||
      !hasMoreRef.current ||
      isLoadingMore
    ) {
      return;
    }

    // Advance checkpoint target to the next checkpoint boundary (e.g. 100 -> 200 -> 300)
    const currentCount = gamesCountRef.current;
    const nextTarget =
      Math.floor(currentCount / CHECKPOINT_SIZE) * CHECKPOINT_SIZE +
      CHECKPOINT_SIZE;
    checkpointTargetRef.current =
      nextTarget > currentCount ? nextTarget : currentCount + CHECKPOINT_SIZE;

    isCheckpointReachedRef.current = false;
    setIsCheckpointReached(false);
    setLoadMoreError(null);

    // Mark as user scrolled so subsequent automatic infinite loading works smoothly
    hasUserScrolledRef.current = true;

    const nextPage = pageRef.current + 1;
    fetchPage(nextPage);
  }, [fetchPage, isLoadingMore]);

  // Retry initial page 1
  const retryInitial = useCallback(() => {
    setError(null);
    fetchPage(1);
  }, [fetchPage]);

  // Retry the failed page N (without resetting to page 1)
  const retryLoadMore = useCallback(() => {
    setLoadMoreError(null);
    const pageToRetry = pageRef.current + 1;
    fetchPage(pageToRetry);
  }, [fetchPage]);

  return {
    games,
    page,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMoreError,
    isCheckpointReached,
    loadMore,
    handleLoadMoreClick,
    retryInitial,
    retryLoadMore,
    reset,
  };
}
