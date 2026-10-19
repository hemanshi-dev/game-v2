import sidebarLogo from "../../assets/sidebar_logo.png"
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCategories } from '../../hooks/useCategories'
import { FaCrosshairs, FaShieldAlt, FaGamepad, FaCar, FaFutbol, FaBrain, FaUserFriends, FaMousePointer, FaPaintBrush, FaSnowflake, FaTractor, FaRunning } from 'react-icons/fa'

import { MdCategory, MdApps, MdVideogameAsset } from 'react-icons/md'

export default function Sidebar() {
  const { categories } = useCategories()
  const location = useLocation()

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center min-h-[40px] pl-6 pr-4 py-2 mb-1 mr-4 rounded-r-full text-[15px] font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white font-semibold shadow-sm'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`

  const getIconForCategory = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('gun') || n.includes('shoot')) return <FaCrosshairs className="w-5 h-5 mr-3" />
    if (n.includes('co-op') || n.includes('multiplayer')) return <FaUserFriends className="w-5 h-5 mr-3" />
    if (n.includes('brain') || n.includes('puzzle') || n.includes('logic')) return <FaBrain className="w-5 h-5 mr-3" />
    if (n.includes('simulation')) return <MdApps className="w-5 h-5 mr-3" />
    if (n.includes('easy')) return <FaGamepad className="w-5 h-5 mr-3" />
    if (n.includes('point-and-click')) return <FaMousePointer className="w-5 h-5 mr-3" />
    if (n.includes('cool')) return <FaSnowflake className="w-5 h-5 mr-3" />
    if (n.includes('decorat') || n.includes('make-up') || n.includes('fashion') || n.includes('girl')) return <FaPaintBrush className="w-5 h-5 mr-3" />
    if (n.includes('war') || n.includes('action')) return <FaShieldAlt className="w-5 h-5 mr-3" />
    if (n.includes('farm')) return <FaTractor className="w-5 h-5 mr-3" />
    if (n.includes('racing') || n.includes('car')) return <FaCar className="w-5 h-5 mr-3" />
    if (n.includes('sports')) return <FaFutbol className="w-5 h-5 mr-3" />
    if (n.includes('running') || n.includes('escape')) return <FaRunning className="w-5 h-5 mr-3" />
    
    // Default fallback
    return <MdVideogameAsset className="w-5 h-5 mr-3" />
  }

  return (
    <aside
      aria-label="Desktop Navigation"
      className="fixed top-0 bottom-0 left-0 z-30 hidden w-64 flex-col bg-[#111827] lg:flex border-r border-slate-800"
    >
      <div className="flex h-24 shrink-0 items-center justify-center border-b border-slate-800/70 px-4">
        <Link
          to="/"
          aria-label="PlayRush home"
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src={sidebarLogo}
            alt="PlayRush"
            className="w-48 max-w-full object-contain"
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 [scrollbar-width:none]">
        <div className="space-y-1 mb-8">
          <NavLink to="/" end className={navLinkClass}>
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Home
          </NavLink>
          <NavLink to="/recent" className={navLinkClass}>
             <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-4h2v4zm0-6h-2V7h2v3z"/>
            </svg>
            New Games
          </NavLink>
          <NavLink to="/trending" className={navLinkClass}>
            <svg className="w-5 h-5 mr-3 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.71 3.53C11.58 3.51 11.45 3.5 11.33 3.5 7.83 3.5 5 6.33 5 9.83c0 2.22 1.13 4.17 2.84 5.31C7.38 15.65 7 16.27 7 17c0 1.1.9 2 2 2 .55 0 1.05-.22 1.41-.59.36.37.86.59 1.41.59s1.05-.22 1.41-.59c.36.37.86.59 1.41.59 1.1 0 2-.9 2-2 0-.73-.38-1.35-.84-1.86C17.87 14 19 12.05 19 9.83c0-3.5-2.83-6.33-6.33-6.33-.32 0-.64.02-.96.03zm-1.07 10.63c-.15.22-.32.41-.52.59-.44-.61-1.03-1.12-1.74-1.42 1.06-.82 1.74-2.12 1.74-3.57 0-2.43-1.97-4.4-4.4-4.4-.14 0-.28.01-.42.02.77-.96 1.95-1.57 3.26-1.57 2.37 0 4.29 1.92 4.29 4.29 0 1.6-.88 3.01-2.21 3.76zM13 17c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z"/>
            </svg>
            Trending
          </NavLink>
          <NavLink to="/categories" className={navLinkClass}>
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 11h5V5H4v6zm0 7h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-7h5V5h-5v6zm6-6v6h5V5h-5z"/>
            </svg>
            Categories
          </NavLink>
        </div>

        <div className="pl-6 pb-2 text-[12px] font-bold tracking-wider text-slate-500 uppercase">
          CATEGORIES
        </div>

        <div className="mt-1 space-y-1">
          {categories.slice(0, 10).map((cat) => {
            const isCatActive =
              location.pathname === `/category/${cat.slug}` ||
              location.pathname === `/categories/${cat.slug}`

            return (
              <NavLink
                key={cat._id || cat.slug}
                to={`/category/${cat.slug}`}
                className={({ isActive }) =>
                  navLinkClass({
                    isActive: isActive || isCatActive,
                  })
                }
              >
                {getIconForCategory(cat.name)}
                {cat.name}
              </NavLink>
            )
          })}
          
          <NavLink
            to="/categories"
            className={navLinkClass}
          >
            <MdCategory className="w-5 h-5 mr-3" />
            All Categories
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}
