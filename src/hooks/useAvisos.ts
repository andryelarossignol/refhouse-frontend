import { useState, useEffect, useCallback } from 'react'
import { getAvisos, criarAviso, editarAviso, deletarAviso } from '../services/avisosService'
import type { Aviso, AvisoPayload } from '../types'

export type { Aviso } from '../types'

export function useAvisos() {
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAvisos()
      setAvisos(data)
    } catch (error) {
      console.error('Erro ao carregar avisos:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  async function criar(payload: AvisoPayload) {
    setIsSubmitting(true)
    try {
      await criarAviso(payload)
      await carregar()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function editar(id: number, payload: AvisoPayload) {
    setIsSubmitting(true)
    try {
      await editarAviso(id, payload)
      await carregar()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deletar(id: number) {
    setIsSubmitting(true)
    try {
      await deletarAviso(id)
      setAvisos(prev => prev.filter(a => a.id !== id))
    } finally {
      setIsSubmitting(false)
    }
  }

  return { avisos, loading, isSubmitting, carregar, criar, editar, deletar }
}
