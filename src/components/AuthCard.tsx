import type { ReactNode } from 'react'

type AuthCardProps = {
  children: ReactNode
  description?: string
  title?: string
}

export function AuthCard({ children, description, title }: AuthCardProps) {
  const hasCopy = Boolean(title || description)

  return (
    <section className="auth-card" aria-labelledby={title ? 'auth-title' : undefined}>
      {hasCopy && (
        <div className="auth-card-copy">
          {title && <h1 id="auth-title">{title}</h1>}
          {description && <p>{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
