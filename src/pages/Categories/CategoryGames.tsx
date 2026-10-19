import { useCallback } from "react";
import { getGamesByCategory } from "../../services/api";
import GameGrid from "../../components/game/GameGrid";
import GameCardSkeleton from "../../components/game/GameCardSkeleton";
import InfiniteScrollSentinel from "../../components/game/InfiniteScrollSentinel";
import { useInfiniteGames, PAGE_SIZE } from "../../hooks/useInfiniteGames";

interface CategoryGamesProps {
  categoryName: string;
}

export default function CategoryGames({ categoryName }: CategoryGamesProps) {
  const fetchFn = useCallback(
    (p: number, l: number, s?: AbortSignal) => {
      return getGamesByCategory(categoryName, p, l, s);
    },
    [categoryName],
  );

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
  } = useInfiniteGames({
    fetchFn,
    enabled: Boolean(categoryName),
    resetKey: categoryName,
    pauseAtCheckpoints: false,
  });

  return (
    <div id="category-games-section" className="mt-4">
      {/* Initial Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
            <GameCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {/* Initial Error State */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
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

      {/* Empty State */}
      {!isLoading && !error && games.length === 0 && (
        <div className="py-12 text-center text-xs text-gray-500 ">
          No games found in this category.
        </div>
      )}

      {/* Real Continuous Games Grid */}
      {!isLoading && !error && games.length > 0 && (
        <GameGrid games={games} compact />
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
  );
}
