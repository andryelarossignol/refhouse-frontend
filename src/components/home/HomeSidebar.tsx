import { NavLink } from 'react-router-dom'
import { HomeBrand } from './HomeBrand'

type HomeSidebarProps = {
  open: boolean
  onClose: () => void
}

const items = [
  { label: 'Home', to: '/home' },
  { label: 'Disponibilidade', to: '/disponibilidade' },
  { label: 'Minhas Escalas', to: '/minhas-escalas' },
  { label: 'Meu Perfil', to: '/meu-perfil' },
  { label: 'Suporte', to: '/suporte' },
  { label: 'Sair', to: '/login' },
]

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 10.5 12 5l7 5.5v8a1 1 0 0 1-1 1h-4.5v-5h-3v5H6a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 3.5v3M16 3.5v3M4 9.5h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.2 15.8c1.3 1.7 3 3.4 4.7 4.7l2.1-2.1a1.6 1.6 0 0 1 1.6-.4c.9.3 1.9.5 2.9.5a1.5 1.5 0 0 1 1.5 1.5V22a1.5 1.5 0 0 1-1.5 1.5C10.6 23.5.5 13.4.5 4.5A1.5 1.5 0 0 1 2 3h2a1.5 1.5 0 0 1 1.5 1.5c0 1 .2 2 .5 2.9.2.6 0 1.2-.4 1.6Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 8.5 17 12l-4 3.5M17 12H8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const icons = [HomeIcon, CalendarIcon, CalendarIcon, UserIcon, SupportIcon, LogoutIcon]

export function HomeSidebar({ open, onClose }: HomeSidebarProps) {
  return (
    <>
      <div className={`dashboard-sidebar-backdrop ${open ? 'dashboard-sidebar-backdrop-visible' : ''}`} onClick={onClose} />
      <aside className={`dashboard-sidebar ${open ? 'dashboard-sidebar-open' : ''}`} aria-label="Menu lateral">
        <HomeBrand inverted />

        <nav className="dashboard-sidebar-nav">
          {items.map((item, index) => {
            const Icon = icons[index]

            if (item.to) {
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                  onClick={onClose}
                >
                  <Icon />
                  <span>{item.label}</span>
                </NavLink>
              )
            }

            return (
              <button key={item.label} type="button" className="sidebar-link">
                <Icon />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
