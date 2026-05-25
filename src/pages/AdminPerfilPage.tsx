import { useState } from 'react'
import { useAdminPerfil } from '../hooks/useAdminPerfil'
import { AdminLayout } from '../components/layouts/AdminLayout'
import { SuccessModal } from '../components/common/SuccessModal'
import { formatarTelefone, formatarCPF, formatarDataBr, extrairDataInput } from '../utils/formatters'
import { useToast } from '../context/ToastContext'

const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const TrophyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" width="20" height="20"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v6.4a5.6 5.6 0 0 1-11.2 0V4z"/><path d="M3 4h4v4H3z"/><path d="M17 4h4v4h-4z"/></svg>
const LockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" width="20" height="20"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const EditPencilIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>

export function AdminPerfilPage() {
  const { perfil, loading, isSubmitting, salvarEdicao, alterarSenha } = useAdminPerfil()
  const { showToast } = useToast()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({ nome_completo: '', email: '', telefone: '', cpf: '', data_nascimento: '' })
  const [senhaForm, setSenhaForm] = useState({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' })
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const abrirModalEdicao = () => {
    setFormData({
      nome_completo: perfil.nome_completo,
      email: perfil.email,
      telefone: formatarTelefone(perfil.telefone),
      cpf: formatarCPF(perfil.cpf),
      data_nascimento: extrairDataInput(perfil.data_nascimento)
    })
    setIsEditModalOpen(true)
  }

  const handleSalvarEdicao = async () => {
    try {
      await salvarEdicao(formData)
      setIsEditModalOpen(false)
      setSuccessMessage('Perfil alterado com sucesso!')
      setIsSuccessModalOpen(true)
    } catch (error: any) {
      showToast('error', error.response?.data?.erro || 'Erro ao atualizar perfil.')
    }
  }

  const handleAlterarSenha = async () => {
    if (!senhaForm.senhaAtual || !senhaForm.novaSenha || !senhaForm.confirmarNovaSenha) {
      showToast('warning', 'Preencha todos os campos de senha.')
      return
    }
    try {
      await alterarSenha(senhaForm)
      setSenhaForm({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' })
      setSuccessMessage('Senha alterada com sucesso!')
      setIsSuccessModalOpen(true)
    } catch (error: any) {
      showToast('error', error.response?.data?.erro || 'Erro ao alterar a senha.')
    }
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length <= 11) {
      val = val.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      setFormData({ ...formData, cpf: val })
    }
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length <= 11) {
      val = val.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d)(\d{4})$/, '$1-$2')
      setFormData({ ...formData, telefone: val })
    }
  }

  return (
    <AdminLayout breadcrumbs={[{ label: 'Meu Perfil' }]}>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', margin: '0 0 0.2rem 0' }}>Meu Perfil - Administrador</h1>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '2rem' }}>Gerencie suas informações pessoais e profissionais.</p>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Carregando dados...</div>
      ) : (
        <div className="perfil-grid">

          <div className="dashboard-card perfil-card perfil-card-full">
            <div className="perfil-card-header">
              <UserIcon /> <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#111' }}>Dados Pessoais</h2>
            </div>
            <div className="modal-grid-3">
              <div className="form-group"><label>Nome Completo:</label><input type="text" className="modal-input readonly-input" value={perfil.nome_completo} readOnly disabled /></div>
              <div className="form-group"><label>Email:</label><input type="email" className="modal-input readonly-input" value={perfil.email} readOnly disabled /></div>
              <div className="form-group"><label>Data de Nascimento:</label><input type="text" className="modal-input readonly-input" value={formatarDataBr(perfil.data_nascimento)} readOnly disabled /></div>
              <div className="form-group"><label>Telefone:</label><input type="text" className="modal-input readonly-input" value={formatarTelefone(perfil.telefone)} readOnly disabled /></div>
              <div className="form-group"><label>CPF:</label><input type="text" className="modal-input readonly-input" value={formatarCPF(perfil.cpf)} readOnly disabled /></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <button className="btn-salvar" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={abrirModalEdicao}>
                  Editar informações <EditPencilIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-card perfil-card">
            <div className="perfil-card-header">
              <TrophyIcon /> <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#111' }}>Dados Profissionais</h2>
            </div>
            <div className="form-group">
              <label>Campeonato:</label>
              <input type="text" className="modal-input readonly-input" value={perfil.campeonato.nome} readOnly disabled />
            </div>
          </div>

          <div className="dashboard-card perfil-card">
            <div className="perfil-card-header">
              <LockIcon /> <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#111' }}>Segurança</h2>
            </div>
            <div className="modal-grid-3">
              <div className="form-group"><label>Senha Atual:</label><input type="password" placeholder="••••••••" className="modal-input" value={senhaForm.senhaAtual} onChange={e => setSenhaForm({...senhaForm, senhaAtual: e.target.value})} disabled={isSubmitting} /></div>
              <div className="form-group"><label>Nova Senha:</label><input type="password" placeholder="••••••••" className="modal-input" value={senhaForm.novaSenha} onChange={e => setSenhaForm({...senhaForm, novaSenha: e.target.value})} disabled={isSubmitting} /></div>
              <div className="form-group"><label>Confirmar Nova Senha:</label><input type="password" placeholder="••••••••" className="modal-input" value={senhaForm.confirmarNovaSenha} onChange={e => setSenhaForm({...senhaForm, confirmarNovaSenha: e.target.value})} disabled={isSubmitting} /></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn-salvar" onClick={handleAlterarSenha} disabled={isSubmitting}>
                {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </div>
          </div>

        </div>
      )}

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <header className="modal-header" style={{ padding: '1.5rem 2rem 1rem', display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111' }}>Editar Informações</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </header>
            <div className="modal-body" style={{ padding: '0 2rem 1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Nome Completo:</label>
                <input type="text" className="modal-input" value={formData.nome_completo} onChange={e => setFormData({...formData, nome_completo: e.target.value})} disabled={isSubmitting} />
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Email:</label>
                <input type="email" className="modal-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={isSubmitting} />
              </div>
              <div className="modal-grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label>Telefone:</label>
                  <input type="text" className="modal-input" value={formData.telefone} onChange={handleTelefoneChange} disabled={isSubmitting} />
                </div>
                <div className="form-group">
                  <label>CPF:</label>
                  <input type="text" className="modal-input" value={formData.cpf} onChange={handleCpfChange} disabled={isSubmitting} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label>Data de Nascimento:</label>
                <input type="date" className="modal-input" value={formData.data_nascimento} onChange={e => setFormData({...formData, data_nascimento: e.target.value})} disabled={isSubmitting} />
              </div>
            </div>
            <footer className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1.2rem 2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button className="btn-cancelar-outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>Cancelar</button>
              <button className="btn-salvar" onClick={handleSalvarEdicao} disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </footer>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <SuccessModal
          title={successMessage}
          primaryLabel="Voltar para o Perfil"
          onClose={() => setIsSuccessModalOpen(false)}
        />
      )}

    </AdminLayout>
  )
}
