import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api' 
import { AvailabilityCard, TimelineCard, UpcomingScalesCard } from '../components/HomeCards' // Caminho novo!
import { ArbitroLayout } from '../components/layouts/ArbitroLayout' // Layout novo!

export function HomePage() {
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('@Refhouse:user') || '{}')
  const nomeUsuario = data?.arbitro?.nome || user.nome || 'Árbitro'

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await api.get('/arbitros/dashboard') 
        setData(response.data)
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

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