import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { searchGames } from "../../services/api";
import GameGrid from "../../components/game/GameGrid";
import GameCardSkeleton from "../../components/game/GameCardSkeleton";
import InfiniteScrollSentinel from "../../components/game/InfiniteScrollSentinel";
import { useInfiniteGames, PAGE_SIZE } from "../../hooks/useInfiniteGames";

const DEBOUNCE_DELAY_MS = 2000;

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [submittedQuery, setSubmittedQuery] = useState(queryParam.trim());

  // Tracking refs
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevQueryParamRef = useRef(queryParam);

  // Automatically place cursor in search bar on page mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Clear debounce timer helper
  const clearDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  // Fetch function for search
  const fetchFn = useCallback(
    (page: number, limit: number, signal?: AbortSignal) => {
      return searchGames(submittedQuery, page, limit, signal);
    },
    [submittedQuery],
  );

  // Use infinite loading hook
  const {
    games,
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
  } = useInfiniteGames({
    fetchFn,
    enabled: Boolean(submittedQuery),
    resetKey: submittedQuery,
  });

  // Execute Search: immediately commit search query, clear timer, update URL
  const executeSearch = useCallback(
    (targetQuery: string) => {
      clearDebounceTimer();
      const trimmed = targetQuery.trim();

      if (!trimmed) {
        setSubmittedQuery("");
        setSearchParams({});
        reset();
        return;
      }

      // If already showing this query and no initial error, don't re-trigger unless needed
      if (trimmed === submittedQuery && !error) {
        return;
      }

      setSubmittedQuery(trimmed);
      setSearchParams({ q: trimmed });
    },
    [clearDebounceTimer, error, reset, setSearchParams, submittedQuery],
  );

  // Sync with URL query parameter changes
  useEffect(() => {
    if (prevQueryParamRef.current !== queryParam) {
      prevQueryParamRef.current = queryParam;
      const timer = setTimeout(() => {
        setSearchTerm(queryParam);
        setSubmittedQuery(queryParam.trim());
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [queryParam]);

  // Controlled input change handler with 2-second debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    clearDebounceTimer();

    const trimmed = val.trim();
    if (!trimmed) {
      // Empty or whitespace: clear immediately without calling API
      setSubmittedQuery("");
      setSearchParams({});
      reset();
      return;
    }

    // Schedule 2-second debounce API request
    debounceTimerRef.current = setTimeout(() => {
      executeSearch(val);
    }, DEBOUNCE_DELAY_MS);
  };

  // Handle Enter key on input for immediate search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch(searchTerm);
    }
  };

  // Handle explicit Search button click or form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchTerm);
  };

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      clearDebounceTimer();
    };
  }, [clearDebounceTimer]);

  const handleClear = () => {
    clearDebounceTimer();
    setSearchTerm("");
    setSubmittedQuery("");
    setSearchParams({});
    reset();
  };

  const hasSearched = Boolean(submittedQuery);

  return (
    <div className="mx-auto w-full px-4 py-4 sm:px-6 sm:py-6">
      {/* 1. Page Header (Compact) */}
      <div className="mb-3">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl ">
          Search Games
        </h1>
        <p className="mt-0.5 text-xs text-gray-600 sm:text-sm ">
          Find games by title across all categories
        </p>
      </div>

      {/* 2. Compact Search Input & Action Button */}
      <form
        onSubmit={handleFormSubmit}
        className="relative mb-5 flex items-center"
      >
        <input
          ref={inputRef}
          type="text"
          autoFocus
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search games by title..."
          aria-label="Search games by title"
          className="h-11 w-full rounded-xl border border-gray-300 bg-white dark:bg-slate-800 pl-4 pr-20 text-sm text-gray-900 dark:text-white shadow-2xs placeholder-gray-400 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 :border-blue-400"
        />

        {/* Right action controls */}
        <div className="absolute right-1 flex items-center gap-0.5">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 active:bg-gray-100 :text-gray-200 :bg-gray-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          <button
            type="submit"
            aria-label="Search now"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 active:bg-blue-100 :bg-gray-700 :bg-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* 3. Search Results Section */}
      <div>
        {/* Initial Empty Search State (before user types) */}
        {!searchTerm.trim() && !isLoading && !hasSearched && (
          <div className="flex flex-col items-center justify-center py-10 text-center sm:py-14">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="mt-2.5 text-base font-bold text-gray-900 dark:text-white sm:text-lg ">
              Search for your next game
            </h2>
            <p className="mt-1 max-w-xs text-xs text-gray-500 ">
              Type a game title above. Results will update automatically.
            </p>
          </div>
        )}

        {/* Initial Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
            {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
              <GameCardSkeleton key={idx} />
            ))}
          </div>
        )}

        {/* Initial Error State */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm font-medium text-red-600 ">{error}</p>
            <button
              type="button"
              onClick={retryInitial}
              className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty Results State */}
        {!isLoading && !error && hasSearched && games.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center sm:py-14">
            <h2 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg ">
              No games found
            </h2>
            <p className="mt-1 text-xs text-gray-500 ">
              Try a different search.
            </p>
          </div>
        )}

        {/* Game Results Grid */}
        {!isLoading && !error && games.length > 0 && (
          <div>
            <div className="mb-3 text-xs font-medium text-gray-500 ">
              Results for{" "}
              <span className="font-semibold text-gray-900 dark:text-white ">
                "{submittedQuery}"
              </span>
            </div>
            <GameGrid games={games} />
          </div>
        )}

        {/* Seamless Infinite Scroll Sentinel */}
        {!isLoading && !error && games.length > 0 && (
          <InfiniteScrollSentinel
            onIntersect={loadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            isCheckpointReached={isCheckpointReached}
            onLoadMoreClick={handleLoadMoreClick}
            loadMoreError={loadMoreError}
            onRetry={retryLoadMore}
            rootMargin="300px"
          />
        )}
      </div>
    </div>
  );
}
