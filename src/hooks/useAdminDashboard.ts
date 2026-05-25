import { useState, useEffect, useCallback } from 'react'
import { getDashboardAdmin } from '../services/adminService'
import { getOpcoesSubstituicao, trocarArbitroAdmin } from '../services/escalasService'
import type { Partida, EventoCalendario, TrocaArbitroPayload } from '../types'

export type { Partida, EventoCalendario } from '../types'

export function useAdminDashboard() {
  const [partidas, setPartidas] = useState<Partida[]>([])
  const [eventosCalendario, setEventosCalendario] = useState<EventoCalendario[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mesAtual, setMesAtual] = useState(new Date().getMonth())
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [opcoesDisponiveis, setOpcoesDisponiveis] = useState<{ id: number; nome: string; funcao: string }[]>([])

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getDashboardAdmin(mesAtual + 1, anoAtual)
      setPartidas(data.partidas || [])
      setEventosCalendario(data.calendario || [])
    } catch (error) {
      console.error('Erro ao carregar dashboard admin:', error)
    } finally {
      setLoading(false)
    }
  }, [mesAtual, anoAtual])

  useEffect(() => { carregar() }, [carregar])

  async function carregarOpcoesSubstituicao(jogoId: number) {
    const data = await getOpcoesSubstituicao(jogoId)
    setOpcoesDisponiveis(data.disponiveis)
    return data.disponiveis
  }

  async function salvarTrocaArbitro(payload: TrocaArbitroPayload) {
    setIsSubmitting(true)
    try {
      await trocarArbitroAdmin(payload)
      await carregar()
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    partidas, eventosCalendario, loading, isSubmitting,
    mesAtual, setMesAtual, anoAtual, setAnoAtual,
    opcoesDisponiveis, carregarOpcoesSubstituicao, salvarTrocaArbitro
  }
}
