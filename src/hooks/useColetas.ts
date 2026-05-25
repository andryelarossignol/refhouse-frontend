import { useState, useEffect, useCallback } from 'react'
import { getAcompanhamento, abrirColeta, encerrarColeta } from '../services/coletasService'
import type { PeriodoColeta, ColetaPayload } from '../types'

export type { PeriodoColeta, ProgressoColeta } from '../types'

export function useColetas() {
  const [coletasAbertas, setColetasAbertas] = useState<PeriodoColeta[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAcompanhamento()
      setColetasAbertas(data)
    } catch (error) {
      console.error('Erro ao carregar coletas:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  async function abrir(payload: ColetaPayload) {
    setIsSubmitting(true)
    try {
      await abrirColeta(payload)
      await carregar()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function encerrar(id: number) {
    setIsSubmitting(true)
    try {
      await encerrarColeta(id)
      await carregar()
    } finally {
      setIsSubmitting(false)
    }
  }

  return { coletasAbertas, loading, isSubmitting, carregar, abrir, encerrar }
}
