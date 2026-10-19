import { useState, useLayoutEffect, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import MobileSideDrawer from './MobileSideDrawer'
import BottomNavigation from './BottomNavigation'
import Footer from './Footer'

export default function PageContainer() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header onOpenDrawer={() => setIsDrawerOpen(true)} />
        <MobileSideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        <main className="flex-1 pb-6 lg:pb-8">
          <Outlet />
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    </div>
  )
}
