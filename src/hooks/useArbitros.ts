import { useState, useEffect, useCallback } from 'react'
import { getArbitros, cadastrarArbitro, editarArbitro, deletarArbitro } from '../services/arbitrosService'
import type { Arbitro, ArbitroPayload, ArbitroEditPayload } from '../types'

export type { Arbitro } from '../types'

export function useArbitros() {
  const [arbitros, setArbitros] = useState<Arbitro[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getArbitros()
      setArbitros(data)
    } catch (error) {
      console.error('Erro ao carregar árbitros:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  async function cadastrar(payload: ArbitroPayload) {
    setIsSubmitting(true)
    try {
      await cadastrarArbitro(payload)
      await carregar()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function editar(id: number, payload: ArbitroEditPayload) {
    setIsSubmitting(true)
    try {
      await editarArbitro(id, payload)
      await carregar()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deletar(id: number) {
    setIsSubmitting(true)
    try {
      await deletarArbitro(id)
      setArbitros(prev => prev.filter(a => a.id !== id))
    } finally {
      setIsSubmitting(false)
    }
  }

  return { arbitros, loading, isSubmitting, carregar, cadastrar, editar, deletar }
}
