import type { Game } from "../../types";
import GameCard from "./GameCard";

interface GameGridProps {
  games: Game[];
  compact?: boolean;
}

export default function GameGrid({ games, compact = false }: GameGridProps) {
  return (
    <div
      className={
        compact
          ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
          : "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10"
      }
    >
      {games.map((game) => (
        <GameCard
          key={game._id}
          id={game._id}
          slug={game.slug}
          title={game.title}
          thumbnailUrl={game.thumbnailUrl}
          rating={game.rating}
          categoryName={game.category?.name}
          tags={game.tags}
          playCount={game.playCount}
          compact={compact}
        />
      ))}
    </div>
  );
}
