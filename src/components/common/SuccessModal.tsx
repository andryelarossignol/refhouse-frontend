import { SuccessIcon } from './SuccessIcon'

type SuccessModalProps = {
  title: string
  primaryLabel?: string
  onClose: () => void
  secondaryLabel?: string
  onSecondaryAction?: () => void
}

export function SuccessModal({ title, primaryLabel = 'Fechar', onClose, secondaryLabel, onSecondaryAction }: SuccessModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-content success-card" style={{ padding: '3rem 2rem' }}>
        <div className="success-icon-wrapper">
          <SuccessIcon />
        </div>
        <h2 style={{ fontSize: '1.3rem', color: '#111', margin: '1rem 0 2rem' }}>{title}</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {secondaryLabel && onSecondaryAction && (
            <button className="btn-cancelar-outline" style={{ width: '200px' }} onClick={onSecondaryAction}>
              {secondaryLabel}
            </button>
          )}
          <button className="btn-salvar" style={{ width: '200px' }} onClick={onClose}>
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
