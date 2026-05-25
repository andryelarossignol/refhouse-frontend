type PageHeaderProps = {
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
}

export function PageHeader({ title, subtitle, actionLabel, onAction }: PageHeaderProps) {
  return (
    <div className="page-header-flex">
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0.2rem 0 0' }}>{subtitle}</p>}
      </div>
      {actionLabel && onAction && (
        <button className="btn-salvar" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
