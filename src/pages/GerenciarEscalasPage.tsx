import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEscalas } from '../hooks/useEscalas'
import { useToast } from '../context/ToastContext'
import { AdminLayout } from '../components/layouts/AdminLayout'
import { SuccessModal } from '../components/common/SuccessModal'
import { ConfirmModal } from '../components/common/ConfirmModal'

const ChevronDownIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>

export function GerenciarEscalasPage() {
  const navigate = useNavigate()
  const { coletas, dadosRevisao, escalaGeradaId, loading, isSubmitting, carregarRevisao, gerar, trocar, publicar } = useEscalas()
  const { showToast } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedColetaId, setSelectedColetaId] = useState('')
  const [config, setConfig] = useState({ prioridade: 'Prioridade de Nível', maxJogos: 2 })
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [showConfirmColetaAberta, setShowConfirmColetaAberta] = useState(false)

  const formatarDataBr = (dataIso: string) => dataIso.split('-').reverse().join('/')

  const formatarSemana = (inicio: string, fim: string, status?: string) => {
    if (!inicio || !fim) return 'Semana Indefinida'
    const dataInicio = inicio.split('T')[0]
    const dataFim = fim.split('T')[0]
    const diaInicio = dataInicio.split('-')[2]
    const mesInicio = new Date(dataInicio + 'T00:00:00').toLocaleString('pt-BR', { month: 'short' })
    const diaFim = dataFim.split('-')[2]
    const mesFim = new Date(dataFim + 'T00:00:00').toLocaleString('pt-BR', { month: 'short' })
    const tag = status === 'ENCERRADA' ? '(Encerrada)' : '(Aberta)'
    return `Semana ${diaInicio} de ${mesInicio} a ${diaFim} de ${mesFim} ${tag}`
  }

  const irParaConfiguracao = () => {
    if (!selectedColetaId) { showToast('warning', 'Selecione uma coleta primeiro.'); return }
    const coletaEscolhida = coletas.find(c => c.id === Number(selectedColetaId))
    if (coletaEscolhida?.status === 'ABERTA') {
      setShowConfirmColetaAberta(true)
      return
    }
    setCurrentStep(2)
  }

  const handleGerarEscala = async () => {
    try {
      await gerar(selectedColetaId)
      setCurrentStep(3)
    } catch (error: any) {
      showToast('error', error.response?.data?.erro || 'Erro ao gerar escala. Verifique se ela já foi gerada.')
    }
  }

  const toggleDropdown = (id: string) => setActiveDropdown(activeDropdown === id ? null : id)

  const handleTrocarArbitro = async (jogoId: number, arbitroAntigoId: number, arbitroNovoId: number, funcao: string) => {
    if (!escalaGeradaId) return
    try {
      await trocar(escalaGeradaId, { jogoId, arbitroAntigoId, arbitroNovoId, funcao })
      setActiveDropdown(null)
      await carregarRevisao(selectedColetaId)
    } catch (error: any) {
      showToast('error', error.response?.data?.erro || 'Erro ao trocar árbitro.')
    }
  }

  const handlePublicar = async () => {
    if (!escalaGeradaId) return
    try {
      await publicar(escalaGeradaId)
      setIsPublishModalOpen(false)
      setIsSuccessModalOpen(true)
    } catch (error: any) {
      showToast('error', error.response?.data?.erro || 'Erro ao publicar escala.')
    }
  }

  const coletaSelecionadaObj = coletas.find(c => c.id === Number(selectedColetaId))

  return (
    <AdminLayout breadcrumbs={[{ label: 'Gerenciar Escalas' }]}>

      <div onClick={() => setActiveDropdown(null)}>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', margin: '0 0 1.5rem 0' }}>Gerenciar Escalas</h1>

        <div className="stepper-container">
          {[
            { id: 1, label: 'Seleção' },
            { id: 2, label: 'Configuração' },
            { id: 3, label: 'Revisão' },
            { id: 4, label: 'Publicação' },
          ].map((step, index) => (
            <div className="stepper-item" key={step.id}>
              <div className={`stepper-circle ${currentStep >= step.id ? 'active' : ''}`}>{step.id}</div>
              <span className={`stepper-label ${currentStep >= step.id ? 'active' : ''}`}>{step.label}</span>
              {index < 3 && <div className={`stepper-line ${currentStep > step.id ? 'active' : ''}`}></div>}
            </div>
          ))}
        </div>

        {currentStep === 1 && (
          <div className="dashboard-card step-card">
            <h2 className="step-title">Selecionar Coleta Base</h2>
            <hr className="step-divider" />

            {loading ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#6b7280' }}>Carregando coletas...</div>
            ) : coletas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '1rem' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Nenhuma coleta disponível</p>
                <p style={{ fontSize: '0.875rem', margin: 0 }}>Abra um período de coleta em Gerenciar Disponibilidades primeiro.</p>
              </div>
            ) : (
              <select className="modal-select" style={{ marginBottom: '1rem', width: '100%' }} value={selectedColetaId} onChange={e => setSelectedColetaId(e.target.value)}>
                <option value="">Selecione uma coleta...</option>
                {coletas.map(c => (
                  <option key={c.id} value={c.id}>{formatarSemana(c.inicio_jogos, c.fim_jogos, c.status)}</option>
                ))}
              </select>
            )}

            <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '2rem' }}>
              Selecione a coleta (preferencialmente já encerrada) cujas disponibilidades deseja usar como base para a escala.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-salvar" onClick={irParaConfiguracao}>Processar Coleta</button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-2-grid">
            <div className="dashboard-card step-card">
              <h2 className="step-title">Configurações da Escala</h2>
              <hr className="step-divider" />
              <div className="modal-grid-2">
                <div className="form-group">
                  <label>Prioridade de Nível</label>
                  <select className="modal-select" value={config.prioridade} onChange={e => setConfig({...config, prioridade: e.target.value})}>
                    <option value="Prioridade de Nível">Prioridade de Nível</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Máximo de Jogos p/ Árbitro</label>
                  <input type="number" className="modal-input" value={config.maxJogos} onChange={e => setConfig({...config, maxJogos: Number(e.target.value)})} />
                </div>
              </div>
            </div>

            <div className="dashboard-card step-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 className="step-title">Resumo dos Dados de Entrada</h2>
              <hr className="step-divider" />
              <div className="resumo-box">
                <div className="resumo-item">
                  <span className="resumo-label highlight">Semana Selecionada:</span>
                  <span className="resumo-value">
                    {coletaSelecionadaObj ? formatarSemana(coletaSelecionadaObj.inicio_jogos, coletaSelecionadaObj.fim_jogos) : 'Nenhuma coleta selecionada'}
                  </span>
                </div>
                <div className="resumo-item" style={{ marginTop: '0.5rem' }}>
                  <span className="resumo-label highlight">Status da Coleta:</span>
                  <span className="resumo-value" style={{ color: coletaSelecionadaObj?.status === 'ABERTA' ? '#ea580c' : '#16a34a' }}>
                    {coletaSelecionadaObj?.status || '-'}
                  </span>
                </div>
                <div className="resumo-item" style={{ marginTop: '0.5rem' }}>
                  <span className="resumo-label highlight">Árbitros Disponíveis:</span>
                  <span className="resumo-value">Sincronizado na geração</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '1rem' }}>
                <button className="btn-salvar" onClick={handleGerarEscala} disabled={isSubmitting}>
                  {isSubmitting ? 'Gerando...' : 'Gerar Escala'}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="dashboard-card step-card" style={{ padding: '2rem' }}>
            <h2 className="step-title">Revisão e Edição da Escala</h2>
            <hr className="step-divider" />

            <div className="table-responsive" style={{ overflow: 'visible' }}>
              <table className="matches-table">
                <thead>
                  <tr>
                    <th style={{ width: '100px' }}>Data</th>
                    <th style={{ width: '80px' }}>Hora</th>
                    <th>Local/Categoria</th>
                    <th>Confronto</th>
                    <th style={{ width: '200px' }}>Árbitro Quadra</th>
                    <th style={{ width: '200px' }}>Árbitro Mesa</th>
                  </tr>
                </thead>
                <tbody>
                  {dadosRevisao.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Nenhum dado gerado.</td></tr>
                  ) : (
                    dadosRevisao.map(jogo => (
                      <tr key={jogo.jogoId}>
                        <td style={{ verticalAlign: 'top', paddingTop: '1.5rem' }}>{formatarDataBr(jogo.data)}</td>
                        <td style={{ verticalAlign: 'top', paddingTop: '1.5rem' }}>{jogo.hora}</td>
                        <td style={{ verticalAlign: 'top', paddingTop: '1.5rem' }}>
                          <div style={{ fontWeight: 600, color: '#111' }}>{jogo.categoria}</div>
                          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{jogo.local || 'A definir'}</div>
                        </td>
                        <td style={{ verticalAlign: 'top', paddingTop: '1.5rem' }}>{jogo.confronto}</td>

                        <td style={{ verticalAlign: 'top', paddingTop: '1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {jogo.escalados.quadra.map(arbitro => {
                              const dropId = `${jogo.jogoId}-QUADRA-${arbitro.id}`
                              return (
                                <div key={arbitro.id} className="custom-select-wrapper" onClick={(e) => { e.stopPropagation(); toggleDropdown(dropId) }}>
                                  <div className={`custom-select-box ${activeDropdown === dropId ? 'open' : ''}`}>
                                    {arbitro.nome_completo.split(' ').slice(0, 2).join(' ')} <ChevronDownIcon />
                                  </div>
                                  {activeDropdown === dropId && (
                                    <div className="custom-dropdown-menu">
                                      {jogo.opcoes_substituicao.filter(sub => sub.id !== arbitro.id && sub.tipo.toUpperCase() !== 'MESA').length === 0 ? (
                                        <div className="dropdown-item empty">Nenhum substituto</div>
                                      ) : (
                                        jogo.opcoes_substituicao
                                          .filter(sub => sub.id !== arbitro.id && sub.tipo.toUpperCase() !== 'MESA')
                                          .map(sub => (
                                            <div key={sub.id} className="dropdown-item" onClick={() => handleTrocarArbitro(jogo.jogoId, arbitro.id, sub.id, 'QUADRA')}>
                                              {sub.nome.split(' ').slice(0, 2).join(' ')}
                                            </div>
                                          ))
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </td>

                        <td style={{ verticalAlign: 'top', paddingTop: '1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {jogo.escalados.mesa.map(arbitro => {
                              const dropId = `${jogo.jogoId}-MESA-${arbitro.id}`
                              return (
                                <div key={arbitro.id} className="custom-select-wrapper" onClick={(e) => { e.stopPropagation(); toggleDropdown(dropId) }}>
                                  <div className={`custom-select-box ${activeDropdown === dropId ? 'open' : ''}`}>
                                    {arbitro.nome_completo.split(' ').slice(0, 2).join(' ')} <ChevronDownIcon />
                                  </div>
                                  {activeDropdown === dropId && (
                                    <div className="custom-dropdown-menu">
                                      {jogo.opcoes_substituicao.filter(sub => sub.id !== arbitro.id && sub.tipo.toUpperCase() !== 'QUADRA').length === 0 ? (
                                        <div className="dropdown-item empty">Nenhum substituto</div>
                                      ) : (
                                        jogo.opcoes_substituicao
                                          .filter(sub => sub.id !== arbitro.id && sub.tipo.toUpperCase() !== 'QUADRA')
                                          .map(sub => (
                                            <div key={sub.id} className="dropdown-item" onClick={() => handleTrocarArbitro(jogo.jogoId, arbitro.id, sub.id, 'MESA')}>
                                              {sub.nome.split(' ').slice(0, 2).join(' ')}
                                            </div>
                                          ))
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                            {jogo.escalados.mesa.length === 0 && (
                              <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic', paddingLeft: '8px' }}>Nenhum escalado</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button className="btn-salvar" onClick={() => setIsPublishModalOpen(true)}>Finalizar Escala</button>
            </div>
          </div>
        )}

      </div>

      {showConfirmColetaAberta && (
        <ConfirmModal
          title="Coleta ainda está ABERTA"
          message="Árbitros ainda podem enviar respostas. Tem certeza que deseja prosseguir com a geração da escala agora?"
          confirmLabel="Sim, prosseguir"
          isDanger
          onConfirm={() => { setShowConfirmColetaAberta(false); setCurrentStep(2) }}
          onCancel={() => setShowConfirmColetaAberta(false)}
        />
      )}

      {isPublishModalOpen && (
        <ConfirmModal
          title="Confirmar Publicação"
          message={`A escala da ${coletaSelecionadaObj ? formatarSemana(coletaSelecionadaObj.inicio_jogos, coletaSelecionadaObj.fim_jogos) : ''} está pronta. Deseja publicar e notificar os árbitros escalados?`}
          confirmLabel={isSubmitting ? 'Publicando...' : 'Publicar'}
          isLoading={isSubmitting}
          onConfirm={handlePublicar}
          onCancel={() => setIsPublishModalOpen(false)}
        />
      )}

      {isSuccessModalOpen && (
        <SuccessModal
          title="Escala Publicada com Sucesso!"
          primaryLabel="Voltar ao Início"
          onClose={() => navigate('/admin/dashboard')}
        />
      )}

    </AdminLayout>
  )
}
