import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { EscalaArbitro, DisponibilidadeStatus, EventoCalendarioArbitro } from '../../types'

export type EscalaProps = EscalaArbitro
export type DisponibilidadeProps = DisponibilidadeStatus
export type EventoProps = EventoCalendarioArbitro

// ==========================================
// ÍCONES
// ==========================================
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

// ==========================================
// CARD 1: PRÓXIMAS ESCALAS
// ==========================================
export function UpcomingScalesCard({ escalas }: { escalas?: EscalaProps[] }) {
  const navigate = useNavigate()
  const formatarData = (dataIso: string, hora: string) => {
    const data = new Date(dataIso)
    const dia = String(data.getUTCDate()).padStart(2, '0')
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0')
    return `${dia}/${mes} - ${hora}`
  }

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
        {!escalas || escalas.length === 0 ? (
          <p style={{ padding: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>Você não possui escalas agendadas no momento.</p>
        ) : (
          escalas.map((match, index) => (
            <article key={match.id} className={`schedule-item ${index === escalas.length - 1 ? 'schedule-item-last' : ''}`}>
              <div>
                <strong>{formatarData(match.data, match.hora)}</strong>
                <p>{match.local}</p>
                <p>Categoria: {match.categoria}</p>
                <p>{match.confronto}</p>
              </div>

              {index === escalas.length - 1 && (
                <button type="button" className="dashboard-button schedule-button" onClick={() => navigate('/minhas-escalas')}>
                  Ver mais
                </button>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  )
}

// ==========================================
// CARD 2: DISPONIBILIDADE
// ==========================================
export function AvailabilityCard({ disponibilidade }: { disponibilidade?: DisponibilidadeProps }) {
  const navigate = useNavigate()

  if (!disponibilidade) {
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
          <p style={{ color: '#6b7280' }}>Não há nenhuma coleta de disponibilidade aberta pela administração no momento.</p>
        </div>
      </section>
    )
  }

  const dataInicio = new Date(disponibilidade.inicio_jogos)
  const dataFim = new Date(disponibilidade.fim_jogos)
  const diaInicio = dataInicio.getUTCDate()
  const diaFim = dataFim.getUTCDate()
  const mes = dataFim.toLocaleString('pt-BR', { month: 'long', timeZone: 'UTC' })
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1)

  const isEnviada = disponibilidade.status === 'ENVIADA'

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
          <strong>Semana:</strong> {diaInicio} - {diaFim} {mesCapitalizado}
        </p>
        <p>
          <strong>Status:</strong>
          <span className={isEnviada ? 'status-success' : ''} style={{ color: isEnviada ? '#16a34a' : '#ea580c', fontWeight: 600, marginLeft: '4px' }}>
            {isEnviada ? 'Disponibilidade Enviada' : 'Pendente'}
          </span>
        </p>
      </div>

      <div className="dashboard-card-actions">
        <button
          type="button"
          className="dashboard-button"
          onClick={() => navigate('/disponibilidade')}
          style={{
            backgroundColor: isEnviada ? '#f3f4f6' : '#ea580c',
            color: isEnviada ? '#374151' : '#ffffff',
            border: isEnviada ? '1px solid #d1d5db' : 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {isEnviada ? 'Editar Disponibilidade' : 'Enviar Disponibilidade'}
        </button>
      </div>
    </section>
  )
}

// ==========================================
// CARD 3: CALENDÁRIO / TIMELINE
// ==========================================
export function TimelineCard({ eventos }: { eventos?: EventoProps[] }) {
  const [dataAtual, setDataAtual] = useState(new Date())

  const ano = dataAtual.getFullYear()
  const mes = dataAtual.getMonth()
  const diasNoMes = new Date(ano, mes + 1, 0).getDate()
  const primeiroDiaDaSemana = new Date(ano, mes, 1).getDay()

  const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  const calendarDays = []
  for (let i = 0; i < primeiroDiaDaSemana; i++) {
    calendarDays.push({ value: '', tone: undefined })
  }
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const dataString = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    const evento = eventos?.find(e => e.data === dataString)
    let tone: string | undefined = undefined
    if (evento?.status === 'escalado') tone = 'blue'
    if (evento?.status === 'coleta') tone = 'green'
    calendarDays.push({ value: String(dia), tone })
  }

  const mesAnterior = () => setDataAtual(new Date(ano, mes - 1, 1))
  const proximoMes = () => setDataAtual(new Date(ano, mes + 1, 1))

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
        <button type="button" className="timeline-nav" aria-label="Mes anterior" onClick={mesAnterior}>
          <ChevronLeftIcon />
        </button>

        <div className="timeline-selects">
          <select aria-label="Mes" value={nomesMeses[mes]} onChange={() => {}}>
            <option>{nomesMeses[mes]}</option>
          </select>
          <select aria-label="Ano" value={ano} onChange={() => {}}>
            <option>{ano}</option>
          </select>
        </div>

        <button type="button" className="timeline-nav" aria-label="Proximo mes" onClick={proximoMes}>
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
            key={`day-${index}`}
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
