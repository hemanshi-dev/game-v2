import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Game } from "../../types";
import { getGameById, getGames, recordGamePlay } from "../../services/api";

export default function GamePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [recommendations, setRecommendations] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(
    id ? null : "Game ID is required.",
  );

  useEffect(() => {
    if (!id) return;

    let ignore = false;
    const controller = new AbortController();

    setIsLoading(true);
    setIsPlaying(false);
    setError(null);

    Promise.all([
      getGameById(id, controller.signal),
      // Recommendations are optional. Do not fail the game page if this
      // secondary request is unavailable.
      getGames(1, 40, controller.signal).catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") {
          throw err;
        }
        return [];
      }),
    ])
      .then(([gameData, gamesData]) => {
        if (!ignore) {
          setGame(gameData);
          setRecommendations(gamesData.filter((g) => g._id !== id));
          setIsLoading(false);
          // Increment play count silently when page loads
          recordGamePlay(id).catch(() => {});
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }
          setError("Unable to load game.");
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <p className="mb-4 text-lg font-medium text-red-500">
          {error || "Game not found."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const playUrl = game.publicEmbedUrl || game.iframeUrl || "";
  const categoryNames = game.categories
    .map((category) =>
      typeof category === "string" ? category : category.name,
    )
    .filter(Boolean);
  const genres = game.providerMetadata?.genres?.length
    ? game.providerMetadata.genres
    : categoryNames;
  const updatedDate = game.updatedAt
    ? new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(
        new Date(game.updatedAt),
      )
    : "Not available";
  const supportedDevices =
    game.providerMetadata?.mobileReady?.join(", ") ||
    (game.mobileSupported ? "Desktop, phone and tablet" : "Desktop");
  const supportedLanguages =
    game.providerMetadata?.supportedLanguages?.join(", ") || "Not specified";
  const providerName = game.provider?.name || "Unknown";

  if (isPlaying) {
    return (
      <div className="fixed inset-0 z-[9999] h-screen w-screen bg-[#0f172a] overflow-hidden">
        {/* Back Button Overlay */}
        <button
          onClick={() => setIsPlaying(false)}
          className="absolute left-4 top-4 z-[10000] flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900/60 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-slate-900/90 active:scale-95 shadow-lg border border-white/10"
          aria-label="Exit Game"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Game Iframe */}
        {playUrl ? (
          <iframe
            src={playUrl}
            title={game.title}
            allow="autoplay; fullscreen; gamepad; focus-without-user-activation *;"
            sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin allow-downloads"
            className="h-full w-full border-0 bg-transparent"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white">
            <p>Game URL not available.</p>
          </div>
        )}
      </div>
    );
  }

  // Determine classes for grid items to make it look like a masonry
  const getGridClass = (index: number) => {
    if (index === 0) return "col-span-2 row-span-2";
    if (index === 3 || index === 7) return "col-span-2 row-span-2";
    if (index % 5 === 0) return "col-span-1 row-span-2";
    if (index % 8 === 0) return "col-span-2 row-span-1";
    return "col-span-1 row-span-1";
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-slate-50 p-4 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 md:p-6 lg:p-8">
      {/* Top Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>

      <div className="mx-auto max-w-[1600px]">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 auto-rows-[120px] md:auto-rows-[140px]">
          {/* Main Game Banner - Takes up a large chunk in the center-ish, but for simple CSS Grid we can just put it first or span it explicitly */}
          <div className="col-span-2 sm:col-span-4 md:col-span-6 lg:col-span-6 row-span-3 relative rounded-2xl overflow-hidden shadow-lg group">
            <img
              src={game.bannerUrl || game.thumbnailUrl}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-6">
              <div className="flex items-start justify-between">
                {game.trending && (
                  <span className="flex items-center rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-orange-400 border border-orange-500/30">
                    <span className="mr-1.5">🔥</span> Trending
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center self-center mb-8">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-10 py-4 text-xl font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 z-10"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Now
                </button>
                <h1 className="mt-6 text-3xl md:text-5xl font-black text-white text-center drop-shadow-md">
                  {game.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Surrounding Recommendation Grid */}
          {recommendations.slice(0, 30).map((rec, i) => (
            <div
              key={rec._id}
              onClick={() => navigate(`/game/${rec._id}`)}
              className={`${getGridClass(i)} relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all group`}
            >
              <img
                src={rec.thumbnailUrl}
                alt={rec.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>

        <section className="mt-8 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-6">
            <div className="flex flex-col gap-5 sm:flex-row">
              <img
                src={game.thumbnailUrl}
                alt=""
                className="h-28 w-28 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap gap-2">
                  {categoryNames.slice(0, 4).map((category) => (
                    <span
                      key={category}
                      className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold capitalize text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {game.title}
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  by {providerName}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {game.description}
                </p>
              </div>
              <button
                onClick={() => setIsPlaying(true)}
                className="h-11 shrink-0 rounded-xl bg-blue-600 px-7 font-bold text-white transition hover:bg-blue-500"
              >
                Play Game
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm dark:border-slate-700 dark:bg-slate-700 md:grid-cols-4">
            {[
              ["★", "Rating", `${game.rating ?? "—"} / 5`],
              ["▶", "Plays", (game.playCount ?? 0).toLocaleString()],
              ["⚡", "Updated", updatedDate],
              ["▣", "Orientation", game.orientation || "Any"],
            ].map(([icon, label, value]) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-white p-5 dark:bg-slate-800"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  {icon}
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-bold capitalize text-slate-800 dark:text-white">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-6">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              🎮 About this game
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">
              {game.description}
            </p>
            {game.providerMetadata?.howToPlayText && (
              <>
                <h3 className="mt-6 font-bold text-slate-900 dark:text-white">
                  How to play
                </h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {game.providerMetadata.howToPlayText}
                </p>
              </>
            )}
            {genres.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                  >
                    ✓ {genre}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-6">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              ⓘ Game details
            </h2>
            <dl className="mt-5 grid gap-x-10 md:grid-cols-2">
              {[
                ["Developer", providerName],
                ["Genre", genres.join(", ") || "Not specified"],
                ["Supported devices", supportedDevices],
                ["Latest update", updatedDate],
                ["Rating", `${game.rating ?? "—"} / 5`],
                ["Language", supportedLanguages],
                ["Game mode", "Single player"],
                ["Version", game.providerMetadata?.version || "1.0.0"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[8rem_1fr] gap-3 border-b border-slate-100 py-3 text-sm dark:border-slate-700"
                >
                  <dt className="font-bold text-slate-700 dark:text-slate-200">
                    {label}
                  </dt>
                  <dd className="capitalize text-slate-500 dark:text-slate-400">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}
