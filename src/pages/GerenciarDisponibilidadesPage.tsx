import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api' 
import { AdminLayout } from '../components/layouts/AdminLayout'

// ==========================================
// ÍCONES SVG ESPECÍFICOS DA TELA
// ==========================================
const CheckCircleIcon = () => <svg viewBox="0 0 24 24" fill="#22c55e" width="64" height="64"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
const CheckSmallIcon = () => <svg viewBox="0 0 24 24" fill="#22c55e" width="18" height="18"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
const WarningIcon = () => <svg viewBox="0 0 24 24" fill="#f59e0b" width="64" height="64"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
const FileIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#ff6b23" strokeWidth="2" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
const SettingsIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#ff6b23" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>

// ==========================================
// INTERFACES
// ==========================================
interface ProgressoColeta {
  total_arbitros: number;
  respostas_enviadas: number;
  porcentagem: number;
}

interface ColetaAberta {
  id: number;
  inicio_jogos: string;
  fim_jogos: string;
  encerramento_em: string;
  status: string;
  progresso: ProgressoColeta;
}

export function GerenciarDisponibilidadesPage() {
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coletasAbertas, setColetasAbertas] = useState<ColetaAberta[]>([])

  const [formData, setFormData] = useState({
    inicio_coleta: '',
    fim_coleta: '',
    inicio_jogos: '',
    fim_jogos: ''
  })

  const [isConfirmAbrirOpen, setIsConfirmAbrirOpen] = useState(false)
  const [isConfirmEncerrarOpen, setIsConfirmEncerrarOpen] = useState(false)
  const [coletaToEncerrar, setColetaToEncerrar] = useState<number | null>(null)
  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileStatus, setFileStatus] = useState<'idle' | 'uploading' | 'success'>('idle')
  const [fileName, setFileName] = useState('')
  const [totalJogos, setTotalJogos] = useState<number>(0)

  // ==========================================
  // INICIALIZAÇÃO E AÇÕES
  // ==========================================
  useEffect(() => {
    carregarAcompanhamento()
  }, [])

  async function carregarAcompanhamento() {
    try {
      setLoading(true)
      const response = await api.get('/coletas/acompanhar') 
      setColetasAbertas(response.data)
    } catch (error) {
      console.error("Erro ao carregar coletas:", error)
    } finally {
      setLoading(false)
    }
  }

  const solicitarAbertura = () => {
    if (!formData.inicio_coleta || !formData.fim_coleta || !formData.inicio_jogos || !formData.fim_jogos) {
      alert("Preencha todas as datas antes de abrir o período.")
      return;
    }

    const dataFimColeta = new Date(formData.fim_coleta);
    const dataInicioJogos = new Date(formData.inicio_jogos);

    if (dataFimColeta > dataInicioJogos) {
      alert("Atenção: O prazo de encerramento da coleta não pode ser depois do início dos jogos!");
      return;
    }

    setIsConfirmAbrirOpen(true);
  }

  const handleAbrirPeriodo = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true)
      await api.post('/coletas/abrir', formData)
      
      setIsConfirmAbrirOpen(false)
      setSuccessMessage("Período de Coleta aberto com sucesso!")
      setIsSuccessModalOpen(true)
      
      setFormData({ inicio_coleta: '', fim_coleta: '', inicio_jogos: '', fim_jogos: '' })
      carregarAcompanhamento()
    } catch (error: any) {
      alert(error.response?.data?.erro || "Erro ao abrir coleta.")
      setIsConfirmAbrirOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const solicitarEncerramento = (id: number) => {
    setColetaToEncerrar(id)
    setIsConfirmEncerrarOpen(true)
  }

  const handleEncerrarColeta = async () => {
    if (isSubmitting || !coletaToEncerrar) return;
    try {
      setIsSubmitting(true)
      await api.put(`/coletas/${coletaToEncerrar}/encerrar`)
      
      setIsConfirmEncerrarOpen(false)
      setSuccessMessage("Coleta encerrada com sucesso!")
      setIsSuccessModalOpen(true)
      
      carregarAcompanhamento()
    } catch (error: any) {
      alert(error.response?.data?.erro || "Erro ao encerrar coleta.")
      setIsConfirmEncerrarOpen(false)
    } finally {
      setIsSubmitting(false)
      setColetaToEncerrar(null)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFileName(file.name)
      setFileStatus('uploading')
      
      const formDataUpload = new FormData();
      formDataUpload.append('file', file); 

      try {
        const response = await api.post('/jogos/importar', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setFileStatus('success')
        const totalRecebido = response.data.totalInserido;
        setTotalJogos(totalRecebido || 0);

        if (response.data.inicio_jogos && response.data.fim_jogos) {
          setFormData(prev => ({
            ...prev,
            inicio_jogos: response.data.inicio_jogos,
            fim_jogos: response.data.fim_jogos
          }));
        }

      } catch (error: any) {
        setFileStatus('idle')
        alert(error.response?.data?.erro || "Erro ao processar o arquivo CSV. Verifique o formato.");
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  }

  const formatarDataMes = (dataIso: string) => {
    if (!dataIso) return ""
    const data = new Date(dataIso)
    const dia = String(data.getUTCDate()).padStart(2, '0')
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    return `${dia} de ${meses[data.getUTCMonth()]}`
  }

  const formatarDataHora = (dataIso: string) => {
    if (!dataIso) return ""
    const data = new Date(dataIso)
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const hora = String(data.getHours()).padStart(2, '0')
    const min = String(data.getMinutes()).padStart(2, '0')
    return `${dia}/${mes} às ${hora}:${min}`
  }

  const coletasAbertasReais = coletasAbertas.filter(c => c.status === 'ABERTA')

  return (
    <AdminLayout breadcrumbs={[{ label: 'Gerenciar Disponibilidades' }]}>
      
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', margin: '0 0 1.5rem 0' }}>Gestão de Disponibilidade</h1>

      <div className="availability-grid">
        
        {/* BLOCO 1: UPLOAD DE JOGOS */}
        <div className="dashboard-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: '#111' }}>Próximas Partidas</h2>
          <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '1.5rem' }}>
            Faça upload da tabela de jogos em formato CSV contendo datas, horários, locais e categorias
          </p>

          <div className="upload-area">
            <span style={{ color: '#6b7280', marginBottom: '1rem', display: 'block' }}>[Arraste o arquivo CSV aqui]<br/>ou</span>
            <input type="file" accept=".csv" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
            <button className="btn-salvar" onClick={() => fileInputRef.current?.click()} disabled={fileStatus === 'uploading'}>
              {fileStatus === 'uploading' ? 'Importando...' : 'Selecionar Arquivo'}
            </button>
          </div>

          {fileStatus === 'success' && (
            <div className="upload-status">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FileIcon /> Arquivo: <strong>{fileName}</strong></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><SettingsIcon /> Total de jogos: <strong>{totalJogos}</strong></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a' }}><CheckSmallIcon /> Status: <strong>Importado com sucesso</strong></div>
            </div>
          )}
        </div>

        {/* BLOCO 2: ABRIR COLETA */}
        <div className="dashboard-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', margin: '0 0 1.5rem 0', color: '#111', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.8rem' }}>Coleta de Disponibilidade</h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#374151' }}>Período da Coleta:</label>
            <div className="date-inputs-row">
              <div className="date-input-group">
                <span>Início:</span>
                <input type="date" value={formData.inicio_coleta} onChange={e => setFormData({...formData, inicio_coleta: e.target.value})} className="modal-input" />
              </div>
              <div className="date-input-group">
                <span>Fim:</span>
                <input type="date" value={formData.fim_coleta} onChange={e => setFormData({...formData, fim_coleta: e.target.value})} className="modal-input" />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', color: '#374151' }}>
              Jogos que essa coleta cobre <span style={{fontSize: '0.8rem', color: '#ff6b23'}}>(Sugestão baseada no CSV)</span>
            </label>
            <div className="date-inputs-row">
              <div className="date-input-group">
                <span>Início:</span>
                <input type="date" value={formData.inicio_jogos} onChange={e => setFormData({...formData, inicio_jogos: e.target.value})} className="modal-input" />
              </div>
              <div className="date-input-group">
                <span>Fim:</span>
                <input type="date" value={formData.fim_jogos} onChange={e => setFormData({...formData, fim_jogos: e.target.value})} className="modal-input" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <button className="btn-salvar" style={{ width: '140px' }} onClick={solicitarAbertura}>Abrir período</button>
            <button className="btn-gray" style={{ width: '140px' }} onClick={() => alert("Histórico em breve")}>Ver histórico</button>
          </div>

          {/* STATUS VERDE SE TIVER COLETA ABERTA */}
          {coletasAbertasReais.length > 0 && (
            <div className="coleta-status-alert">
              <CheckSmallIcon />
              <div>
                <strong>Período aberto</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Encerramento em: {formatarDataHora(coletasAbertasReais[0].encerramento_em)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BLOCO 3: ACOMPANHAMENTO DE COLETAS */}
      <div className="dashboard-card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.8rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', margin: 0, color: '#111' }}>Acompanhar Coletas</h2>
          {coletasAbertasReais.length > 0 && <span className="tag-andamento">Em andamento</span>}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Carregando dados...</div>
        ) : coletasAbertas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Não há nenhuma coleta em andamento ou no histórico recente.</div>
        ) : (
          <div className="coletas-list">
            {coletasAbertas.map(coleta => {
              const isEncerrada = coleta.status === 'ENCERRADA';

              return (
                <div key={coleta.id} className="coleta-item-box" style={{ opacity: isEncerrada ? 0.8 : 1 }}>
                  <div className="coleta-item-header">
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#111', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Semana {formatarDataMes(coleta.inicio_jogos)} a {formatarDataMes(coleta.fim_jogos)}
                      {isEncerrada && (
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#e5e7eb', color: '#4b5563', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          ENCERRADA
                        </span>
                      )}
                    </h3>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151' }}>
                      {coleta.progresso.porcentagem}% Concluído - {coleta.progresso.respostas_enviadas} de {coleta.progresso.total_arbitros} árbitros responderam
                    </div>
                  </div>
                  
                  <div className="coleta-item-body">
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar-fill" 
                        style={{ 
                          width: `${coleta.progresso.porcentagem}%`,
                          backgroundColor: isEncerrada ? '#9ca3af' : '#ea580c' 
                        }}>
                      </div>
                    </div>
                    
                    {!isEncerrada ? (
                      <button className="btn-outline-danger" onClick={() => solicitarEncerramento(coleta.id)}>
                        Encerrar Coleta
                      </button>
                    ) : (
                      <span style={{ padding: '0.4rem 1rem', backgroundColor: '#f3f4f6', color: '#6b7280', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, border: '1px solid #e5e7eb' }}>
                        Finalizada
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMAÇÃO: ABRIR COLETA */}
      {isConfirmAbrirOpen && (
        <div className="modal-overlay">
          <div className="modal-content confirm-card">
            <div className="warning-icon-wrapper"><WarningIcon /></div>
            <h2>Deseja abrir este período de coleta?</h2>
            <p>Os árbitros serão notificados para enviar a disponibilidade.</p>
            <div className="confirm-buttons-row">
              <button className="btn-cancelar-outline" onClick={() => setIsConfirmAbrirOpen(false)} disabled={isSubmitting}>Cancelar</button>
              <button className="btn-salvar" onClick={handleAbrirPeriodo} disabled={isSubmitting}>
                {isSubmitting ? 'Abrindo...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO: ENCERRAR COLETA */}
      {isConfirmEncerrarOpen && (
        <div className="modal-overlay">
          <div className="modal-content confirm-card">
            <div className="warning-icon-wrapper"><WarningIcon /></div>
            <h2>Deseja encerrar esta coleta?</h2>
            <p>Os árbitros não poderão mais enviar respostas para este período.</p>
            <div className="confirm-buttons-row">
              <button className="btn-cancelar-outline" onClick={() => setIsConfirmEncerrarOpen(false)} disabled={isSubmitting}>Cancelar</button>
              <button className="btn-danger" onClick={handleEncerrarColeta} disabled={isSubmitting}>
                {isSubmitting ? 'Encerrando...' : 'Encerrar Coleta'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE SUCESSO */}
      {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content success-card">
            <div className="success-icon-wrapper"><CheckCircleIcon /></div>
            <h2>{successMessage}</h2>
            <button className="btn-salvar" style={{ marginTop: '1rem', width: '150px' }} onClick={() => setIsSuccessModalOpen(false)}>Concluir</button>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}