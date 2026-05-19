import { useState, useEffect } from 'react'
import api from '../services/api'
import { AdminLayout } from '../components/layouts/AdminLayout'

// ==========================================
// ÍCONES SVG ESPECÍFICOS DA TELA
// ==========================================
const EyeIcon = () => <svg viewBox="0 0 24 24" fill="#7a7a7a" width="22" height="22"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
const CsvIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" width="22" height="22" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h2"/><path d="M14 13h-2v4h2"/><path d="M8 17h2"/><path d="M16 13l2 4"/></svg>

// ==========================================
// INTERFACES
// ==========================================
interface ResumoHistorico {
  id: number;
  coletaId: number;
  periodo: string;
  qtdJogos: number;
  qtdArbitros: number;
  status: "Agendado" | "Finalizada";
}

interface DetalheJogo {
  jogoId: number;
  data: string;
  hora: string;
  local: string;
  escalados: {
    quadra: { nome_completo: string }[];
    mesa: { nome_completo: string }[];
  }
}

export function HistoricoPage() {
  const [historico, setHistorico] = useState<ResumoHistorico[]>([])
  const [loading, setLoading] = useState(false)
  
  // Filtros
  const [filtroMes, setFiltroMes] = useState('5') // Setado para Maio pra facilitar os testes atuais
  const [filtroAno, setFiltroAno] = useState('2026')

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [escalaSelecionada, setEscalaSelecionada] = useState<ResumoHistorico | null>(null)
  const [detalhes, setDetalhes] = useState<DetalheJogo[]>([])
  const [loadingModal, setLoadingModal] = useState(false)

  useEffect(() => {
    carregarHistorico()
  }, [filtroMes, filtroAno])

  const carregarHistorico = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/escalas/historico?mes=${filtroMes}&ano=${filtroAno}`)
      setHistorico(response.data)
    } catch (error) {
      console.error("Erro ao carregar histórico", error)
    } finally {
      setLoading(false)
    }
  }

  const abrirModalDetalhes = async (escala: ResumoHistorico) => {
    setEscalaSelecionada(escala)
    setIsModalOpen(true)
    setLoadingModal(true)
    try {
      // Reutiliza a rota de revisão do back-end para pegar os jogos formatados!
      const response = await api.get(`/escalas/revisao/${escala.coletaId}`)
      setDetalhes(response.data)
    } catch (error) {
      alert("Erro ao buscar detalhes da escala.")
    } finally {
      setLoadingModal(false)
    }
  }

  const handleBaixarCSV = async (coletaId: number, periodo: string) => {
    try {
      // Usa responseType 'blob' para conseguir fazer o download do arquivo via Token JWT
      const response = await api.get(`/escalas/exportar/${coletaId}`, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `escala_${periodo.replace(/ /g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Erro ao exportar CSV.");
    }
  }

  const formatarDataBr = (dataIso: string) => {
    if(!dataIso) return '';
    return dataIso.split('-').reverse().slice(0, 2).join('/')
  }

  return (
    <AdminLayout breadcrumbs={[{ label: 'Histórico de Escalas' }]}>
      
      {/* CONTEÚDO PRINCIPAL ENVOLVIDO PELO LAYOUT */}
      <div className="dashboard-card" style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111', margin: '0 0 1.5rem 0' }}>Histórico de Escalas</h1>

        {/* FILTROS */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group" style={{ width: '200px' }}>
            <label>Mês</label>
            <select className="modal-select" value={filtroMes} onChange={e => setFiltroMes(e.target.value)}>
              <option value="">Todos</option>
              <option value="1">Janeiro</option><option value="2">Fevereiro</option><option value="3">Março</option>
              <option value="4">Abril</option><option value="5">Maio</option><option value="6">Junho</option>
              <option value="7">Julho</option><option value="8">Agosto</option><option value="9">Setembro</option>
              <option value="10">Outubro</option><option value="11">Novembro</option><option value="12">Dezembro</option>
            </select>
          </div>
          <div className="form-group" style={{ width: '150px' }}>
            <label>Ano</label>
            <select className="modal-select" value={filtroAno} onChange={e => setFiltroAno(e.target.value)}>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>

        {/* TABELA DE HISTÓRICO */}
        <div className="table-responsive">
          <table className="matches-table">
            <thead>
              <tr>
                <th>Período da Escala</th><th style={{textAlign: 'center'}}>Qtd. de Jogos</th>
                <th style={{textAlign: 'center'}}>Árbitros Escalados</th><th style={{textAlign: 'center'}}>Status</th>
                <th style={{textAlign: 'center'}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Carregando histórico...</td></tr>
              ) : historico.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Nenhuma escala encontrada para este período.</td></tr>
              ) : (
                historico.map(escala => (
                  <tr key={escala.id}>
                    <td style={{ fontWeight: 500, color: '#333' }}>{escala.periodo}</td>
                    <td style={{ textAlign: 'center' }}>{escala.qtdJogos}</td>
                    <td style={{ textAlign: 'center' }}>{escala.qtdArbitros}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={escala.status === 'Agendado' ? 'badge-agendado' : 'badge-finalizada'}>
                        {escala.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-buttons-row" style={{ justifyContent: 'center' }}>
                        <button className="icon-action-btn" title="Visualizar Detalhes" onClick={() => abrirModalDetalhes(escala)}><EyeIcon /></button>
                        <button className="icon-action-btn" title="Baixar CSV" onClick={() => handleBaixarCSV(escala.coletaId, escala.periodo)}><CsvIcon /></button>
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
      {/* MODAL DE DETALHES DA ESCALA                */}
      {/* ========================================== */}
      {isModalOpen && escalaSelecionada && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <header className="modal-header" style={{ padding: '1.5rem 2rem 0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#111' }}>Detalhes da Escala: {escalaSelecionada.periodo}</h3>
              <div style={{ color: '#ff6b23', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.5rem' }}>
                {escalaSelecionada.qtdJogos} Jogos realizados | {escalaSelecionada.qtdArbitros} Árbitros escalados
              </div>
            </header>
            
            <div className="modal-body" style={{ padding: '1rem 2rem 1.5rem' }}>
              {loadingModal ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando detalhes dos jogos...</div>
              ) : (
                <div className="table-responsive" style={{ border: 'none', maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="matches-table modal-details-table">
                    <thead>
                      <tr>
                        <th style={{ width: '10%' }}>Data</th><th style={{ width: '10%' }}>Hora</th>
                        <th style={{ width: '30%' }}>Local</th><th style={{ width: '50%' }}>Árbitros Escalados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detalhes.map(jogo => (
                        <tr key={jogo.jogoId}>
                          <td>{formatarDataBr(jogo.data)}</td>
                          <td>{jogo.hora}</td>
                          <td>{jogo.local || "A definir"}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem' }}>
                              <div><strong>Quadra:</strong> {jogo.escalados.quadra.map(a => a.nome_completo.split(' ').slice(0, 2).join(' ')).join(', ')}</div>
                              <div><strong>Mesa:</strong> {jogo.escalados.mesa.map(a => a.nome_completo.split(' ').slice(0, 2).join(' ')).join(', ')}</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <footer className="modal-footer" style={{ borderTop: '1px solid #e5e7eb', padding: '1.2rem 2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn-gray" onClick={() => setIsModalOpen(false)}>Fechar</button>
              <button className="btn-salvar" onClick={() => handleBaixarCSV(escalaSelecionada.coletaId, escalaSelecionada.periodo)}>Baixar CSV</button>
            </footer>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}