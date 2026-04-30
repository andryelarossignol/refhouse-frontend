import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SuccessIcon } from '../components/SuccessIcon'
import { DashboardLayout } from '../components/home/DashboardLayout'
import { LockedCalendarIllustration } from '../components/home/LockedCalendarIllustration'

type AvailabilityState = 'form' | 'submitted' | 'locked'

type DayAvailability = {
  label: string
  date: string
  slots: string[]
}

const availabilityDays: DayAvailability[] = [
  { label: 'Sábado', date: '14/04', slots: ['10:00', '12:00', '14:00', '16:00'] },
  { label: 'Domingo', date: '15/04', slots: ['10:00', '12:00', '14:00', '16:00'] },
  { label: 'Sábado', date: '14/04', slots: ['10:00', '12:00', '14:00', '16:00'] },
]

function AvailabilityFormCard({ onSubmit }: { onSubmit: () => void }) {
  return (
    <section className="availability-card">
      <div className="availability-card-copy">
        <h1>
          Disponibilidade:
          <span> Semana 14 a 20 de Abril</span>
        </h1>
        <p>
          Informe sua disponibilidade semanal para atuar como árbitro de mesa ou quadra. Depois de confirmar escolha jogos
          específicos para demonstrar disponibilidade
        </p>
      </div>

      <section className="availability-panel">
        <div className="availability-panel-copy">
          <h2>Disponibilidade de Semana</h2>
          <p>Defina horários que voce esta disponivel para atuar</p>
        </div>

        <div className="availability-grid">
          {availabilityDays.map((day, index) => (
            <article key={`${day.label}-${index}`} className="availability-day-card">
              <strong>
                {day.label} - {day.date}
              </strong>

              <div className="availability-slot-list">
                {day.slots.map((slot) => (
                  <label key={`${day.label}-${slot}`} className="availability-slot">
                    <input type="checkbox" />
                    <span>{slot}</span>
                  </label>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="availability-actions">
          <button type="button" className="dashboard-button availability-submit-button" onClick={onSubmit}>
            Enviar Disponibilidade
          </button>
        </div>
      </section>
    </section>
  )
}

function AvailabilitySuccessModal({ onBackHome }: { onBackHome: () => void }) {
  return (
    <div className="availability-modal-backdrop">
      <div className="availability-success-modal" role="dialog" aria-modal="true" aria-labelledby="availability-success-title">
        <SuccessIcon />

        <div className="availability-success-copy">
          <h2 id="availability-success-title">Disponibilidade registrada com Sucesso!</h2>
          <p>
            Em breve voce poderá checar a escala de jogos na aba: Minhas Escalas, fique atento.
          </p>
        </div>

        <button type="button" className="dashboard-button availability-success-button" onClick={onBackHome}>
          Voltar a tela de home
        </button>
      </div>
    </div>
  )
}

function AvailabilityLockedCard({ onBackHome }: { onBackHome: () => void }) {
  return (
    <section className="availability-card">
      <div className="availability-card-copy availability-card-copy-locked">
        <h1>Disponibilidade:</h1>
        <p>Aguarde. A tabela de jogos desta semana ainda não foi liberada pelo administrador.</p>
      </div>

      <section className="availability-empty-state">
        <LockedCalendarIllustration />
        <h2>Disponibilidade não liberada</h2>
        <button type="button" className="dashboard-button availability-empty-button" onClick={onBackHome}>
          Voltar a tela de home
        </button>
      </section>
    </section>
  )
}

export function AvailabilityPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<AvailabilityState>(() => (window.location.hash === '#sem-disponibilidade' ? 'locked' : 'form'))

  return (
    <DashboardLayout>
      <section className="dashboard-content availability-content">
        {state === 'locked' ? <AvailabilityLockedCard onBackHome={() => navigate('/home')} /> : <AvailabilityFormCard onSubmit={() => setState('submitted')} />}
      </section>

      {state === 'submitted' ? <AvailabilitySuccessModal onBackHome={() => navigate('/home')} /> : null}
    </DashboardLayout>
  )
}
