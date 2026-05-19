import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { ArbitroLayout } from '../components/layouts/ArbitroLayout'

const SuccessIcon = () => (
  <svg viewBox="0 0 24 24" fill="#22c55e" width="64" height="64" style={{ margin: '0 auto 1rem', display: 'block' }}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
)

interface DiaAgenda { data: string; horarios: string[]; }
interface Periodo { id: number; inicio_jogos: string; fim_jogos: string; }

export function AvailabilityPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [mensagemVazia, setMensagemVazia] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const [layoutData, setLayoutData] = useState<any>(null)
  const [periodo, setPeriodo] = useState<Periodo | null>(null)
  const [agenda, setAgenda] = useState<DiaAgenda[]>([])
  const [selecionados, setSelecionados] = useState<Record<string, string[]>>({})

  const user = JSON.parse(localStorage.getItem('@Refhouse:user') || '{}')
  const nomeUsuario = layoutData?.arbitro?.nome || user.nome || 'Árbitro'

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true)
        const [dashRes, agendaRes] = await Promise.all([api.get('/arbitros/dashboard'), api.get('/disponibilidade/agenda')])
        setLayoutData(dashRes.data)

        if (agendaRes.data.mensagem) {
          setMensagemVazia(agendaRes.data.mensagem)
        } else {
          setPeriodo(agendaRes.data.periodo)
          setAgenda(agendaRes.data.agenda)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  const formatarDataCard = (dataIso: string) => {
    const dataObj = new Date(dataIso + 'T00:00:00') 
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    return `${diasSemana[dataObj.getDay()]} - ${String(dataObj.getDate()).padStart(2, '0')}/${String(dataObj.getMonth() + 1).padStart(2, '0')}`
  }

  const formatarSemanaTitulo = () => {
    if (!periodo) return '';
    const inicio = new Date(periodo.inicio_jogos).toLocaleDateString('pt-BR', {timeZone: 'UTC'})
    const fim = new Date(periodo.fim_jogos).toLocaleDateString('pt-BR', {timeZone: 'UTC'})
    return `Semana ${inicio.slice(0,5)} a ${fim.slice(0,5)}`
  }

  const handleToggleHorario = (data: string, hora: string) => {
    setSelecionados(prev => {
      const horariosDoDia = prev[data] || []
      if (horariosDoDia.includes(hora)) return { ...prev, [data]: horariosDoDia.filter(h => h !== hora) }
      return { ...prev, [data]: [...horariosDoDia, hora] }
    })
  }

  const handleEnviar = async () => {
    if (!periodo) return;
    const horariosEnviados = Object.keys(selecionados).map(d => ({ data: d, horarios: selecionados[d] })).filter(item => item.horarios.length > 0) 
    if (horariosEnviados.length === 0 && !window.confirm("Deseja enviar sua disponibilidade em branco?")) return;

    try {
      setSubmitting(true)
      await api.post('/disponibilidade/enviar', { periodoColetaId: periodo.id, horariosDisponiveis: horariosEnviados })
      setShowSuccessModal(true)
    } catch (error: any) {
      alert(error.response?.data?.erro || "Erro ao salvar disponibilidade.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <ArbitroLayout nomeUsuario={nomeUsuario}><div style={{ padding: '2rem', textAlign: 'center' }}>Buscando agenda...</div></ArbitroLayout>

  return (
    <ArbitroLayout nomeUsuario={nomeUsuario} avisos={layoutData?.avisos} breadcrumbs={[{ label: 'Disponibilidade' }]}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: '#111', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            Disponibilidade: <span style={{ fontSize: '1.2rem', color: '#6b7280', fontWeight: 500 }}>{periodo ? formatarSemanaTitulo() : ''}</span>
          </h1>
          <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>Informe sua disponibilidade semanal para atuar como árbitro.</p>
        </div>

        <div className="dashboard-card" style={{ padding: '2rem' }}>
          {mensagemVazia ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#6b7280' }}><h2>Nenhuma coleta ativa</h2><p>{mensagemVazia}</p></div>
          ) : (
            <>
              <h2 style={{ fontSize: '1.1rem', color: '#111', marginBottom: '0.5rem' }}>Disponibilidade da Semana</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {agenda.map(dia => (
                  <div key={dia.data} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.2rem', backgroundColor: '#fff' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#111' }}>{formatarDataCard(dia.data)}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                      {dia.horarios.map(hora => {
                        const estaMarcado = selecionados[dia.data]?.includes(hora) || false
                        return (
                          <label key={hora} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
                            <input type="checkbox" checked={estaMarcado} onChange={() => handleToggleHorario(dia.data, hora)} style={{ width: '16px', height: '16px', accentColor: '#ea580c', cursor: 'pointer' }} />
                            {hora}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <button className="btn-salvar" onClick={handleEnviar} disabled={submitting} style={{ padding: '0.8rem 2rem', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {submitting ? 'Enviando...' : 'Enviar Disponibilidade'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showSuccessModal && (
        <div className="profile-modal-backdrop" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="profile-success-modal" style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
            <SuccessIcon />
            <h2 style={{ margin: '1rem 0', color: '#111', fontSize: '1.5rem' }}>Disponibilidade Enviada!</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>A sua agenda foi recebida pelo administrador e você poderá ser escalado.</p>
            <button className="dashboard-button" onClick={() => { setShowSuccessModal(false); navigate('/home') }} style={{ width: '100%', padding: '0.8rem', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Voltar ao Início</button>
          </div>
        </div>
      )}
    </ArbitroLayout>
  )
}