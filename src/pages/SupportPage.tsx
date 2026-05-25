import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SuccessIcon } from '../components/common/SuccessIcon'
import { ArbitroLayout } from '../components/layouts/ArbitroLayout'

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12a7 7 0 1 1 14 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="4" y="11" width="4" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="16" y="11" width="4" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M18 18a3 3 0 0 1-3 3h-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.2 15.8c1.3 1.7 3 3.4 4.7 4.7l2.1-2.1a1.6 1.6 0 0 1 1.6-.4c.9.3 1.9.5 2.9.5a1.5 1.5 0 0 1 1.5 1.5V22a1.5 1.5 0 0 1-1.5 1.5C10.6 23.5.5 13.4.5 4.5A1.5 1.5 0 0 1 2 3h2a1.5 1.5 0 0 1 1.5 1.5c0 1 .2 2 .5 2.9.2.6 0 1.2-.4 1.6Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="6" width="17" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m5.5 8 6.5 5 6.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SupportSuccessModal({ onBackHome }: { onBackHome: () => void }) {
  return (
    <div className="profile-modal-backdrop">
      <div className="support-success-modal" role="dialog" aria-modal="true" aria-labelledby="support-success-title">
        <SuccessIcon />
        <div className="support-success-copy">
          <h2 id="support-success-title">Mensagem enviada com sucesso!</h2>
          <p>Em breve entraremos em contato. Fique de olho nos canais de comunicação.</p>
        </div>
        <button type="button" className="dashboard-button support-success-button" onClick={onBackHome}>
          Voltar a tela de Home
        </button>
      </div>
    </div>
  )
}

export function SupportPage() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)

  const user = JSON.parse(localStorage.getItem('@Refhouse:user') || '{}')
  const nomeUsuario = user.nome || 'Árbitro'

  return (
    <ArbitroLayout nomeUsuario={nomeUsuario} breadcrumbs={[{ label: 'Suporte' }]}>
      <section className="support-page">
        <div className="support-copy">
          <h1>Suporte</h1>
          <p>Precisa de ajuda? Entre em contato com nosso suporte ou com o organizador do campeonato</p>
        </div>

        <div className="support-grid">
          <section className="support-form-card">
            <div className="support-form-grid">
              <label className="profile-field">
                <span>Tipo de Contato*:</span>
                <select defaultValue="">
                  <option value="" disabled>
                    Selecione o tipo de contato
                  </option>
                  <option>Suporte técnico</option>
                  <option>Dúvida sobre escala</option>
                  <option>Financeiro</option>
                </select>
              </label>

              <label className="profile-field">
                <span>Assunto*:</span>
                <input type="text" placeholder="Digite o assunto" />
              </label>

              <label className="profile-field support-message-field">
                <span>Mensagem*:</span>
                <textarea placeholder="Descreva sua dúvida, problema ou mensagem de forma clara e objetiva" />
              </label>

              <p className="support-help-text">Responderemos o mais rápido possível, fique de olho nos canais de contato.</p>
            </div>

            <div className="support-actions">
              <button type="button" className="dashboard-button support-submit-button" onClick={() => setSubmitted(true)}>
                Enviar Mensagem
              </button>
            </div>
          </section>

          <aside className="support-contact-card">
            <h2>Informações de Contato</h2>
            <div className="support-contact-divider" />

            <div className="support-contact-copy">
              <div className="support-contact-headline">
                <HeadsetIcon />
                <div>
                  <strong>Precisa de mais alguma coisa?</strong>
                  <p>Fale conosco diretamente.</p>
                </div>
              </div>

              <p className="support-contact-item">
                <PhoneIcon />
                <span>(85) 99845-1234</span>
              </p>

              <p className="support-contact-item">
                <MailIcon />
                <span>suporte@refhouse.com</span>
              </p>
            </div>
          </aside>
        </div>
      </section>

      {submitted && <SupportSuccessModal onBackHome={() => navigate('/home')} />}
    </ArbitroLayout>
  )
}
