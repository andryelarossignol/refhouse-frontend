import { useState } from 'react'
import { useAvisos, type Aviso } from '../hooks/useAvisos'
import { useToast } from '../context/ToastContext'
import { AdminLayout } from '../components/layouts/AdminLayout'
import { SuccessModal } from '../components/common/SuccessModal'
import { ConfirmModal } from '../components/common/ConfirmModal'
import { PageHeader } from '../components/common/PageHeader'
import { formatarDataBr, extrairDataInput } from '../utils/formatters'

const EditIcon = () => <svg viewBox="0 0 24 24" fill="#7a7a7a" width="20" height="20"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" width="20" height="20" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
const AlertaIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" width="24" height="24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
const GeralIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const RegraIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" width="24" height="24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>

const emptyForm = { titulo: '', mensagem: '', categoria: 'ALERTA', data_validade: '', notificar: false }

export function GerenciarAvisosPage() {
  const { avisos, loading, isSubmitting, criar, editar, deletar } = useAvisos()
  const { showToast } = useToast()
  const [abaAtiva, setAbaAtiva] = useState<'ativos' | 'expirados'>('ativos')
  const [formData, setFormData] = useState(emptyForm)
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [avisoEditId, setAvisoEditId] = useState<number | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [successAction, setSuccessAction] = useState<'cadastrar' | 'editar' | 'deletar' | ''>('')
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [avisoToDelete, setAvisoToDelete] = useState<number | null>(null)

  const calcularDiasPassados = (dataCriacao: string) => {
    const diffDias = Math.floor(Math.abs(new Date().getTime() - new Date(dataCriacao).getTime()) / (1000 * 60 * 60 * 24))
    if (diffDias === 0) return 'Criado hoje'
    if (diffDias === 1) return 'Criado há 1 dia'
    return `Criado há ${diffDias} dias`
  }

  const dataAtual = new Date()
  dataAtual.setHours(0, 0, 0, 0)
  const avisosFiltrados = avisos.filter(aviso => {
    const dataValidade = new Date(aviso.data_validade)
    dataValidade.setHours(23, 59, 59, 999)
    return abaAtiva === 'ativos' ? dataValidade >= dataAtual : dataValidade < dataAtual
  })

  const abrirCadastro = () => { setFormData(emptyForm); setIsCadastroModalOpen(true) }

  const abrirEdicao = (aviso: Aviso) => {
    setFormData({ titulo: aviso.titulo, mensagem: aviso.mensagem, categoria: aviso.categoria, data_validade: extrairDataInput(aviso.data_validade), notificar: false })
    setAvisoEditId(aviso.id)
    setIsEditModalOpen(true)
  }

  const handleCadastrar = async () => {
    try {
      await criar(formData)
      setIsCadastroModalOpen(false)
      setSuccessMessage('Aviso Criado com Sucesso!'); setSuccessAction('cadastrar'); setIsSuccessModalOpen(true)
    } catch (error: any) { showToast('error', error.response?.data?.erro || 'Erro ao criar aviso.') }
  }

  const handleEditar = async () => {
    if (!avisoEditId) return
    try {
      await editar(avisoEditId, formData)
      setIsEditModalOpen(false)
      setSuccessMessage('Aviso Atualizado com Sucesso!'); setSuccessAction('editar'); setIsSuccessModalOpen(true)
      setAvisoEditId(null)
    } catch (error: any) { showToast('error', error.response?.data?.erro || 'Erro ao atualizar aviso.') }
  }

  const handleConfirmarDelete = async () => {
    if (!avisoToDelete) return
    try {
      await deletar(avisoToDelete)
      setIsDeleteConfirmOpen(false)
      setSuccessMessage('Aviso excluído com sucesso!'); setSuccessAction('deletar'); setIsSuccessModalOpen(true)
    } catch { showToast('error', 'Erro ao excluir o aviso.'); setIsDeleteConfirmOpen(false) }
  }

  const closeForm = () => { setIsCadastroModalOpen(false); setIsEditModalOpen(false) }

  return (
    <AdminLayout breadcrumbs={[{ label: 'Gerenciar Avisos' }]}>

      <div className="dashboard-card" style={{ padding: '2rem', backgroundColor: '#f9fafb' }}>
        <PageHeader title="Gerenciar Avisos" actionLabel="+ Novo Aviso" onAction={abrirCadastro} />

        <div className="tabs-container">
          <button className={`tab-button ${abaAtiva === 'ativos' ? 'active' : ''}`} onClick={() => setAbaAtiva('ativos')}>Ativos</button>
          <button className={`tab-button ${abaAtiva === 'expirados' ? 'active' : ''}`} onClick={() => setAbaAtiva('expirados')}>Expirados</button>
        </div>

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
                    <div className="aviso-datas">{calcularDiasPassados(aviso.criado_em)} • Validade até: {formatarDataBr(aviso.data_validade)}</div>
                  </div>
                  <p className="aviso-mensagem">{aviso.mensagem}</p>
                </div>
                <div className="aviso-actions">
                  <button className="icon-action-btn" title="Editar" onClick={() => abrirEdicao(aviso)}><EditIcon /></button>
                  <button className="icon-action-btn trash-btn" title="Excluir" onClick={() => { setAvisoToDelete(aviso.id); setIsDeleteConfirmOpen(true) }}><TrashIcon /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {(isCadastroModalOpen || isEditModalOpen) && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <header className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem 1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#111' }}>{isEditModalOpen ? 'Editar Aviso' : 'Criar Novo Aviso'}</h3>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </header>
            <div className="modal-body" style={{ padding: '0 2rem 1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}><label>Título do Aviso</label><input type="text" className="modal-input" placeholder="ex: Reunião Geral de Árbitros" value={formData.titulo} onChange={(e) => setFormData({...formData, titulo: e.target.value})} disabled={isSubmitting} /></div>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}><label>Mensagem do Aviso</label><textarea className="modal-input" placeholder="ex: Favor confirmar presença..." rows={4} style={{ resize: 'none' }} value={formData.mensagem} onChange={(e) => setFormData({...formData, mensagem: e.target.value})} disabled={isSubmitting} /></div>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}><label>Categoria</label><select className="modal-select" value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} disabled={isSubmitting}><option value="ALERTA">📢 ALERTA</option><option value="GERAL">⏱️ GERAL</option><option value="REGRA">📖 REGRA</option></select></div>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}><label>Data de Validade</label><input type="date" className="modal-input" value={formData.data_validade} onChange={(e) => setFormData({...formData, data_validade: e.target.value})} disabled={isSubmitting} /></div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '1rem', fontSize: '0.9rem', color: '#333' }}>
                <input type="checkbox" checked={formData.notificar} onChange={(e) => setFormData({...formData, notificar: e.target.checked})} disabled={isSubmitting} />
                Enviar notificação para todos os árbitros
              </label>
            </div>
            <footer className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1.2rem 2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn-cancelar-outline" onClick={closeForm} disabled={isSubmitting}>Cancelar</button>
              <button className="btn-salvar" onClick={isEditModalOpen ? handleEditar : handleCadastrar} disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : isEditModalOpen ? 'Atualizar Aviso' : 'Criar Aviso'}</button>
            </footer>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && <ConfirmModal title="Deseja mesmo deletar esse aviso?" message="Essa ação não poderá ser desfeita." confirmLabel={isSubmitting ? 'Deletando...' : 'Deletar'} isDanger isLoading={isSubmitting} onConfirm={handleConfirmarDelete} onCancel={() => setIsDeleteConfirmOpen(false)} />}

      {isSuccessModalOpen && <SuccessModal title={successMessage} primaryLabel="Voltar" onClose={() => setIsSuccessModalOpen(false)} secondaryLabel={successAction === 'cadastrar' || successAction === 'editar' ? 'Novo aviso' : undefined} onSecondaryAction={successAction === 'cadastrar' || successAction === 'editar' ? () => { setIsSuccessModalOpen(false); abrirCadastro(); } : undefined} />}

    </AdminLayout>
  )
}
