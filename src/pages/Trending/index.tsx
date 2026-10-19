import { useEffect, useState } from "react";
import type { TrendingGame } from "../../types";
import { getTrendingGames } from "../../services/api";
import GameCard from "../../components/game/GameCard";
import GameCardSkeleton from "../../components/game/GameCardSkeleton";

function Trending() {
  const [games, setGames] = useState<TrendingGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    getTrendingGames(controller.signal)
      .then((data) => {
        if (!ignore) {
          setGames(data);
          setIsLoading(false);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }
          setError("Unable to load trending games.");
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [retryTrigger]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setRetryTrigger((prev) => prev + 1);
  };

  return (
    <div className="mx-auto w-full px-4 py-4 sm:px-6 sm:py-6">
      {/* 1. Page Header (Compact & Mobile-first) */}
      <div className="mb-4">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl ">
          Trending Games
        </h1>
        <p className="mt-0.5 text-xs text-gray-600 sm:text-sm ">
          Most played and highly rated games right now
        </p>
      </div>

      {/* 2. Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
          {Array.from({ length: 8 }).map((_, idx) => (
            <GameCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {/* 3. Error State */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium text-red-600 ">{error}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800"
          >
            Try again
          </button>
        </div>
      )}

      {/* 4. Empty State */}
      {!isLoading && !error && games.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-gray-500 ">No trending games found.</p>
        </div>
      )}

      {/* 5. Trending Games Grid */}
      {!isLoading && !error && games.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
          {games.map((game) => (
            <GameCard
              key={game._id}
              id={game._id}
              slug={game.slug}
              title={game.title}
              thumbnailUrl={game.thumbnailUrl}
              tags={game.tags}
              playCount={game.playCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Trending;
