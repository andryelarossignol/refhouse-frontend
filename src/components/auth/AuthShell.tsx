import type { ReactNode } from 'react'
import { BrandLogo } from './BrandLogo'

type AuthShellProps = {
  children: ReactNode
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="auth-page">
      <div className="auth-layout">
        <BrandLogo />
        {children}
      </div>
    </main>
  )
}
