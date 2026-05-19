import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { ArbitroLayout } from '../components/layouts/ArbitroLayout'

// ==========================================
// ÍCONES
// ==========================================
function PinIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.1" fill="currentColor" /></svg> }
function WhistleIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12.5a4.5 4.5 0 1 0 9 0c0-1.4-.5-2.7-1.3-3.6L17 6.5h-4.1L10 9H7.9A2.9 2.9 0 0 0 5 11.9v.6Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><circle cx="9.2" cy="12.5" r="1.4" fill="currentColor" /></svg> }

// Ícone do estado vazio (trazido para cá)
function LockedCalendarIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem', display: 'block' }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><rect x="8" y="14" width="8" height="5" rx="1"></rect><path d="M10 14v-2a2 2 0 1 1 4 0v2"></path>
    </svg>
  )
}

function MyScalesList({ escalas }: { escalas: any[] }) {
  const formatarSemanaAtual = () => {
    if (!escalas || escalas.length === 0) return '';
    const dataMaisAntiga = new Date(escalas[0].data);
    const dataMaisNova = new Date(escalas[escalas.length - 1].data);
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    if (dataMaisAntiga.getMonth() === dataMaisNova.getMonth()) {
      return `Semana ${dataMaisAntiga.getUTCDate()} a ${dataMaisNova.getUTCDate()} de ${meses[dataMaisAntiga.getMonth()]}`;
    }
    return `Semana ${dataMaisAntiga.getUTCDate()}/${meses[dataMaisAntiga.getMonth()]} a ${dataMaisNova.getUTCDate()}/${meses[dataMaisNova.getMonth()]}`;
  }

  const formatarDataCard = (dataIso: string) => {
    const dataObj = new Date(dataIso);
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return { data: `${String(dataObj.getUTCDate()).padStart(2, '0')}/${String(dataObj.getUTCMonth() + 1).padStart(2, '0')}`, diaSemana: diasSemana[dataObj.getDay()] };
  }

  return (
    <section className="my-scales-page">
      <div className="my-scales-copy">
        <h1>Minhas Escalas<span> {formatarSemanaAtual()}</span></h1>
        <p>Acompanhe seus jogos escalados e organize-se conforme seus compromissos como árbitro.</p>
      </div>

      <div className="my-scales-list">
        {escalas.map((scale) => {
          const { data, diaSemana } = formatarDataCard(scale.data);
          const isEncerrado = new Date(scale.data).getTime() < new Date().getTime();
          const status = isEncerrado ? 'Encerrado' : 'Agendado';

          return (
            <article key={scale.id} className="my-scales-card">
              <div className="my-scales-date"><strong>{data} - {diaSemana}</strong></div>
              <div className="my-scales-details">
                <div className="my-scales-match">
                  <strong>{scale.hora}</strong><p>{scale.categoria}</p><p>{scale.confronto}</p>
                </div>
                <div className="my-scales-meta">
                  <p><PinIcon /><span>{scale.local}</span></p>
                  <p><WhistleIcon /><span>Árbitro Oficial</span></p>
                </div>
                <div className="my-scales-status">
                  <span className={`scale-status-pill ${status === 'Agendado' ? 'scale-status-pill-green' : 'scale-status-pill-gray'}`}>{status}</span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function MyScalesLocked({ onBackHome }: { onBackHome: () => void }) {
  return (
    <section className="my-scales-page">
      <div className="my-scales-copy my-scales-copy-empty">
        <h1>Minhas Escalas</h1>
        <p>Aguarde. A escala de jogos desta semana ainda não foi liberada pelo administrador ou você não foi escalado.</p>
      </div>
      <section className="availability-empty-state my-scales-empty-state">
        <LockedCalendarIllustration />
        <h2>Nenhuma escala disponível</h2>
        <button type="button" className="dashboard-button availability-empty-button" onClick={onBackHome}>Voltar a tela de home</button>
      </section>
    </section>
  )
}

export function MyScalesPage() {
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('@Refhouse:user') || '{}')
  const nomeUsuario = data?.arbitro?.nome || user.nome || 'Árbitro'

  useEffect(() => {
    async function fetchScales() {
      try {
        const response = await api.get('/arbitros/dashboard') 
        setData(response.data)
      } catch (error) {
        console.error("Erro ao carregar escalas:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchScales()
  }, [])

  if (loading) return <ArbitroLayout nomeUsuario={nomeUsuario}><div style={{ padding: '2rem', textAlign: 'center' }}>Carregando suas escalas...</div></ArbitroLayout>

  const hasScales = data?.proximas_escalas && data.proximas_escalas.length > 0;

  return (
    <ArbitroLayout nomeUsuario={nomeUsuario} avisos={data?.avisos} breadcrumbs={[{ label: 'Minhas Escalas' }]}>
      {hasScales ? <MyScalesList escalas={data.proximas_escalas} /> : <MyScalesLocked onBackHome={() => navigate('/home')} />}
    </ArbitroLayout>
  )
}