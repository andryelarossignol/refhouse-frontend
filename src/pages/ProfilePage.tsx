import { useState, useEffect } from 'react'
import api from '../services/api'
import { SuccessIcon } from '../components/SuccessIcon'
import { ArbitroLayout } from '../components/layouts/ArbitroLayout'

// ==========================================
// TIPAGENS & ÍCONES
// ==========================================
type ProfileData = { fullName: string; email: string; birthDate: string; phone: string; cpf: string }
type ProfileModalState = 'none' | 'edit-profile' | 'profile-saved' | 'password-saved'
const initialProfile: ProfileData = { fullName: '', email: '', birthDate: '', phone: '', cpf: '' }

function UserIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M5 19a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> }
function LockIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10" width="15" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 10V7.5a4 4 0 1 1 8 0V10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg> }
function PencilIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16.5 8.9-8.9 3.5 3.5-8.9 8.9L4 20zM14.6 5.9l1.5-1.5a1.8 1.8 0 0 1 2.6 0l.9.9a1.8 1.8 0 0 1 0 2.6L18.1 9.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg> }

function ProfileField({ label, value }: { label: string, value: string }) {
  return (
    <label className="profile-field">
      <span>{label}</span><input type="text" value={value || ''} readOnly style={{ backgroundColor: '#f9fafb', color: '#6b7280' }} />
    </label>
  )
}

function ProfileSuccessModal({ title, buttonLabel, onClose }: { title: string, buttonLabel: string, onClose: () => void }) {
  return (
    <div className="profile-modal-backdrop">
      <div className="profile-success-modal" role="dialog">
        <SuccessIcon /><h2>{title}</h2>
        <button type="button" className="dashboard-button profile-success-button" onClick={onClose}>{buttonLabel}</button>
      </div>
    </div>
  )
}

export function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileData>(initialProfile)
  const [draft, setDraft] = useState<ProfileData>(initialProfile)
  const [modalState, setModalState] = useState<ProfileModalState>('none')
  const [senhas, setSenhas] = useState({ atual: '', nova: '', confirmar: '' })

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const res = await api.get('/arbitros/meu-perfil')
        const p = res.data
        let dataFormatada = ''
        if (p.data_nascimento) {
          const d = new Date(p.data_nascimento)
          dataFormatada = `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`
        }
        setProfile({ fullName: p.nome_completo, email: p.email, cpf: p.cpf, phone: p.telefone, birthDate: dataFormatada })
      } catch (error) {
        console.error("Erro ao buscar perfil", error)
      } finally { setLoading(false) }
    }
    fetchPerfil()
  }, [])

  function openEditModal() { setDraft(profile); setModalState('edit-profile'); }

  async function saveProfile() {
    try {
      await api.put('/arbitros/meu-perfil', { nome_completo: draft.fullName, telefone: draft.phone, email: draft.email, data_nascimento: draft.birthDate })
      setProfile(draft)
      setModalState('profile-saved')
    } catch (error: any) { alert(error.response?.data?.erro || "Erro ao salvar perfil") }
  }

  async function handleMudarSenha() {
    if (!senhas.atual || !senhas.nova || !senhas.confirmar) return alert("Preencha todos os campos de senha.")
    if (senhas.nova !== senhas.confirmar) return alert("A nova senha e a confirmação não batem.")
    try {
      await api.put('/arbitros/meu-perfil/senha', { senhaAtual: senhas.atual, novaSenha: senhas.nova })
      setSenhas({ atual: '', nova: '', confirmar: '' }) 
      setModalState('password-saved')
    } catch (error: any) { alert(error.response?.data?.erro || "Erro ao alterar senha") }
  }

  if (loading) return <ArbitroLayout nomeUsuario=""><div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div></ArbitroLayout>

  return (
    <ArbitroLayout nomeUsuario={profile.fullName} breadcrumbs={[{ label: 'Meu Perfil' }]}>
      <section className="profile-page">
        <div className="profile-copy">
          <h1>Meu Perfil</h1><p>Gerencie suas informações pessoais e de segurança.</p>
        </div>

        <section className="profile-card profile-card-wide">
          <div className="profile-card-title"><UserIcon /><h2>Dados Pessoais</h2></div>
          <div className="profile-personal-grid">
            <ProfileField label="Nome Completo:" value={profile.fullName} />
            <ProfileField label="Email:" value={profile.email} />
            <ProfileField label="Data de Nascimento:" value={profile.birthDate} />
            <ProfileField label="Telefone:" value={profile.phone} />
            <ProfileField label="CPF:" value={profile.cpf} />
            <div className="profile-personal-actions">
              <button type="button" className="dashboard-button profile-edit-button" onClick={openEditModal}>
                Editar informações <PencilIcon />
              </button>
            </div>
          </div>
        </section>

        <div className="profile-grid">
          <section className="profile-card">
            <div className="profile-card-title"><LockIcon /><h2>Segurança</h2></div>
            <div className="profile-security-grid">
              <label className="profile-field"><span>Senha Atual:</span><input type="password" value={senhas.atual} onChange={(e) => setSenhas({...senhas, atual: e.target.value})} placeholder="••••••••" /></label>
              <label className="profile-field"><span>Nova Senha:</span><input type="password" value={senhas.nova} onChange={(e) => setSenhas({...senhas, nova: e.target.value})} placeholder="••••••••" /></label>
              <label className="profile-field"><span>Confirmar Nova Senha:</span><input type="password" value={senhas.confirmar} onChange={(e) => setSenhas({...senhas, confirmar: e.target.value})} placeholder="••••••••" /></label>
            </div>
            <div className="profile-security-actions">
              <button type="button" className="dashboard-button profile-password-button" onClick={handleMudarSenha}>Alterar Senha</button>
            </div>
          </section>
        </div>
      </section>

      {/* MODAIS */}
      {modalState === 'edit-profile' && (
        <div className="profile-modal-backdrop">
          <div className="profile-edit-modal">
            <div className="profile-edit-header"><h2>Editar Informações</h2><button className="profile-close-button" onClick={() => setModalState('none')}>×</button></div>
            <div className="profile-edit-form">
              <label className="profile-field"><span>Nome Completo:</span><input type="text" value={draft.fullName} onChange={(e) => setDraft({...draft, fullName: e.target.value})} /></label>
              <label className="profile-field"><span>Email:</span><input type="email" value={draft.email} onChange={(e) => setDraft({...draft, email: e.target.value})} /></label>
              <div className="profile-edit-grid">
                <label className="profile-field"><span>Telefone:</span><input type="text" value={draft.phone} onChange={(e) => setDraft({...draft, phone: e.target.value})} /></label>
                <label className="profile-field"><span>CPF:</span><input type="text" value={draft.cpf} disabled style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} /></label>
              </div>
              <label className="profile-field"><span>Data de Nascimento:</span><input type="text" value={draft.birthDate} onChange={(e) => setDraft({...draft, birthDate: e.target.value})} placeholder="DD/MM/YYYY" /></label>
            </div>
            <div className="profile-modal-actions">
              <button className="profile-secondary-button" onClick={() => setModalState('none')}>Cancelar</button>
              <button className="dashboard-button profile-save-button" onClick={saveProfile}>Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}

      {modalState === 'profile-saved' && <ProfileSuccessModal title="Informações editadas com sucesso!" buttonLabel="Voltar ao Meu Perfil" onClose={() => setModalState('none')} />}
      {modalState === 'password-saved' && <ProfileSuccessModal title="Senha alterada com sucesso!" buttonLabel="Voltar ao Meu Perfil" onClose={() => setModalState('none')} />}
    </ArbitroLayout>
  )
}