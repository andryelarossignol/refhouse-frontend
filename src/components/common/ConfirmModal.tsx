function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#f59e0b" width="64" height="64" aria-hidden="true">
      <path d="M12 2L1 21h22L12 2z" />
      <path d="M12 9v5M12 16.5v.5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

type ConfirmModalProps = {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  isDanger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  isDanger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-content confirm-card">
        <div className="warning-icon-wrapper">
          <WarningIcon />
        </div>
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        <div className="confirm-buttons-row">
          <button className="btn-cancelar-outline" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </button>
          <button className={isDanger ? 'btn-danger' : 'btn-salvar'} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Aguarde...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
