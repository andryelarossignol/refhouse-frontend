import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { AdminLayout } from '../components/layouts/AdminLayout' // O nosso novo wrapper mágico!

// ==========================================
// ÍCONES ESPECÍFICOS DO PERFIL
// ==========================================
const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const TrophyIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" width="20" height="20"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v6.4a5.6 5.6 0 0 1-11.2 0V4z"/><path d="M3 4h4v4H3z"/><path d="M17 4h4v4h-4z"/></svg>
const LockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" width="20" height="20"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const EditPencilIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
const CheckCircleIcon = () => <svg viewBox="0 0 24 24" fill="#22c55e" width="64" height="64"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>

export function AdminPerfilPage() {
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados dos Dados do Perfil
  const [perfil, setPerfil] = useState({
    nome_completo: '', email: '', telefone: '', cpf: '', data_nascimento: '', campeonato: { nome: '' }
  })

  // Estados do Modal de Edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    nome_completo: '', email: '', telefone: '', cpf: '', data_nascimento: ''
  })

  // Estados do Formulário de Senha
  const [senhaForm, setSenhaForm] = useState({
    senhaAtual: '', novaSenha: '', confirmarNovaSenha: ''
  })

  // Estados do Modal de Sucesso
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Formatações
  const formatarTelefone = (tel: string) => {
    if (!tel) return "";
    const n = tel.replace(/\D/g, "");
    if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7, 11)}`;
    return tel;
  }
  
  const formatarCPF = (cpf: string) => {
    if (!cpf) return "";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  
  const extrairDataInput = (dataIso: string) => {
    if (!dataIso) return "";
    return dataIso.split('T')[0];
  }
  
  const formatarDataBr = (dataIso: string) => {
    if (!dataIso) return "";
    return dataIso.split('T')[0].split('-').reverse().join('/');
  }

  // Máscaras para o Modal de Edição
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length <= 11) {
      val = val.replace(/(\d{3})(\d)/, '$1.$2')
      val = val.replace(/(\d{3})(\d)/, '$1.$2')
      val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      setFormData({ ...formData, cpf: val })
    }
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length <= 11) {
      val = val.replace(/^(\d{2})(\d)/g, '($1) $2')
      val = val.replace(/(\d)(\d{4})$/, '$1-$2')
      setFormData({ ...formData, telefone: val })
    }
  }

  useEffect(() => { carregarPerfil() }, [])

  // ==========================================
  // API: CARREGAR PERFIL
  // ==========================================
  const carregarPerfil = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/me') 
      setPerfil({
        ...response.data,
        campeonato: response.data.campeonato || { nome: 'Nenhum campeonato vinculado' }
      })
      
      // Atualiza os dados do localStorage pro nome na topbar atualizar
      const userStorage = JSON.parse(localStorage.getItem('@Refhouse:user') || '{}')
      localStorage.setItem('@Refhouse:user', JSON.stringify({ ...userStorage, nome_completo: response.data.nome_completo }))
    } catch (error) {
      console.error("Erro ao carregar perfil:", error)
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // API: ATUALIZAR INFORMAÇÕES PESSOAIS
  // ==========================================
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
    if (isSubmitting) return;
    try {
      setIsSubmitting(true)
      const payload = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, '')
      }

      await api.put('/admin/me', payload)
      
      setIsEditModalOpen(false)
      setSuccessMessage("Perfil alterado com sucesso!")
      setIsSuccessModalOpen(true)
      carregarPerfil()
    } catch (error: any) {
      alert(error.response?.data?.erro || "Erro ao atualizar perfil.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ==========================================
  // API: ALTERAR SENHA
  // ==========================================
  const handleAlterarSenha = async () => {
    if (!senhaForm.senhaAtual || !senhaForm.novaSenha || !senhaForm.confirmarNovaSenha) {
      alert("Preencha todos os campos de senha.")
      return
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true)
      await api.put('/admin/me/senha', senhaForm)
      
      setSenhaForm({ senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' })
      setSuccessMessage("Senha alterada com sucesso!")
      setIsSuccessModalOpen(true)
    } catch (error: any) {
      alert(error.response?.data?.erro || "Erro ao alterar a senha.")
    } finally {
      setIsSubmitting(false)
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
          
          {/* CARD 1: DADOS PESSOAIS */}
          <div className="dashboard-card perfil-card perfil-card-full">
            <div className="perfil-card-header">
              <UserIcon /> <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#111' }}>Dados Pessoais</h2>
            </div>
            
            <div className="modal-grid-3">
              <div className="form-group">
                <label>Nome Completo:</label>
                <input type="text" className="modal-input readonly-input" value={perfil.nome_completo} readOnly disabled />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" className="modal-input readonly-input" value={perfil.email} readOnly disabled />
              </div>
              <div className="form-group">
                <label>Data de Nascimento:</label>
                <input type="text" className="modal-input readonly-input" value={formatarDataBr(perfil.data_nascimento)} readOnly disabled />
              </div>
              <div className="form-group">
                <label>Telefone:</label>
                <input type="text" className="modal-input readonly-input" value={formatarTelefone(perfil.telefone)} readOnly disabled />
              </div>
              <div className="form-group">
                <label>CPF:</label>
                <input type="text" className="modal-input readonly-input" value={formatarCPF(perfil.cpf)} readOnly disabled />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <button className="btn-salvar" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={abrirModalEdicao}>
                  Editar informações <EditPencilIcon />
                </button>
              </div>
            </div>
          </div>

          {/* CARD 2: DADOS PROFISSIONAIS */}
          <div className="dashboard-card perfil-card">
            <div className="perfil-card-header">
              <TrophyIcon /> <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#111' }}>Dados Profissionais</h2>
            </div>
            <div className="form-group">
              <label>Campeonato:</label>
              <input type="text" className="modal-input readonly-input" value={perfil.campeonato.nome} readOnly disabled />
            </div>
          </div>

          {/* CARD 3: SEGURANÇA */}
          <div className="dashboard-card perfil-card">
            <div className="perfil-card-header">
              <LockIcon /> <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#111' }}>Segurança</h2>
            </div>
            <div className="modal-grid-3">
              <div className="form-group">
                <label>Senha Atual:</label>
                <input type="password" placeholder="••••••••" className="modal-input" value={senhaForm.senhaAtual} onChange={e => setSenhaForm({...senhaForm, senhaAtual: e.target.value})} disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label>Nova Senha:</label>
                <input type="password" placeholder="••••••••" className="modal-input" value={senhaForm.novaSenha} onChange={e => setSenhaForm({...senhaForm, novaSenha: e.target.value})} disabled={isSubmitting} />
              </div>
              <div className="form-group">
                <label>Confirmar Nova Senha:</label>
                <input type="password" placeholder="••••••••" className="modal-input" value={senhaForm.confirmarNovaSenha} onChange={e => setSenhaForm({...senhaForm, confirmarNovaSenha: e.target.value})} disabled={isSubmitting} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn-salvar" onClick={handleAlterarSenha} disabled={isSubmitting}>
                {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* MODAL DE EDIÇÃO DE INFORMAÇÕES             */}
      {/* ========================================== */}
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

      {/* ========================================== */}
      {/* MODAL DE SUCESSO UNIFICADO                 */}
      {/* ========================================== */}
      {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content success-card" style={{ padding: '3rem 2rem' }}>
            <div className="success-icon-wrapper"><CheckCircleIcon /></div>
            <h2 style={{ fontSize: '1.3rem', color: '#111', margin: '1rem 0 2rem' }}>{successMessage}</h2>
            <button className="btn-salvar" style={{ width: '200px' }} onClick={() => setIsSuccessModalOpen(false)}>
              Voltar para o Perfil
            </button>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}