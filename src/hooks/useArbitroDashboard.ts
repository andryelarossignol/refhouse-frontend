import { useState, useEffect } from 'react'
import { getDashboard } from '../services/arbitrosService'
import type { ArbitroDashboardData } from '../types'

export function useArbitroDashboard() {
  const [data, setData] = useState<ArbitroDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const user = JSON.parse(localStorage.getItem('@Refhouse:user') || '{}')
  const nomeUsuario = data?.arbitro?.nome || user.nome || 'Árbitro'

  useEffect(() => {
    async function carregar() {
      try {
        const res = await getDashboard()
        setData(res)
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  return { data, loading, nomeUsuario }
}
