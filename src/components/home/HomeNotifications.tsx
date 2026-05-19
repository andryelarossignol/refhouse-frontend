type HomeNotificationsProps = {
  avisos?: any[]
}

// Converte a data do banco para "Há X horas" ou "Há X dias"
function formatarTempo(dataIso: string) {
  if (!dataIso) return ''
  const diff = new Date().getTime() - new Date(dataIso).getTime()
  const horas = Math.floor(diff / (1000 * 60 * 60))
  if (horas < 1) return 'Agora mesmo'
  if (horas < 24) return `Há ${horas} hora${horas > 1 ? 's' : ''}`
  return `Há ${Math.floor(horas / 24)} dia${Math.floor(horas / 24) > 1 ? 's' : ''}`
}

function NoticeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.3 12.4 2.3 2.4 5.1-5.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HomeNotifications({ avisos }: HomeNotificationsProps) {
  return (
    <aside className="notifications-panel" aria-label="Notificacoes">
      <div className="notifications-header">
        <div>
          <h2>Notificações</h2>
        </div>
        {/* Botão de "Marcar como lidas" removido daqui */}
      </div>

      {/* Abas "Lidas / Não lidas" removidas daqui */}

      <div className="notifications-list" style={{ marginTop: '0.5rem' }}>
        {!avisos || avisos.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            Nenhuma notificação no momento.
          </div>
        ) : (
          avisos.map((aviso) => (
            <article key={aviso.id} className="notification-item">
              <div className="notification-icon">
                <NoticeIcon />
              </div>
              <div className="notification-copy">
                <p>
                  <strong>{aviso.titulo || 'AVISO'}</strong> • {formatarTempo(aviso.criado_em)}
                </p>
                <span>{aviso.mensagem}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </aside>
  )
}