import { useState } from 'react'
import { SuccessIcon } from '../components/SuccessIcon'
import { DashboardLayout } from '../components/home/DashboardLayout'

type ProfileData = {
  fullName: string
  email: string
  birthDate: string
  phone: string
  cpf: string
}

type ProfileModalState = 'none' | 'edit-profile' | 'profile-saved' | 'password-saved'

const initialProfile: ProfileData = {
  fullName: 'Ithalo Guilherme Carneiro',
  email: 'ithalo@gmail.com',
  birthDate: '09/10/2002',
  phone: '(85) 998455-0373',
  cpf: '000.000.000-00',
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 4h8v3a4 4 0 0 1-8 0z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 5H5.5A1.5 1.5 0 0 0 4 6.5v.3A4.2 4.2 0 0 0 8 11M16 5h2.5A1.5 1.5 0 0 1 20 6.5v.3A4.2 4.2 0 0 1 16 11M12 11v4M9 19h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="10" width="15" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7.5a4 4 0 1 1 8 0V10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 16.5 8.9-8.9 3.5 3.5-8.9 8.9L4 20zM14.6 5.9l1.5-1.5a1.8 1.8 0 0 1 2.6 0l.9.9a1.8 1.8 0 0 1 0 2.6L18.1 9.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type FieldProps = {
  label: string
  value: string
}

function ProfileField({ label, value }: FieldProps) {
  return (
    <label className="profile-field">
      <span>{label}</span>
      <input type="text" value={value} readOnly />
    </label>
  )
}

type EditProfileModalProps = {
  draft: ProfileData
  onChange: (field: keyof ProfileData, value: string) => void
  onClose: () => void
  onSave: () => void
}

function EditProfileModal({ draft, onChange, onClose, onSave }: EditProfileModalProps) {
  return (
    <div className="profile-modal-backdrop">
      <div className="profile-edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
        <div className="profile-edit-header">
          <h2 id="edit-profile-title">Editar Informações</h2>
          <button type="button" className="profile-close-button" aria-label="Fechar modal" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="profile-edit-form">
          <label className="profile-field">
            <span>Nome Completo:</span>
            <input type="text" value={draft.fullName} onChange={(event) => onChange('fullName', event.target.value)} />
          </label>

          <label className="profile-field">
            <span>Email:</span>
            <input type="email" value={draft.email} onChange={(event) => onChange('email', event.target.value)} />
          </label>

          <div className="profile-edit-grid">
            <label className="profile-field">
              <span>Telefone:</span>
              <input type="text" value={draft.phone} onChange={(event) => onChange('phone', event.target.value)} />
            </label>

            <label className="profile-field">
              <span>CPF:</span>
              <input type="text" value={draft.cpf} onChange={(event) => onChange('cpf', event.target.value)} />
            </label>
          </div>

          <label className="profile-field">
            <span>Data de Nascimento:</span>
            <input type="text" value={draft.birthDate} onChange={(event) => onChange('birthDate', event.target.value)} />
          </label>
        </div>

        <div className="profile-modal-actions">
          <button type="button" className="profile-secondary-button" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="dashboard-button profile-save-button" onClick={onSave}>
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  )
}

type SuccessModalProps = {
  title: string
  buttonLabel: string
  onClose: () => void
}

function ProfileSuccessModal({ title, buttonLabel, onClose }: SuccessModalProps) {
  return (
    <div className="profile-modal-backdrop">
      <div className="profile-success-modal" role="dialog" aria-modal="true" aria-labelledby="profile-success-title">
        <SuccessIcon />
        <h2 id="profile-success-title">{title}</h2>
        <button type="button" className="dashboard-button profile-success-button" onClick={onClose}>
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}

export function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile)
  const [draft, setDraft] = useState<ProfileData>(initialProfile)
  const [modalState, setModalState] = useState<ProfileModalState>('none')

  function openEditModal() {
    setDraft(profile)
    setModalState('edit-profile')
  }

  function updateDraft(field: keyof ProfileData, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function saveProfile() {
    setProfile(draft)
    setModalState('profile-saved')
  }

  return (
    <DashboardLayout>
      <section className="dashboard-content">
        <section className="profile-page">
          <div className="profile-copy">
            <h1>Meu Perfil</h1>
            <p>Gerencie suas informações pessoais e profissionais.</p>
          </div>

          <section className="profile-card profile-card-wide">
            <div className="profile-card-title">
              <UserIcon />
              <h2>Dados Pessoais</h2>
            </div>

            <div className="profile-personal-grid">
              <ProfileField label="Nome Completo:" value={profile.fullName} />
              <ProfileField label="Email:" value={profile.email} />
              <ProfileField label="Data de Nascimento:" value={profile.birthDate} />
              <ProfileField label="Telefone:" value={profile.phone} />
              <ProfileField label="CPF:" value={profile.cpf} />

              <div className="profile-personal-actions">
                <button type="button" className="dashboard-button profile-edit-button" onClick={openEditModal}>
                  Editar informações
                  <PencilIcon />
                </button>
              </div>
            </div>
          </section>

          <div className="profile-grid">
            <section className="profile-card">
              <div className="profile-card-title">
                <TrophyIcon />
                <h2>Dados Profissionais</h2>
              </div>

              <div className="profile-options-grid">
                <div className="profile-options-group">
                  <span>Tipo de Atuação:</span>
                  <label className="profile-check-option">
                    <input type="checkbox" defaultChecked />
                    <span>Quadra</span>
                  </label>
                  <label className="profile-check-option">
                    <input type="checkbox" />
                    <span>Mesa</span>
                  </label>
                </div>

                <div className="profile-options-group">
                  <span>Nível:</span>
                  <label className="profile-radio-option">
                    <input type="radio" name="level" />
                    <span>Iniciante</span>
                  </label>
                  <label className="profile-radio-option">
                    <input type="radio" name="level" defaultChecked />
                    <span>Intermediário</span>
                  </label>
                  <label className="profile-radio-option">
                    <input type="radio" name="level" />
                    <span>Avançado</span>
                  </label>
                </div>
              </div>
            </section>

            <section className="profile-card">
              <div className="profile-card-title">
                <LockIcon />
                <h2>Segurança</h2>
              </div>

              <div className="profile-security-grid">
                <label className="profile-field">
                  <span>Senha Atual:</span>
                  <input type="password" defaultValue="12345678910" />
                </label>
                <label className="profile-field">
                  <span>Nova Senha:</span>
                  <input type="password" defaultValue="12345678910" />
                </label>
                <label className="profile-field">
                  <span>Confirmar Nova Senha:</span>
                  <input type="password" defaultValue="12345678910" />
                </label>
              </div>

              <div className="profile-security-actions">
                <button type="button" className="dashboard-button profile-password-button" onClick={() => setModalState('password-saved')}>
                  Alterar Senha
                </button>
              </div>
            </section>
          </div>
        </section>
      </section>

      {modalState === 'edit-profile' ? (
        <EditProfileModal draft={draft} onChange={updateDraft} onClose={() => setModalState('none')} onSave={saveProfile} />
      ) : null}

      {modalState === 'profile-saved' ? (
        <ProfileSuccessModal title="Informações pessoais editadas com sucesso!" buttonLabel="Voltar ao Meu Perfil" onClose={() => setModalState('none')} />
      ) : null}

      {modalState === 'password-saved' ? (
        <ProfileSuccessModal title="Senha alterada com sucesso!" buttonLabel="Voltar ao Meu Perfil" onClose={() => setModalState('none')} />
      ) : null}
    </DashboardLayout>
  )
}
