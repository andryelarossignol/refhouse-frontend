import type { ReactNode } from 'react'
import { BrandLogo } from './BrandLogo'

type AdminAuthShellProps = {
  children: ReactNode
}

export function AdminAuthShell({ children }: AdminAuthShellProps) {
  return (
    <main className="auth-page">
      <div className="auth-layout">
        <div className="admin-auth-brand">
          <BrandLogo />
          <span className="admin-auth-subtitle">Admin</span>
        </div>
        {children}
      </div>
    </main>
  )
}
