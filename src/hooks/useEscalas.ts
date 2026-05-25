import { useState, useEffect, useCallback } from 'react'
import { getAcompanhamento } from '../services/coletasService'
import { gerarEscala, getRevisao, trocarArbitro, publicarEscala } from '../services/escalasService'
import type { Coleta, JogoRevisao, TrocaArbitroPayload } from '../types'

export type { Coleta, Substituto, ArbitroEscaladoRevisao, JogoRevisao } from '../types'

export function useEscalas() {
  const [coletas, setColetas] = useState<Coleta[]>([])
  const [dadosRevisao, setDadosRevisao] = useState<JogoRevisao[]>([])
  const [escalaGeradaId, setEscalaGeradaId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function carregarColetas() {
      setLoading(true)
      try {
        const data = await getAcompanhamento()
        setColetas(data.filter((c: Coleta) => c.status === 'ABERTA' || c.status === 'ENCERRADA'))
      } catch (error) {
        console.error('Erro ao carregar coletas:', error)
      } finally {
        setLoading(false)
      }
    }
    carregarColetas()
  }, [])

  const carregarRevisao = useCallback(async (coletaId: string) => {
    const data = await getRevisao(coletaId)
    setDadosRevisao(data)
  }, [])

  async function gerar(coletaId: string) {
    setIsSubmitting(true)
    try {
      const res = await gerarEscala(coletaId)
      setEscalaGeradaId(res.escalaId)
      await carregarRevisao(coletaId)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function trocar(escalaId: number, payload: TrocaArbitroPayload) {
    await trocarArbitro(escalaId, payload)
  }

  async function publicar(escalaId: number) {
    setIsSubmitting(true)
    try {
      await publicarEscala(escalaId)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { coletas, dadosRevisao, escalaGeradaId, loading, isSubmitting, carregarRevisao, gerar, trocar, publicar }
}
