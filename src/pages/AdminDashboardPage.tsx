import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminDashboard, type Partida } from '../hooks/useAdminDashboard'
import { AdminLayout } from '../components/layouts/AdminLayout'
import { SuccessModal } from '../components/common/SuccessModal'
import { useToast } from '../context/ToastContext'
import { formatarDataBr } from '../utils/formatters'

const EscalasIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>
const DisponibilidadeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
const ArbitrosIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const AvisosIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
const EditIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#8e9198" strokeWidth="2" width="20" height="20"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>

export function AdminDashboardPage() {
  const navigate = useNavigate()
  const {
    partidas, eventosCalendario, loading, isSubmitting,
    mesAtual, setMesAtual, anoAtual, setAnoAtual,
    opcoesDisponiveis, carregarOpcoesSubstituicao, salvarTrocaArbitro
  } = useAdminDashboard()
  const { showToast } = useToast()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [jogoEditando, setJogoEditando] = useState<Partida | null>(null)

  const abrirModalEdicao = async (partida: Partida) => {
    setJogoEditando(partida)
    try {
      await carregarOpcoesSubstituicao(partida.id)
      setIsModalOpen(true)
    } catch {
      showToast('error', 'Não foi possível carregar as opções de substituição.')
    }
  }

  const handleTrocaArbitro = (indexNoArray: number, novoArbitroId: number) => {
    if (!jogoEditando) return
    const jaEstaEscalado = jogoEditando.arbitros.some(a => a.id === novoArbitroId)
    if (jaEstaEscalado) { showToast('warning', 'Este árbitro já está escalado para esta partida.'); return }
    const arbitroEscolhido = opcoesDisponiveis.find(op => op.id === novoArbitroId)
    if (!arbitroEscolhido) return
    const novaListaArbitros = [...jogoEditando.arbitros]
    novaListaArbitros[indexNoArray] = { id: arbitroEscolhido.id, nome: arbitroEscolhido.nome, funcao: arbitroEscolhido.funcao }
    setJogoEditando({ ...jogoEditando, arbitros: novaListaArbitros })
  }

  const salvarAlteracoes = async () => {
    if (!jogoEditando) return
    try {
      const jogoOriginal = partidas.find(p => p.id === jogoEditando.id)
      if (!jogoOriginal) return
      let trocasRealizadas = 0
      for (let i = 0; i < jogoOriginal.arbitros.length; i++) {
        const arbitroAntigo = jogoOriginal.arbitros[i]
        const arbitroNovo = jogoEditando.arbitros[i]
        if (arbitroAntigo.id !== arbitroNovo.id) {
          await salvarTrocaArbitro({
            jogoId: jogoEditando.id,
            arbitroAntigoId: arbitroAntigo.id,
            arbitroNovoId: arbitroNovo.id,
            funcao: arbitroAntigo.funcao
          })
          trocasRealizadas++
        }
      }
      if (trocasRealizadas > 0) {
        setIsModalOpen(false)
        setIsSuccessModalOpen(true)
      } else {
        setIsModalOpen(false)
      }
    } catch {
      showToast('error', 'Erro ao realizar a substituição.')
    }
  }

  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate()
  const primeiroDiaDaSemana = new Date(anoAtual, mesAtual, 1).getDay()
  const gerarDiasEmBranco = () => Array.from({ length: primeiroDiaDaSemana }, (_, i) => i)
  const gerarDiasDoMes = () => Array.from({ length: diasNoMes }, (_, i) => i + 1)

  return (
    <AdminLayout breadcrumbs={[]}>

      <h1 className="dashboard-greeting">Dashboard</h1>

      <div className="dashboard-card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Ações Rápidas</h2>
        <div className="dashboard-divider" />
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button className="quick-action-btn" onClick={() => navigate('/admin/avisos')}><AvisosIcon /> Avisos</button>
          <button className="quick-action-btn" onClick={() => navigate('/admin/arbitros')}><ArbitrosIcon /> Árbitros</button>
          <button className="quick-action-btn" onClick={() => navigate('/admin/disponibilidades')}><DisponibilidadeIcon /> Disponibilidades</button>
          <button className="quick-action-btn" onClick={() => navigate('/admin/escalas')}><EscalasIcon /> Escalas</button>
        </div>
      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card" style={{ padding: '1.25rem 1.5rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Próximas Partidas (Escalas Fechadas)</h2>
          <div className="dashboard-divider" />
          <div style={{ overflowX: 'auto' }}>
            <table className="matches-table">
              <thead>
                <tr>
                  <th>Data</th><th>Hora</th><th>Local / Categoria</th><th>Árbitros Escalados</th><th></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</td></tr>
                ) : partidas.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Nenhuma partida agendada.</td></tr>
                ) : (
                  partidas.map((partida) => (
                    <tr key={partida.id}>
                      <td style={{ fontWeight: 600 }}>{formatarDataBr(partida.data)}</td>
                      <td>{partida.hora}</td>
                      <td>
                        <div>{partida.local}</div>
                        <div style={{ fontSize: '0.75rem', color: '#ff6b23', fontWeight: 600 }}>{partida.campeonato}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {partida.arbitros.filter(a => a.funcao === 'QUADRA').map(a => (
                            <span key={`q-${a.id}`} className="badge-funcao badge-quadra">
                              {a.nome.split(' ').slice(0, 2).join(' ')}
                            </span>
                          ))}
                          {partida.arbitros.filter(a => a.funcao === 'MESA').map(a => (
                            <span key={`m-${a.id}`} className="badge-funcao badge-mesa">
                              {a.nome.split(' ').slice(0, 2).join(' ')}
                            </span>
                          ))}
                          {partida.arbitros.length === 0 && (
                            <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.85rem' }}>Sem árbitros</span>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="icon-button" onClick={() => abrirModalEdicao(partida)}><EditIcon /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="dashboard-card-actions">
            <button className="dashboard-button" onClick={() => navigate('/admin/escalas')}>Ver todas as escalas</button>
          </div>
        </div>

        <div className="dashboard-card timeline-card" style={{ padding: '1.25rem 1.5rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>Linha do Tempo das Operações</h2>
          <div className="dashboard-divider" />
          <div className="timeline-toolbar">
            <button className="timeline-nav" onClick={() => mesAtual === 0 ? (setMesAtual(11), setAnoAtual(a => a - 1)) : setMesAtual(m => m - 1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
            <div className="timeline-selects" style={{ fontWeight: 600 }}>{meses[mesAtual]} {anoAtual}</div>
            <button className="timeline-nav" onClick={() => mesAtual === 11 ? (setMesAtual(0), setAnoAtual(a => a + 1)) : setMesAtual(m => m + 1)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
          </div>
          <div className="timeline-grid">
            <div className="timeline-weekday">D</div><div className="timeline-weekday">S</div><div className="timeline-weekday">T</div><div className="timeline-weekday">Q</div><div className="timeline-weekday">Q</div><div className="timeline-weekday">S</div><div className="timeline-weekday">S</div>
            {gerarDiasEmBranco().map(i => <div key={`empty-${i}`} className="timeline-day timeline-day-empty"></div>)}
            {gerarDiasDoMes().map(dia => {
              const dataFormatada = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
              const evento = eventosCalendario.find(e => e.data === dataFormatada)
              let classe = 'timeline-day'
              if (evento?.status === 'coletando') classe += ' timeline-day-green'
              if (evento?.status === 'escala_enviada') classe += ' timeline-day-blue'
              return <div key={dia} className={classe}>{dia}</div>
            })}
          </div>
          <div className="timeline-footer">
            <div className="legend-item"><div className="legend-dot legend-dot-green"></div> Coletando</div>
            <div className="legend-item"><div className="legend-dot legend-dot-blue"></div> Escala Enviada</div>
          </div>
        </div>
      </div>

      {isModalOpen && jogoEditando && (
        <div className="modal-overlay">
          <div className="modal-content">
            <header className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: '#111', margin: 0 }}>
                <EditIcon /> Visualização e Edição de Árbitros - Partida
              </h3>
              <div className="modal-subtitle">
                {formatarDataBr(jogoEditando.data)} • {jogoEditando.hora} • {jogoEditando.local}
              </div>
            </header>

            <div className="modal-body-grid">

              <div className="modal-column">
                <h4 className="column-title">Árbitros de Mesa</h4>
                {jogoEditando.arbitros.map((arbitro, index) => {
                  if (arbitro.funcao !== 'MESA') return null
                  return (
                    <div key={`mesa-${index}`} className="form-group">
                      <label>Árbitro de Mesa Nº {index + 1}</label>
                      <select className="modal-select" value={arbitro.id} onChange={(e) => handleTrocaArbitro(index, Number(e.target.value))}>
                        <option value={arbitro.id}>{arbitro.nome}</option>
                        {opcoesDisponiveis.filter(op => op.funcao === 'MESA').map(op => (
                          <option key={op.id} value={op.id}>{op.nome}</option>
                        ))}
                      </select>
                    </div>
                  )
                })}
              </div>

              <div className="modal-column">
                <h4 className="column-title">Árbitros de Quadra</h4>
                {jogoEditando.arbitros.map((arbitro, index) => {
                  if (arbitro.funcao !== 'QUADRA') return null
                  return (
                    <div key={`quadra-${index}`} className="form-group">
                      <label>Árbitro de Quadra Nº {index + 1}</label>
                      <select className="modal-select" value={arbitro.id} onChange={(e) => handleTrocaArbitro(index, Number(e.target.value))}>
                        <option value={arbitro.id}>{arbitro.nome}</option>
                        {opcoesDisponiveis.filter(op => op.funcao === 'QUADRA').map(op => (
                          <option key={op.id} value={op.id}>{op.nome}</option>
                        ))}
                      </select>
                    </div>
                  )
                })}
              </div>

            </div>

            <footer className="modal-footer">
              <button className="btn-cancelar-outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancelar</button>
              <button className="btn-salvar" onClick={salvarAlteracoes} disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar Alterações'}</button>
            </footer>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <SuccessModal
          title="Partida Editada com Sucesso!"
          onClose={() => setIsSuccessModalOpen(false)}
        />
      )}

    </AdminLayout>
  )
}
