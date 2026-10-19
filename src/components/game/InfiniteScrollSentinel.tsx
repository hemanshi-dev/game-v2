import { useEffect, useRef } from "react";

interface InfiniteScrollSentinelProps {
  onIntersect: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  isCheckpointReached: boolean;
  onLoadMoreClick: () => void;
  loadMoreError: string | null;
  onRetry: () => void;
  rootMargin?: string;
}

export default function InfiniteScrollSentinel({
  onIntersect,
  hasMore,
  isLoadingMore,
  isCheckpointReached,
  onLoadMoreClick,
  loadMoreError,
  onRetry,
  rootMargin = "300px",
}: InfiniteScrollSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isIntersectingRef = useRef(false);
  const hasUserScrolledRef = useRef(false);

  // Listen for initial user scroll/interaction to activate sentinel
  useEffect(() => {
    // If user is already scrolled down, mark as active
    if (window.scrollY > 10) {
      hasUserScrolledRef.current = true;
    } else {
      hasUserScrolledRef.current = false;
    }

    const cleanup = () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("touchmove", handleInteraction);
    };

    const handleScroll = () => {
      if (window.scrollY > 10) {
        hasUserScrolledRef.current = true;
        if (
          isIntersectingRef.current &&
          !isLoadingMore &&
          !loadMoreError &&
          !isCheckpointReached
        ) {
          onIntersect();
        }
        cleanup();
      }
    };

    const handleInteraction = () => {
      hasUserScrolledRef.current = true;
      if (
        isIntersectingRef.current &&
        !isLoadingMore &&
        !loadMoreError &&
        !isCheckpointReached
      ) {
        onIntersect();
      }
      cleanup();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleInteraction, { passive: true });
    window.addEventListener("touchmove", handleInteraction, { passive: true });

    return cleanup;
  }, [onIntersect, isLoadingMore, loadMoreError, isCheckpointReached]);

  useEffect(() => {
    // If no more data, currently loading, in error state, or checkpoint reached: do not observe
    if (!hasMore || isLoadingMore || loadMoreError || isCheckpointReached) {
      return;
    }

    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;

        isIntersectingRef.current = entry.isIntersecting;

        if (entry.isIntersecting) {
          // If the page just mounted at scroll position 0 and user hasn't scrolled, do not auto-request page 2
          if (!hasUserScrolledRef.current && window.scrollY <= 10) {
            return;
          }
          onIntersect();
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      },
    );

    observer.observe(currentSentinel);

    return () => {
      observer.disconnect();
    };
  }, [
    onIntersect,
    hasMore,
    isLoadingMore,
    loadMoreError,
    isCheckpointReached,
    rootMargin,
  ]);

  // If there are no more games to load, do not render sentinel or controls
  // This allows the footer to appear naturally directly after the game grid
  if (!hasMore) {
    return null;
  }

  return (
    <div className="w-full py-6 text-center">
      {/* 1. Sentinel element for automatic infinite scrolling (active only before checkpoint) */}
      {!isCheckpointReached && !loadMoreError && (
        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
      )}

      {/* 2. Checkpoint control: User-controlled [ Load More Games ] button */}
      {isCheckpointReached && !loadMoreError && (
        <div className="flex flex-col items-center justify-center gap-2">
          <button
            type="button"
            onClick={onLoadMoreClick}
            disabled={isLoadingMore}
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors sm:text-sm"
          >
            {isLoadingMore ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More Games</span>
            )}
          </button>
        </div>
      )}

      {/* 3. Automatic Next-Page Loading Indicator */}
      {!isCheckpointReached && isLoadingMore && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-center gap-2 py-3 text-xs font-medium text-gray-500 "
        >
          <svg
            className="h-4 w-4 animate-spin text-blue-600 "
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading more games...</span>
        </div>
      )}

      {/* 4. Error during next-page loading or checkpoint Load More */}
      {loadMoreError && (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-2 py-4 text-center"
        >
          <p className="text-xs font-medium text-red-600 ">{loadMoreError}</p>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 active:bg-blue-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
