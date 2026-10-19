import { Link } from "react-router-dom";

export default function Recent() {
  return (
    <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8">
      {/* 1. Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl ">
          Recent Games
        </h1>
        <p className="mt-1 text-xs text-gray-600 sm:text-sm ">
          Games you recently played or viewed
        </p>
      </div>

      {/* 2. Clean Placeholder State */}
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-16 px-4 text-center ">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 ">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-base font-semibold text-gray-900 dark:text-white ">
          No recent games yet
        </h2>
        <p className="mt-1 max-w-sm text-xs text-gray-500 ">
          Games you play on PlayRush will appear here for easy access.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-[40px] items-center justify-center rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors sm:text-sm"
        >
          Explore Games
        </Link>
      </div>
    </div>
  );
}
