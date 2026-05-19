import { useState, useEffect } from 'react'
import api from '../services/api' 
import { AdminLayout } from '../components/layouts/AdminLayout' // Nosso layout centralizado

// ==========================================
// ÍCONES SVG ESPECÍFICOS DA PÁGINA
// ==========================================
const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#8e9198" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const EyeIcon = () => <svg viewBox="0 0 24 24" fill="#7a7a7a" width="22" height="22"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
const EditIcon = () => <svg viewBox="0 0 24 24" fill="#7a7a7a" width="20" height="20"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
const TrashIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" width="20" height="20" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
const InfoIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>

const CheckCircleIcon = () => <svg viewBox="0 0 24 24" fill="#22c55e" width="64" height="64"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
const WarningIcon = () => <svg viewBox="0 0 24 24" fill="#f59e0b" width="64" height="64"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>

interface Arbitro {
  id: number;
  nome_completo: string;
  email: string;
  cpf: string;
  telefone: string;
  nivel: string;
  tipo_atuacao: string;
  data_nascimento: string;
}

export function GerenciarArbitrosPage() {
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false) 
  const [arbitros, setArbitros] = useState<Arbitro[]>([])
  const [busca, setBusca] = useState("")

  // Modais de Cadastro
  const [isCadastroModalOpen, setIsCadastroModalOpen] = useState(false)
  const [isSuccessCadastroOpen, setIsSuccessCadastroOpen] = useState(false)
  
  // Modais de Edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSuccessEditOpen, setIsSuccessEditOpen] = useState(false)
  const [arbitroEditId, setArbitroEditId] = useState<number | null>(null)

  // Modais de Exclusão
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isSuccessDeleteOpen, setIsSuccessDeleteOpen] = useState(false)
  const [arbitroToDelete, setArbitroToDelete] = useState<number | null>(null)

  // Modal de Visualização
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [arbitroView, setArbitroView] = useState<Arbitro | null>(null)

  const [formData, setFormData] = useState({
    nome_completo: '', cpf: '', telefone: '', email: '',
    data_nascimento: '', nivel: 'Iniciante', tipo_atuacao: 'QUADRA'
  })

  const formatarTelefone = (telefone: string) => {
    if (!telefone) return "Não informado";
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length === 11) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
    if (numeros.length === 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6, 10)}`;
    return telefone;
  }

  const formatarCPFData = (cpf: string) => {
     if(!cpf) return "Não informado";
     return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  const formatarAtuacao = (tipo: string) => {
    if (!tipo) return '-';
    if (tipo === 'AMBOS') return 'Mesa e Quadra';
    return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
  }

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

  useEffect(() => { carregarArbitros() }, [])

  async function carregarArbitros() {
    try {
      setLoading(true)
      const response = await api.get('/arbitros') 
      setArbitros(response.data)
    } catch (error) {
      console.error("Erro ao carregar:", error)
    } finally {
      setLoading(false)
    }
  }

  const abrirCadastro = () => {
    setFormData({
      nome_completo: '', cpf: '', telefone: '', email: '',
      data_nascimento: '', nivel: 'Iniciante', tipo_atuacao: 'QUADRA'
    })
    setIsCadastroModalOpen(true)
  }

  const handleCadastrar = async () => {
    if (isSubmitting) return; 
    try {
      setIsSubmitting(true)
      const payload = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, '')
      }

      await api.post('/arbitros/cadastrar', payload)
      
      setIsCadastroModalOpen(false)
      setIsSuccessCadastroOpen(true) 
      carregarArbitros()
      
    } catch (error: any) {
      alert(error.response?.data?.erro || "Erro ao cadastrar árbitro.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const abrirEdicao = (arbitro: Arbitro) => {
    setIsViewModalOpen(false) 
    setFormData({
      nome_completo: arbitro.nome_completo,
      cpf: formatarCPFData(arbitro.cpf), 
      telefone: formatarTelefone(arbitro.telefone), 
      email: arbitro.email, 
      data_nascimento: arbitro.data_nascimento ? arbitro.data_nascimento.substring(0, 10) : '',
      nivel: arbitro.nivel,
      tipo_atuacao: arbitro.tipo_atuacao
    })
    setArbitroEditId(arbitro.id)
    setIsEditModalOpen(true)
  }

  const handleEditar = async () => {
    if (isSubmitting || !arbitroEditId) return;

    try {
      setIsSubmitting(true)
      const payload = {
        nome_completo: formData.nome_completo,
        telefone: formData.telefone.replace(/\D/g, ''),
        tipo_atuacao: formData.tipo_atuacao,
        nivel: formData.nivel
      }

      await api.put(`/arbitros/${arbitroEditId}`, payload)

      setIsEditModalOpen(false)
      setIsSuccessEditOpen(true)
      carregarArbitros()

    } catch (error: any) {
      alert(error.response?.data?.erro || "Erro ao atualizar árbitro.")
    } finally {
      setIsSubmitting(false)
      setArbitroEditId(null)
    }
  }

  const abrirConfirmacaoDelete = (id: number) => {
    setArbitroToDelete(id)
    setIsViewModalOpen(false) 
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmarDelete = async () => {
    if (!arbitroToDelete || isSubmitting) return;
    
    try {
      setIsSubmitting(true)
      await api.delete(`/arbitros/${arbitroToDelete}`)
      
      setArbitros(arbitros.filter(a => a.id !== arbitroToDelete))
      setIsDeleteConfirmOpen(false)
      setIsSuccessDeleteOpen(true) 
    } catch (error) {
      alert("Erro ao excluir o árbitro.")
      setIsDeleteConfirmOpen(false)
    } finally {
      setIsSubmitting(false)
      setArbitroToDelete(null)
    }
  }

  const abrirVisualizacao = (arbitro: Arbitro) => {
    setArbitroView(arbitro)
    setIsViewModalOpen(true)
  }

  const arbitrosFiltrados = arbitros.filter(arbitro => {
    const termo = busca.toLowerCase()
    return (
      arbitro.nome_completo.toLowerCase().includes(termo) ||
      arbitro.email.toLowerCase().includes(termo) ||
      arbitro.cpf.includes(termo)
    )
  })

  return (
    // 👇 O Layout Mágico
    <AdminLayout breadcrumbs={[{ label: 'Gerenciar Árbitros' }]}>
      
      <div className="dashboard-card" style={{ padding: '2rem' }}>
        <div className="page-header-flex" style={{ marginTop: 0 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111', margin: 0 }}>Gerenciar Árbitros</h1>
          <button className="btn-salvar" onClick={abrirCadastro} style={{ padding: '0.6rem 1.2rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
            + Cadastrar Árbitro
          </button>
        </div>

        <div className="search-container">
          <SearchIcon />
          <input type="text" placeholder="Buscar por nome, email, CPF..." className="search-input" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>

        <div className="table-responsive">
          <table className="matches-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Atuação</th> 
                <th>Experiência</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Carregando árbitros...</td></tr>
              ) : arbitrosFiltrados.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Nenhum árbitro encontrado.</td></tr>
              ) : (
                arbitrosFiltrados.map((arbitro) => (
                  <tr key={arbitro.id}>
                    <td style={{ fontWeight: 500, color: '#333' }}>{arbitro.nome_completo}</td>
                    <td style={{ color: '#555' }}>{arbitro.email}</td>
                    <td style={{ color: '#555' }}>{formatarTelefone(arbitro.telefone)}</td>
                    <td style={{ color: '#555' }}>{formatarAtuacao(arbitro.tipo_atuacao)}</td>
                    <td>{arbitro.nivel}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-buttons-row">
                        <button className="icon-action-btn" title="Visualizar" onClick={() => abrirVisualizacao(arbitro)}><EyeIcon /></button>
                        <button className="icon-action-btn" title="Editar" onClick={() => abrirEdicao(arbitro)}><EditIcon /></button>
                        <button className="icon-action-btn trash-btn" title="Excluir" onClick={() => abrirConfirmacaoDelete(arbitro.id)}><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL DE CADASTRO */}
      {/* ========================================== */}
      {isCadastroModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <header className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem 1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#111' }}>Cadastrar Novo Árbitro</h3>
              <button onClick={() => setIsCadastroModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </header>
            <div className="modal-body" style={{ padding: '0 2rem 1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label>Nome Completo</label>
                <input type="text" className="modal-input" value={formData.nome_completo} onChange={(e) => setFormData({...formData, nome_completo: e.target.value})} disabled={isSubmitting} />
              </div>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label>CPF</label>
                <input type="text" className="modal-input" placeholder="___.___.___-__" value={formData.cpf} onChange={handleCpfChange} disabled={isSubmitting} />
              </div>
              <div className="modal-grid-2" style={{ marginBottom: '1.2rem' }}>
                <div className="form-group">
                  <label>Telefone</label>
                  <input type="text" className="modal-input" placeholder="(__) _____-____" value={formData.telefone} onChange={handleTelefoneChange} disabled={isSubmitting}/>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="modal-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={isSubmitting}/>
                </div>
              </div>
              <div className="modal-grid-2" style={{ marginBottom: '1.2rem' }}>
                <div className="form-group">
                  <label>Data de Nascimento</label>
                  <input type="date" className="modal-input" value={formData.data_nascimento} onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})} disabled={isSubmitting} />
                </div>
                <div className="form-group">
                  <label>Nível do Árbitro</label>
                  <select className="modal-select" value={formData.nivel} onChange={(e) => setFormData({...formData, nivel: e.target.value})} disabled={isSubmitting}>
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Atuação</label>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><input type="radio" name="atuacao" value="QUADRA" checked={formData.tipo_atuacao === 'QUADRA'} onChange={(e) => setFormData({...formData, tipo_atuacao: e.target.value})} disabled={isSubmitting} /> Quadra</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><input type="radio" name="atuacao" value="MESA" checked={formData.tipo_atuacao === 'MESA'} onChange={(e) => setFormData({...formData, tipo_atuacao: e.target.value})} disabled={isSubmitting}/> Mesa</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><input type="radio" name="atuacao" value="AMBOS" checked={formData.tipo_atuacao === 'AMBOS'} onChange={(e) => setFormData({...formData, tipo_atuacao: e.target.value})} disabled={isSubmitting}/> Ambos</label>
                </div>
              </div>
              <div className="info-box">
                <InfoIcon />
                <span>Nota: Uma senha inicial padrão baseada no CPF será gerada automaticamente. O árbitro deverá alterá-la no seu perfil.</span>
              </div>
            </div>
            <footer className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1.2rem 2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn-cancelar-outline" onClick={() => setIsCadastroModalOpen(false)} disabled={isSubmitting}>Cancelar</button>
              <button className="btn-salvar" onClick={handleCadastrar} disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Salvando...' : 'Cadastrar'}
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. MODAL DE EDIÇÃO DE ÁRBITRO              */}
      {/* ========================================== */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <header className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem 1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#111' }}>Editar Árbitro</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </header>
            <div className="modal-body" style={{ padding: '0 2rem 1.5rem' }}>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label>Nome Completo</label>
                <input type="text" className="modal-input" value={formData.nome_completo} onChange={(e) => setFormData({...formData, nome_completo: e.target.value})} disabled={isSubmitting} />
              </div>
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label>CPF <span style={{fontSize: '0.8rem', color: '#999'}}>(Não Editável)</span></label>
                <input type="text" className="modal-input" value={formData.cpf} disabled={true} style={{backgroundColor: '#f3f4f6'}} />
              </div>
              <div className="modal-grid-2" style={{ marginBottom: '1.2rem' }}>
                <div className="form-group">
                  <label>Telefone</label>
                  <input type="text" className="modal-input" placeholder="(__) _____-____" value={formData.telefone} onChange={handleTelefoneChange} disabled={isSubmitting}/>
                </div>
                <div className="form-group">
                  <label>Email <span style={{fontSize: '0.8rem', color: '#999'}}>(Não Editável)</span></label>
                  <input type="email" className="modal-input" value={formData.email} disabled={true} style={{backgroundColor: '#f3f4f6'}}/>
                </div>
              </div>
              <div className="modal-grid-2" style={{ marginBottom: '1.2rem' }}>
                <div className="form-group">
                  <label>Data de Nascimento <span style={{fontSize: '0.8rem', color: '#999'}}>(Não Editável)</span></label>
                  <input type="date" className="modal-input" value={formData.data_nascimento} disabled={true} style={{backgroundColor: '#f3f4f6'}} />
                </div>
                <div className="form-group">
                  <label>Nível do Árbitro</label>
                  <select className="modal-select" value={formData.nivel} onChange={(e) => setFormData({...formData, nivel: e.target.value})} disabled={isSubmitting}>
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Atuação</label>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><input type="radio" name="atuacao_edit" value="QUADRA" checked={formData.tipo_atuacao === 'QUADRA'} onChange={(e) => setFormData({...formData, tipo_atuacao: e.target.value})} disabled={isSubmitting} /> Quadra</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><input type="radio" name="atuacao_edit" value="MESA" checked={formData.tipo_atuacao === 'MESA'} onChange={(e) => setFormData({...formData, tipo_atuacao: e.target.value})} disabled={isSubmitting}/> Mesa</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><input type="radio" name="atuacao_edit" value="AMBOS" checked={formData.tipo_atuacao === 'AMBOS'} onChange={(e) => setFormData({...formData, tipo_atuacao: e.target.value})} disabled={isSubmitting}/> Ambos</label>
                </div>
              </div>
            </div>
            <footer className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1.2rem 2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn-cancelar-outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>Cancelar</button>
              <button className="btn-salvar" onClick={handleEditar} disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. MODAL DE SUCESSO (CADASTRO / EDIÇÃO)    */}
      {/* ========================================== */}
      {isSuccessCadastroOpen && (
        <div className="modal-overlay">
          <div className="modal-content success-card">
            <div className="success-icon-wrapper"><CheckCircleIcon /></div>
            <h2>Cadastro Realizado com Sucesso!</h2>
            <div className="success-buttons-row">
              <button className="btn-salvar" onClick={() => setIsSuccessCadastroOpen(false)}>Voltar</button>
              <button className="btn-gray" onClick={() => { setIsSuccessCadastroOpen(false); abrirCadastro(); }}>Novo cadastro</button>
            </div>
          </div>
        </div>
      )}

      {isSuccessEditOpen && (
        <div className="modal-overlay">
          <div className="modal-content success-card">
            <div className="success-icon-wrapper"><CheckCircleIcon /></div>
            <h2>Árbitro Atualizado com Sucesso!</h2>
            <div className="success-buttons-row">
              <button className="btn-salvar" onClick={() => setIsSuccessEditOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. MODAL DE CONFIRMAÇÃO DE EXCLUSÃO        */}
      {/* ========================================== */}
      {isDeleteConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-content confirm-card">
            <div className="warning-icon-wrapper"><WarningIcon /></div>
            <h2>Deseja mesmo deletar esse árbitro?</h2>
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
      {/* 5. MODAL DE SUCESSO DE EXCLUSÃO            */}
      {/* ========================================== */}
      {isSuccessDeleteOpen && (
        <div className="modal-overlay">
          <div className="modal-content success-card">
            <div className="success-icon-wrapper"><CheckCircleIcon /></div>
            <h2>Árbitro excluído com sucesso!</h2>
            <button className="btn-salvar" style={{ marginTop: '1rem', padding: '0.6rem 2rem' }} onClick={() => setIsSuccessDeleteOpen(false)}>Fechar</button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 6. MODAL DE VISUALIZAÇÃO DOS DETALHES      */}
      {/* ========================================== */}
      {isViewModalOpen && arbitroView && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <header className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#111' }}>Detalhes do Árbitro</h3>
              <button onClick={() => setIsViewModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
            </header>
            
            <div className="modal-body" style={{ padding: '1.5rem 2rem' }}>
              <div className="view-grid">
                <div className="view-item">
                  <span className="view-label">Nome Completo</span>
                  <span className="view-value">{arbitroView.nome_completo}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">CPF</span>
                  <span className="view-value">{formatarCPFData(arbitroView.cpf)}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">Email</span>
                  <span className="view-value">{arbitroView.email}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">Telefone</span>
                  <span className="view-value">{formatarTelefone(arbitroView.telefone)}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">Nível de Experiência</span>
                  <span className="view-value">{arbitroView.nivel}</span>
                </div>
                <div className="view-item">
                  <span className="view-label">Atuação Preferencial</span>
                  <span className="view-value">{formatarAtuacao(arbitroView.tipo_atuacao)}</span>
                </div>
              </div>
            </div>

            <footer className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1.2rem 2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
               <button className="btn-cancelar-outline" onClick={() => abrirEdicao(arbitroView)}>Editar</button>
               <button className="btn-danger" onClick={() => abrirConfirmacaoDelete(arbitroView.id)}>Deletar</button>
            </footer>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}