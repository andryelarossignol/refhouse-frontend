import { useState, useEffect } from 'react'
import api from '../services/api'
import { AdminLayout } from '../components/layouts/AdminLayout' // O layout padronizado

// ==========================================
// ÍCONES SVG ESPECÍFICOS DESTA TELA
// ==========================================
const EditIcon = () => <svg viewBox="0 0 24 24" fill="#7a7a7a" width="20" height="20"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" width="20" height="20" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
const CheckCircleIcon = () => <svg viewBox="0 0 24 24" fill="#22c55e" width="64" height="64"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
const WarningIcon = () => <svg viewBox="0 0 24 24" fill="#f59e0b" width="64" height="64"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>

// ÍCONES DE CATEGORIA DE AVISO
const AlertaIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" width="24" height="24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
const GeralIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const RegraIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" width="24" height="24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>

interface Aviso {
  id: number;
  titulo: string;
  mensagem: string;
  categoria: string;
  data_validade: string;
  criado_em: string;
}

export function GerenciarAvisosPage() {
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [abaAtiva, setAbaAtiva] = useState<'ativos' | 'expirados'>('ativos')

  // ==========================================
  // ESTADOS DOS MODAIS
  // ==========================================
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [avisoEditId, setAvisoEditId] = useState<number | null>(null)
  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [successAction, setSuccessAction] = useState<"cadastrar" | "editar" | "deletar" | "">("")

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [avisoToDelete, setAvisoToDelete] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    titulo: '',
    mensagem: '',
    categoria: 'GERAL',
    data_validade: '',
    notificar: false // Apenas visual no frontend por enquanto
  })

  // ==========================================
  // FUNÇÕES DE DATA E TEMPO
  // ==========================================
  useEffect(() => { carregarAvisos() }, [])

  async function carregarAvisos() {
    try {
      setLoading(true)
      const response = await api.get('/avisos')
      setAvisos(response.data)
    } catch (error) {
      console.error("Erro ao carregar os avisos:", error)
    } finally {
      setLoading(false)
    }
  }

  const calcularDiasPassados = (dataCriacao: string) => {
    const hoje = new Date()
    const criacao = new Date(dataCriacao)
    const diffTempo = Math.abs(hoje.getTime() - criacao.getTime())
    const diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24))
    if (diffDias === 0) return "Criado hoje"
    if (diffDias === 1) return "Criado há 1 dia"
    return `Criado há ${diffDias} dias`
  }

  const formatarDataBr = (dataIso: string) => {
    if (!dataIso) return ""
    const data = new Date(dataIso)
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  }

  const extrairDataInput = (dataIso: string) => {
    if (!dataIso) return ""
    return dataIso.split('T')[0]
  }

  // Filtra Ativos / Expirados
  const dataAtual = new Date()
  dataAtual.setHours(0, 0, 0, 0) 

  const avisosFiltrados = avisos.filter(aviso => {
    const dataValidade = new Date(aviso.data_validade)
    dataValidade.setHours(23, 59, 59, 999) 
    
    if (abaAtiva === 'ativos') return dataValidade >= dataAtual
    return dataValidade < dataAtual
  })

  // ==========================================
  // FLUXOS DO CRUD
  // ==========================================
  const abrirCadastro = () => {
    setFormData({ titulo: '', mensagem: '', categoria: 'ALERTA', data_validade: '', notificar: false })
    setIsCadastroModalOpen(true)
  }

  const handleCadastrar = async () => {
    if (isSubmitting) return; 
    try {
      setIsSubmitting(true)
      await api.post('/avisos', formData)
      
      setIsCadastroModalOpen(false)
      setSuccessMessage("Aviso Criado com Sucesso!")
      setSuccessAction("cadastrar")
      setIsSuccessModalOpen(true) 
      carregarAvisos()
    } catch (error: any) {
      alert(error.response?.data?.erro || "Erro ao criar aviso.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const abrirEdicao = (aviso: Aviso) => {
    setFormData({
      titulo: aviso.titulo,
      mensagem: aviso.mensagem,
      categoria: aviso.categoria,
      data_validade: extrairDataInput(aviso.data_validade),
      notificar: false
    })
    setAvisoEditId(aviso.id)
    setIsEditModalOpen(true)
  }

  const handleEditar = async () => {
    if (isSubmitting || !avisoEditId) return;
    try {
      setIsSubmitting(true)
      await api.put(`/avisos/${avisoEditId}`, formData)

      setIsEditModalOpen(false)
      setSuccessMessage("Aviso Atualizado com Sucesso!")
      setSuccessAction("editar")
      setIsSuccessModalOpen(true)
      carregarAvisos()
    } catch (error: any) {
      alert(error.response?.data?.erro || "Erro ao atualizar aviso.")
    } finally {
      setIsSubmitting(false)
      setAvisoEditId(null)
    }
  }

  const abrirConfirmacaoDelete = (id: number) => {
    setAvisoToDelete(id)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmarDelete = async () => {
    if (!avisoToDelete || isSubmitting) return;
    try {
      setIsSubmitting(true)
      await api.delete(`/avisos/${avisoToDelete}`)
      
      setAvisos(avisos.filter(a => a.id !== avisoToDelete))
      setIsDeleteConfirmOpen(false)
      
      setSuccessMessage("Aviso excluído com sucesso!")
      setSuccessAction("deletar")
      setIsSuccessModalOpen(true) 
    } catch (error) {
      alert("Erro ao excluir o aviso.")
      setIsDeleteConfirmOpen(false)
    } finally {
      setIsSubmitting(false)
      setAvisoToDelete(null)
    }
  }

  return (
    <AdminLayout breadcrumbs={[{ label: 'Gerenciar Avisos' }]}>
      
      {/* CONTEÚDO PRINCIPAL ENVOLVIDO PELO LAYOUT */}
      <div className="dashboard-card" style={{ padding: '2rem', backgroundColor: '#f9fafb' }}>
        
        <div className="page-header-flex">
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111', margin: 0 }}>Gerenciar Avisos</h1>
          <button className="btn-salvar" onClick={abrirCadastro} style={{ padding: '0.6rem 1.2rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
            + Novo Aviso
          </button>
        </div>

        {/* ABAS (Tabs) */}
        <div className="tabs-container">
          <button className={`tab-button ${abaAtiva === 'ativos' ? 'active' : ''}`} onClick={() => setAbaAtiva('ativos')}>
            Ativos
          </button>
          <button className={`tab-button ${abaAtiva === 'expirados' ? 'active' : ''}`} onClick={() => setAbaAtiva('expirados')}>
            Expirados
          </button>
        </div>

        {/* LISTA DE AVISOS */}
        <div className="avisos-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Carregando avisos...</div>
          ) : avisosFiltrados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Nenhum aviso encontrado nesta aba.</div>
          ) : (
            avisosFiltrados.map((aviso) => (
              <div key={aviso.id} className="aviso-card">
                <div className={`aviso-icon-box ${aviso.categoria.toLowerCase()}`}>
                  {aviso.categoria === 'ALERTA' && <AlertaIcon />}
                  {aviso.categoria === 'GERAL' && <GeralIcon />}
                  {aviso.categoria === 'REGRA' && <RegraIcon />}
                </div>
                
                <div className="aviso-content">
                  <div className="aviso-meta">
                    <span className="aviso-categoria">{aviso.categoria}</span>
                    <h4 className="aviso-titulo">{aviso.titulo}</h4>
                    <div className="aviso-datas">
                      {calcularDiasPassados(aviso.criado_em)} • Validade até: {formatarDataBr(aviso.data_validade)}
                    </div>
                  </div>
                  <p className="aviso-mensagem">{aviso.mensagem}</p>
                </div>

                <div className="aviso-actions">
                  <button className="icon-action-btn" title="Editar" onClick={() => abrirEdicao(aviso)}><EditIcon /></button>
                  <button className="icon-action-btn trash-btn" title="Excluir" onClick={() => abrirConfirmacaoDelete(aviso.id)}><TrashIcon /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL DE CADASTRO / EDIÇÃO DE AVISO        */}
      {/* ========================================== */}
      {(isCadastroModalOpen || isEditModalOpen) && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <header className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem 1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#111' }}>
                {isEditModalOpen ? 'Editar Aviso' : 'Criar Novo Aviso'}
              </h3>
              <button onClick={() => { setIsCadastroModalOpen(false); setIsEditModalOpen(false); }} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </header>
            
            <div className="modal-body" style={{ padding: '0 2rem 1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label>Título do Aviso</label>
                <input type="text" className="modal-input" placeholder="ex: Reunião Geral de Árbitros" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} disabled={isSubmitting} />
              </div>

              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label>Mensagem do Aviso</label>
                <textarea className="modal-input" placeholder="ex: Favor confirmar presença..." rows={4} style={{ resize: 'none' }} value={formData.mensagem} onChange={(e) => setFormData({...formData, mensagem: e.target.value})} disabled={isSubmitting} />
              </div>

              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label>Categoria</label>
                <select className="modal-select" value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} disabled={isSubmitting}>
                  <option value="ALERTA">📢 ALERTA</option>
                  <option value="GERAL">⏱️ GERAL</option>
                  <option value="REGRA">📖 REGRA</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label>Data de Validade</label>
                <input type="date" className="modal-input" value={formData.data_validade} onChange={(e) => setFormData({...formData, data_validade: e.target.value})} disabled={isSubmitting} />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '1rem', fontSize: '0.9rem', color: '#333' }}>
                <input type="checkbox" checked={formData.notificar} onChange={(e) => setFormData({...formData, notificar: e.target.checked})} disabled={isSubmitting} />
                Enviar notificação para todos os árbitros
              </label>
            </div>

            <footer className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1.2rem 2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn-cancelar-outline" onClick={() => { setIsCadastroModalOpen(false); setIsEditModalOpen(false); }} disabled={isSubmitting}>Cancelar</button>
              <button className="btn-salvar" onClick={isEditModalOpen ? handleEditar : handleCadastrar} disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Salvando...' : isEditModalOpen ? 'Atualizar Aviso' : 'Criar Aviso'}
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO           */}
      {/* ========================================== */}
      {isDeleteConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-content confirm-card">
            <div className="warning-icon-wrapper"><WarningIcon /></div>
            <h2>Deseja mesmo deletar esse aviso?</h2>
            <p>Essa ação não poderá ser desfeita.</p>
            <div className="confirm-buttons-row">
              <button className="btn-cancelar-outline" onClick={() => setIsDeleteConfirmOpen(false)} disabled={isSubmitting}>Cancelar</button>
              <button className="btn-danger" onClick={handleConfirmarDelete} disabled={isSubmitting}>
                {isSubmitting ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL DE SUCESSO UNIFICADO                 */}
      {/* ========================================== */}
      {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content success-card">
            <div className="success-icon-wrapper"><CheckCircleIcon /></div>
            <h2>{successMessage}</h2>
            <div className="success-buttons-row">
              <button className="btn-salvar" onClick={() => setIsSuccessModalOpen(false)}>Voltar</button>
              
              {/* Botão extra de "Novo" só aparece se foi fluxo de criar/editar */}
              {(successAction === 'cadastrar' || successAction === 'editar') && (
                <button className="btn-gray" onClick={() => { setIsSuccessModalOpen(false); abrirCadastro(); }}>Novo aviso</button>
              )}
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}