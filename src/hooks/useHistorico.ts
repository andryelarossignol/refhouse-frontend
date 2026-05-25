import { useState, useEffect } from 'react'
import { getHistorico, getRevisao, exportarCSV } from '../services/escalasService'
import type { ResumoHistorico, DetalheJogo } from '../types'

export type { ResumoHistorico, DetalheJogo } from '../types'

export function useHistorico() {
  const [historico, setHistorico] = useState<ResumoHistorico[]>([])
  const [loading, setLoading] = useState(false)
  const [filtroMes, setFiltroMes] = useState('5')
  const [filtroAno, setFiltroAno] = useState('2026')
  const [detalhes, setDetalhes] = useState<DetalheJogo[]>([])
  const [loadingModal, setLoadingModal] = useState(false)

  useEffect(() => {
    async function carregar() {
      setLoading(true)
      try {
        const data = await getHistorico(filtroMes, filtroAno)
        setHistorico(data)
      } catch (error) {
        console.error('Erro ao carregar histórico', error)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [filtroMes, filtroAno])

  async function carregarDetalhes(coletaId: number) {
    setLoadingModal(true)
    try {
      const data = await getRevisao(String(coletaId))
      setDetalhes(data)
    } catch {
      throw new Error('Erro ao buscar detalhes da escala.')
    } finally {
      setLoadingModal(false)
    }
  }

  async function baixarCSV(coletaId: number, periodo: string) {
    const blob = await exportarCSV(coletaId)
    const bom = new Uint8Array([0xef, 0xbb, 0xbf])
    const blobComBom = new Blob([bom, blob], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blobComBom)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `escala_${periodo.replace(/ /g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  return { historico, loading, filtroMes, setFiltroMes, filtroAno, setFiltroAno, detalhes, loadingModal, carregarDetalhes, baixarCSV }
}
