import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'warning'

interface ToastItem {
  id: number
  type: ToastType
  message: string
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_CONFIG: Record<ToastType, { bg: string; accent: string; icon: string }> = {
  success: { bg: '#f0fdf4', accent: '#16a34a', icon: '✓' },
  error:   { bg: '#fef2f2', accent: '#dc2626', icon: '✕' },
  warning: { bg: '#fffbeb', accent: '#d97706', icon: '!' },
}

function Toast({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const { bg, accent, icon } = TOAST_CONFIG[toast.type]
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      backgroundColor: bg,
      border: `1px solid ${accent}`,
      borderLeft: `4px solid ${accent}`,
      borderRadius: '8px',
      padding: '0.875rem 1rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      minWidth: '280px',
      maxWidth: '380px',
    }}>
      <span style={{ fontWeight: 700, color: accent, fontSize: '1rem', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>
        {icon}
      </span>
      <span style={{ flex: 1, fontSize: '0.875rem', color: '#1f2937', lineHeight: 1.5 }}>
        {toast.message}
      </span>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '1.1rem', padding: 0, lineHeight: 1, flexShrink: 0 }}
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextIdRef = useRef(0)

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = ++nextIdRef.current
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => removeToast(id), 5000)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        role="region"
        aria-label="Notificações"
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(toast => (
          <div key={toast.id} style={{ pointerEvents: 'all' }}>
            <Toast toast={toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
