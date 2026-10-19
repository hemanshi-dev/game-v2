import { useState } from 'react'
import { Link } from 'react-router-dom'

interface GameCardProps {
  id: string
  slug: string
  title: string
  thumbnailUrl: string
  rating?: number
  categoryName?: string
  tags?: string[]
  playCount?: number
  compact?: boolean
}

export default function GameCard({
  id,
  title,
  thumbnailUrl,
  
  categoryName,
  tags,
  compact = false,
}: GameCardProps) {
  const [imageError, setImageError] = useState(false)

  const displayTags = [categoryName, ...(tags || [])].filter(Boolean).slice(0, 2)

  return (
    <Link
      to={`/game/${id}`}
      className={`group flex flex-col overflow-hidden bg-white shadow-sm transition-transform active:scale-95 hover:-translate-y-0.5 hover:shadow-md border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:shadow-none ${compact ? "rounded-xl" : "rounded-2xl"}`}
    >
      <div className={`relative w-full overflow-hidden bg-slate-100 dark:bg-slate-700 ${compact ? "aspect-[4/3]" : "aspect-square"}`}>
        {!imageError ? (
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-300 sm:group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 14a8 8 0 1016 0A8 8 0 004 14z" />
            </svg>
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "gap-1.5 p-2" : "gap-2 p-3 sm:p-4"}`}>
        <h3 className={`${compact ? "text-[13px]" : "text-[15px]"} line-clamp-1 font-bold leading-tight text-slate-900 dark:text-white`}>
          {title}
        </h3>
        
        <div className={`flex gap-1 ${compact ? "flex-nowrap overflow-hidden" : "flex-wrap"}`}>
          {displayTags.map((tag, i) => (
            <span
              key={i}
              className={`inline-flex min-w-0 items-center truncate border border-slate-200 bg-slate-50 font-semibold text-slate-500 capitalize dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 ${compact ? "rounded-md px-1.5 py-0.5 text-[9px]" : "rounded-lg px-2 py-0.5 text-[11px]"}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
