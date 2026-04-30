type NotificationItem = {
  title: string
  message: string
  age: string
}

const notifications: NotificationItem[] = [
  {
    title: 'AVISO IMPORTANTE',
    message: 'Reuniao obrigatoria de arbitros agendada para 20/04.',
    age: 'Há 1 dia',
  },
  {
    title: 'DIRETRIZ',
    message: 'Lembrete: Chegar com 30 minutos de antecedencia a todas as partidas.',
    age: 'Há 2 dias',
  },
  {
    title: 'REGULAMENTO',
    message: 'O uso do uniforme oficial RefHouse e obrigatorio em todas as atuacoes.',
    age: 'Há 3 dias',
  },
  {
    title: 'NOVA ESCALA',
    message: 'Verifique suas novas partidas em Proximas Escalas.',
    age: 'Há 12 horas',
  },
  {
    title: 'ATUALIZACAO DE REGRAS',
    message: 'Curso de revisao online disponivel.',
    age: 'Há 4 dias',
  },
]

function NoticeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.3 12.4 2.3 2.4 5.1-5.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HomeNotifications() {
  return (
    <aside className="notifications-panel" aria-label="Notificacoes">
      <div className="notifications-header">
        <div>
          <h2>Notificações</h2>
        </div>
        <button type="button" className="notifications-mark-read">
          Marcar todas como lidas
        </button>
      </div>

      <div className="notifications-tabs">
        <button type="button" className="notifications-tab notifications-tab-active">
          Não Lidas
        </button>
        <button type="button" className="notifications-tab">
          Lidas
        </button>
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <article key={notification.title} className="notification-item">
            <div className="notification-icon">
              <NoticeIcon />
            </div>
            <div className="notification-copy">
              <p>
                <strong>{notification.title}</strong> • {notification.age}
              </p>
              <span>{notification.message}</span>
            </div>
          </article>
        ))}
      </div>
    </aside>
  )
}
