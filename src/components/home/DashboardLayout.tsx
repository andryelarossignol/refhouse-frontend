import type { ReactNode } from 'react'
import { useState } from 'react'
import { HomeHeader } from './HomeHeader'
import { HomeNotifications } from './HomeNotifications'
import { HomeSidebar } from './HomeSidebar'

type DashboardLayoutProps = {
  children: ReactNode
  avisos?: any[]          // Recebe os avisos da HomePage
  nomeUsuario?: string    // Recebe o nome da HomePage
}

export function DashboardLayout({ children, avisos, nomeUsuario }: DashboardLayoutProps) {
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
      <HomeHeader 
        onToggleMenu={toggleSidebar} 
        onToggleNotifications={toggleNotifications} 
        nomeUsuario={nomeUsuario}
        temAvisos={avisos && avisos.length > 0}
      />
      <HomeSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-shell">
        {children}
        {notificationsOpen ? <HomeNotifications avisos={avisos} /> : null}
      </div>
    </div>
  )
}