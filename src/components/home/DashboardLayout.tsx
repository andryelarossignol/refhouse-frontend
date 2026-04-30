import type { ReactNode } from 'react'
import { useState } from 'react'
import { HomeHeader } from './HomeHeader'
import { HomeNotifications } from './HomeNotifications'
import { HomeSidebar } from './HomeSidebar'

type DashboardLayoutProps = {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  function toggleSidebar() {
    setSidebarOpen((current) => {
      const next = !current
      if (next) {
        setNotificationsOpen(false)
      }
      return next
    })
  }

  function toggleNotifications() {
    setNotificationsOpen((current) => {
      const next = !current
      if (next) {
        setSidebarOpen(false)
      }
      return next
    })
  }

  return (
    <div className="dashboard-page">
      <HomeHeader onToggleMenu={toggleSidebar} onToggleNotifications={toggleNotifications} />
      <HomeSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-shell">
        {children}
        {notificationsOpen ? <HomeNotifications /> : null}
      </div>
    </div>
  )
}
