import { useArbitroDashboard } from '../hooks/useArbitroDashboard'
import { AvailabilityCard, TimelineCard, UpcomingScalesCard } from '../components/home/HomeCards'
import { ArbitroLayout } from '../components/layouts/ArbitroLayout'

export function HomePage() {
  const { data, loading, nomeUsuario } = useArbitroDashboard()

  if (loading) {
    return (
      <ArbitroLayout nomeUsuario={nomeUsuario}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando seu painel...</div>
      </ArbitroLayout>
    )
  }

  return (
    <ArbitroLayout avisos={data?.avisos} nomeUsuario={nomeUsuario} breadcrumbs={[]}>
      <h1 className="dashboard-greeting">Olá, {nomeUsuario}!</h1>

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <UpcomingScalesCard escalas={data?.proximas_escalas} />
          <AvailabilityCard disponibilidade={data?.disponibilidade} />
        </div>
        <TimelineCard eventos={data?.calendario} />
      </div>
    </ArbitroLayout>
  )
}
