import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../components/home/DashboardLayout'
import { LockedCalendarIllustration } from '../components/home/LockedCalendarIllustration'

type ScaleStatus = 'Encerrado' | 'Agendado'

type ScaleItem = {
  day: string
  weekday: string
  time: string
  category: string
  fixture: string
  venue: string
  role: string
  status: ScaleStatus
}

const scales: ScaleItem[] = [
  {
    day: '14/04',
    weekday: 'Sábado',
    time: '16:00',
    category: 'Adulto Série Prata',
    fixture: 'BPA x BPA DL',
    venue: 'Juvenal De Carvalho',
    role: 'Árbitro de Quadra',
    status: 'Encerrado',
  },
  {
    day: '15/04',
    weekday: 'Domingo',
    time: '14:00',
    category: 'Sub-19',
    fixture: 'Team Dunk x HJB',
    venue: 'Juvenal De Carvalho',
    role: 'Árbitro de Quadra',
    status: 'Agendado',
  },
  {
    day: '16/04',
    weekday: 'Segunda',
    time: '16:00',
    category: 'Adulto Série Ouro',
    fixture: 'Limoeiro x BPA',
    venue: 'Juvenal De Carvalho',
    role: 'Árbitro de Quadra',
    status: 'Agendado',
  },
]

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.1" fill="currentColor" />
    </svg>
  )
}

function WhistleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 12.5a4.5 4.5 0 1 0 9 0c0-1.4-.5-2.7-1.3-3.6L17 6.5h-4.1L10 9H7.9A2.9 2.9 0 0 0 5 11.9v.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="9.2" cy="12.5" r="1.4" fill="currentColor" />
    </svg>
  )
}

function MyScalesList() {
  return (
    <section className="my-scales-page">
      <div className="my-scales-copy">
        <h1>
          Minhas Escalas
          <span> Semana 14 a 20 de Abril</span>
        </h1>
        <p>Acompanhe seus jogos escalados e organize-se conforme seus compromissos como árbitro.</p>
      </div>

      <div className="my-scales-list">
        {scales.map((scale) => (
          <article key={`${scale.day}-${scale.time}`} className="my-scales-card">
            <div className="my-scales-date">
              <strong>
                {scale.day} - {scale.weekday}
              </strong>
            </div>

            <div className="my-scales-details">
              <div className="my-scales-match">
                <strong>{scale.time}</strong>
                <p>{scale.category}</p>
                <p>{scale.fixture}</p>
              </div>

              <div className="my-scales-meta">
                <p>
                  <PinIcon />
                  <span>{scale.venue}</span>
                </p>
                <p>
                  <WhistleIcon />
                  <span>{scale.role}</span>
                </p>
              </div>

              <div className="my-scales-status">
                <span className={`scale-status-pill ${scale.status === 'Agendado' ? 'scale-status-pill-green' : 'scale-status-pill-gray'}`}>
                  {scale.status}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function MyScalesLocked({ onBackHome }: { onBackHome: () => void }) {
  return (
    <section className="my-scales-page">
      <div className="my-scales-copy my-scales-copy-empty">
        <h1>Minhas Escalas</h1>
        <p>Aguarde. A escala de jogos desta semana ainda não foi liberada pelo administrador.</p>
      </div>

      <section className="availability-empty-state my-scales-empty-state">
        <LockedCalendarIllustration />
        <h2>Escalas não liberadas</h2>
        <button type="button" className="dashboard-button availability-empty-button" onClick={onBackHome}>
          Voltar a tela de home
        </button>
      </section>
    </section>
  )
}

export function MyScalesPage() {
  const navigate = useNavigate()
  const isLocked = window.location.hash === '#sem-escalas'

  return (
    <DashboardLayout>
      <section className="dashboard-content">
        {isLocked ? <MyScalesLocked onBackHome={() => navigate('/home')} /> : <MyScalesList />}
      </section>
    </DashboardLayout>
  )
}
