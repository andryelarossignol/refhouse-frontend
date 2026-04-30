type Match = {
  date: string
  venue: string
  category: string
  fixture: string
}

type NotificationDay = {
  value: string
  tone?: 'blue' | 'green'
}

const upcomingMatches: Match[] = [
  {
    date: '12/04 - 19:00',
    venue: 'Juvenal de Carvalho',
    category: 'Categoria: Adulto serie ouro',
    fixture: 'BPA x HJB',
  },
  {
    date: '13/04 - 18:00',
    venue: 'Juvenal de Carvalho',
    category: 'Categoria: Sub-19',
    fixture: 'BPA x Team Dunk',
  },
]

const calendarDays: NotificationDay[] = [
  { value: '' },
  { value: '' },
  { value: '' },
  { value: '1' },
  { value: '2' },
  { value: '3' },
  { value: '4' },
  { value: '5' },
  { value: '6' },
  { value: '7' },
  { value: '8' },
  { value: '9' },
  { value: '10' },
  { value: '11', tone: 'blue' },
  { value: '12', tone: 'blue' },
  { value: '13' },
  { value: '14', tone: 'green' },
  { value: '15', tone: 'green' },
  { value: '16' },
  { value: '17' },
  { value: '18' },
  { value: '19' },
  { value: '20' },
  { value: '21' },
  { value: '22' },
  { value: '23' },
  { value: '24' },
  { value: '25' },
  { value: '26' },
  { value: '27' },
  { value: '28' },
  { value: '29' },
  { value: '30' },
  { value: '' },
  { value: '' },
]

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.75" y="5.25" width="16.5" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7.5 3.75v3M16.5 3.75v3M3.75 9h16.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function AvailabilityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.75 12h7.25M15.5 12h3.75M12 4.75v7.25M12 15.5v3.75" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="4.25" y="4.25" width="15.5" height="15.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function TimelineIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 18V9M10 18V5M15 18v-7M20 18v-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.5 6.5-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9.5 6.5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function UpcomingScalesCard() {
  return (
    <section className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          <CalendarIcon />
          <h2>Próximas Escalas</h2>
        </div>
      </div>

      <div className="dashboard-divider" />

      <div className="schedule-list">
        {upcomingMatches.map((match, index) => (
          <article key={match.date} className={`schedule-item ${index === upcomingMatches.length - 1 ? 'schedule-item-last' : ''}`}>
            <div>
              <strong>{match.date}</strong>
              <p>{match.venue}</p>
              <p>{match.category}</p>
              <p>{match.fixture}</p>
            </div>

            {index === upcomingMatches.length - 1 ? (
              <button type="button" className="dashboard-button schedule-button">
                Ver mais
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

export function AvailabilityCard() {
  return (
    <section className="dashboard-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title dashboard-card-title-accent">
          <AvailabilityIcon />
          <h2>Disponibilidade</h2>
        </div>
      </div>

      <div className="dashboard-divider" />

      <div className="availability-copy">
        <p>Informe quando voce esta disponivel para receber escalas.</p>
        <p>
          <strong>Semana:</strong> 14 - 20 Abril
        </p>
        <p>
          <strong>Status:</strong> <span className="status-success">Disponibilidade Enviada</span>
        </p>
      </div>

      <div className="dashboard-card-actions">
        <button type="button" className="dashboard-button">
          Editar Disponibilidade
        </button>
      </div>
    </section>
  )
}

export function TimelineCard() {
  return (
    <section className="dashboard-card timeline-card">
      <div className="dashboard-card-header">
        <div className="dashboard-card-title">
          <TimelineIcon />
          <h2>Linha do Tempo de Escalas</h2>
        </div>
      </div>

      <div className="dashboard-divider" />

      <div className="timeline-toolbar">
        <button type="button" className="timeline-nav" aria-label="Mes anterior">
          <ChevronLeftIcon />
        </button>

        <div className="timeline-selects">
          <select aria-label="Mes">
            <option>Set</option>
          </select>
          <select aria-label="Ano">
            <option>2025</option>
          </select>
        </div>

        <button type="button" className="timeline-nav" aria-label="Proximo mes">
          <ChevronRightIcon />
        </button>
      </div>

      <div className="timeline-grid">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((weekday, index) => (
          <span key={`${weekday}-${index}`} className="timeline-weekday">
            {weekday}
          </span>
        ))}

        {calendarDays.map((day, index) => (
          <span
            key={`${day.value}-${index}`}
            className={`timeline-day ${day.value === '' ? 'timeline-day-empty' : ''} ${day.tone ? `timeline-day-${day.tone}` : ''}`}
          >
            {day.value}
          </span>
        ))}
      </div>

      <div className="timeline-footer">
        <div className="timeline-legend">
          <span className="legend-item">
            <span className="legend-dot legend-dot-blue" />
            Escalado
          </span>
          <span className="legend-item">
            <span className="legend-dot legend-dot-green" />
            Coleta de disponibilidade aberta
          </span>
        </div>

        <button type="button" className="dashboard-button">
          Ver mais
        </button>
      </div>
    </section>
  )
}
