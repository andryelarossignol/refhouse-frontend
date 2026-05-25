import { useState, useEffect } from 'react'
import { getDashboard } from '../services/arbitrosService'
import { getAgenda, enviarDisponibilidade } from '../services/disponibilidadeService'
import type { ArbitroDashboardData, DiaAgenda, PeriodoDisponibilidade } from '../types'

export function useDisponibilidade() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [layoutData, setLayoutData] = useState<ArbitroDashboardData | null>(null)
  const [periodo, setPeriodo] = useState<PeriodoDisponibilidade | null>(null)
  const [agenda, setAgenda] = useState<DiaAgenda[]>([])
  const [mensagemVazia, setMensagemVazia] = useState('')

  const user = JSON.parse(localStorage.getItem('@Refhouse:user') || '{}')
  const nomeUsuario = layoutData?.arbitro?.nome || user.nome || 'Árbitro'

  useEffect(() => {
    async function carregar() {
      try {
        const [dashRes, agendaRes] = await Promise.all([getDashboard(), getAgenda()])
        setLayoutData(dashRes)
        if (agendaRes.mensagem) {
          setMensagemVazia(agendaRes.mensagem)
        } else {
          setPeriodo(agendaRes.periodo)
          setAgenda(agendaRes.agenda)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  async function enviar(selecionados: Record<string, string[]>) {
    if (!periodo) return
    const horariosEnviados = Object.keys(selecionados)
      .map(d => ({ data: d, horarios: selecionados[d] }))
      .filter(item => item.horarios.length > 0)
    setSubmitting(true)
    try {
      await enviarDisponibilidade(periodo.id, horariosEnviados)
    } finally {
      setSubmitting(false)
    }
  }

  return { loading, submitting, layoutData, periodo, agenda, mensagemVazia, nomeUsuario, enviar }
}
