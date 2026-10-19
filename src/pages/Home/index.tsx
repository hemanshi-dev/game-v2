import { useCallback } from "react";
import { getGames } from "../../services/api";
import GameGrid from "../../components/game/GameGrid";
import GameCardSkeleton from "../../components/game/GameCardSkeleton";
import InfiniteScrollSentinel from "../../components/game/InfiniteScrollSentinel";
import HomeHero from "../../components/home/HomeHero";
import CategoryPills from "../../components/home/CategoryPills";
import { useInfiniteGames} from "../../hooks/useInfiniteGames";
import { Link } from "react-router-dom";

export default function Home() {
  const fetchFn = useCallback((p: number, l: number, s?: AbortSignal) => {
    return getGames(p, l, s);
  }, []);

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
    retryLoadMore,
  } = useInfiniteGames({
    fetchFn,
    enabled: true,
    pauseAtCheckpoints: false,
  });

  // Split games into two rows to simulate "Popular" and "New" if we have enough games
  const popularGames = games.slice(0, 6);
  const newGames = games.slice(6);

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen pb-12">
      <HomeHero />

      <CategoryPills />

      <div className="w-full space-y-8 px-4 py-6 lg:px-6">
        {/* POPULAR GAMES SECTION */}
        <section id="popular-games">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6 text-slate-800"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.58 12.09c-.11-1.66-1.52-2.95-3.18-2.95h-2.15l-1.89-3.78c-.28-.55-.84-.9-1.46-.9h-1.81V2.5c0-.28-.22-.5-.5-.5h-1c-.28 0-.5.22-.5.5v1.96h-1.81c-.62 0-1.18.35-1.46.9l-1.89 3.78H3.6c-1.66 0-3.07 1.29-3.18 2.95l-.36 5.4c-.05.74.2 1.48.69 2.05.49.57 1.18.9 1.93.9H5c.48 0 .93-.17 1.28-.48l2.97-2.61h5.5l2.97 2.61c.35.31.8.48 1.28.48h2.32c.75 0 1.44-.33 1.93-.9.49-.57.74-1.31.69-2.05l-.36-5.4zM7 11.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm7 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5z" />
              </svg>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Popular Games
              </h2>
            </div>
            <Link
              to="/trending"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All →
            </Link>
          </div>

          {/* Initial Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10">
              {Array.from({ length: 6 }).map((_, idx) => (
                <GameCardSkeleton key={idx} />
              ))}
            </div>
          )}

          {!isLoading && !error && popularGames.length > 0 && (
            <GameGrid games={popularGames} compact />
          )}
        </section>

        {/* NEW GAMES SECTION */}
        {!isLoading && !error && newGames.length > 0 && (
          <section id="new-games">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-orange-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.71 3.53C11.58 3.51 11.45 3.5 11.33 3.5 7.83 3.5 5 6.33 5 9.83c0 2.22 1.13 4.17 2.84 5.31C7.38 15.65 7 16.27 7 17c0 1.1.9 2 2 2 .55 0 1.05-.22 1.41-.59.36.37.86.59 1.41.59s1.05-.22 1.41-.59c.36.37.86.59 1.41.59 1.1 0 2-.9 2-2 0-.73-.38-1.35-.84-1.86C17.87 14 19 12.05 19 9.83c0-3.5-2.83-6.33-6.33-6.33-.32 0-.64.02-.96.03zm-1.07 10.63c-.15.22-.32.41-.52.59-.44-.61-1.03-1.12-1.74-1.42 1.06-.82 1.74-2.12 1.74-3.57 0-2.43-1.97-4.4-4.4-4.4-.14 0-.28.01-.42.02.77-.96 1.95-1.57 3.26-1.57 2.37 0 4.29 1.92 4.29 4.29 0 1.6-.88 3.01-2.21 3.76zM13 17c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z" />
                </svg>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  New Games
                </h2>
              </div>
              <Link
                to="/recent"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View All →
              </Link>
            </div>

            <GameGrid games={newGames} compact />

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
          </section>
        )}
      </div>
    </div>
  );
}
