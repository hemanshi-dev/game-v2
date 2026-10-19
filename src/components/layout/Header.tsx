import sidebarLogo from "../../assets/sidebar_logo.png"
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  onOpenDrawer: () => void
}

export default function Header({ onOpenDrawer }: HeaderProps) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  
  // Theme toggle logic - checks localStorage first, then falls back to OS preference
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark') return true
      if (stored === 'light') return false
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`)
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8 dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
      {/* Mobile/Tablet left group */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link to="/" className="flex items-center">
          <img src={sidebarLogo} alt="PlayRush Logo" className="h-10 w-auto object-contain" />
        </Link>
      </div>

      {/* Center Search Bar */}
      <div className="hidden flex-1 px-8 md:flex justify-center">
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for games, categories..."
            className="w-full rounded-full border border-gray-300 bg-white py-3 pl-6 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Right group: Theme Toggle & Sign In */}
      <div className="flex items-center gap-4">
        <Link to="/search" className="md:hidden p-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Link>

        {/* Theme Toggle Button */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>

        <button className="hidden rounded-full bg-[#1877f2] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          Sign In
        </button>
      </div>
    </header>
  )
}
