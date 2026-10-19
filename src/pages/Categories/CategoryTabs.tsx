import { useState } from 'react'
import type { Category } from '../../types'

interface CategoryTabsProps {
  categories: Category[]
  selectedCategoryName: string
  onSelectCategory: (categoryName: string) => void
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

const ALL_CATEGORY: Category = {
  _id: 'all',
  name: 'All',
  slug: 'all',
}

export default function CategoryTabs({
  categories,
  selectedCategoryName,
  onSelectCategory,
  isLoading,
  error,
  onRetry,
}: CategoryTabsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isLoading) {
    return (
      <div className="flex w-full items-center gap-2 overflow-x-auto py-2 [scrollbar-width:none]">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-10 w-20 shrink-0 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 py-2 text-xs">
        <span className="font-medium text-red-600 dark:text-red-400">Unable to load categories.</span>
        <button onClick={onRetry} className="rounded-lg bg-blue-600 px-3 py-1 font-semibold text-white hover:bg-blue-700">Try again</button>
      </div>
    )
  }

  const allTabs = [ALL_CATEGORY, ...categories]

  return (
    <div className="relative w-full">
      <div
        className={`flex w-full flex-wrap gap-2 py-2 overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[2000px]' : 'max-h-[104px]'
        }`}
      >
        {allTabs.map((cat) => {
          const isActive = cat.name.toLowerCase() === (selectedCategoryName || 'all').toLowerCase()
          return (
            <button
              key={cat._id}
              onClick={() => onSelectCategory(cat.name)}
              className={`flex h-[40px] shrink-0 items-center justify-center rounded-full px-4 text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          )
        })}
      </div>
      
      {allTabs.length > 0 && !isExpanded && (
        <div className="absolute bottom-2 right-0 flex items-center justify-end pl-8">
          <div className="absolute inset-0 -left-8 bg-gradient-to-r from-transparent via-[#f8fafc]/80 to-[#f8fafc] dark:via-slate-950/80 dark:to-slate-950 pointer-events-none" />
          <button
            onClick={() => setIsExpanded(true)}
            className="relative flex h-[40px] items-center justify-center rounded-full bg-white px-5 text-xs font-bold text-blue-600 shadow-md ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-blue-400 dark:ring-slate-700 dark:hover:bg-slate-700 transition-colors"
          >
            Show More
          </button>
        </div>
      )}

      {allTabs.length > 0 && isExpanded && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => setIsExpanded(false)}
            className="flex h-[40px] items-center justify-center rounded-full bg-white px-5 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700 transition-colors"
          >
            Show Less
          </button>
        </div>
      )}
    </div>
  )
}
