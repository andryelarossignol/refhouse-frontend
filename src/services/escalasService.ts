import api from './api'
import type { TrocaArbitroPayload } from '../types'

export async function gerarEscala(coletaId: string) {
  const { data } = await api.post(`/escalas/gerar/${coletaId}`)
  return data as { escalaId: number }
}

export async function getRevisao(coletaId: string) {
  const { data } = await api.get(`/escalas/revisao/${coletaId}`)
  return data
}

export async function trocarArbitro(escalaId: number, payload: TrocaArbitroPayload) {
  await api.put(`/escalas/${escalaId}/trocar-arbitro`, payload)
}

export async function publicarEscala(escalaId: number) {
  await api.patch(`/escalas/${escalaId}/publicar`)
}

export async function getOpcoesSubstituicao(jogoId: number) {
  const { data } = await api.get(`/escalas/opcoes-substituicao/${jogoId}`)
  return data as { disponiveis: { id: number; nome: string; funcao: string }[] }
}

export async function trocarArbitroAdmin(payload: TrocaArbitroPayload) {
  await api.put('/escalas/1/trocar-arbitro', payload)
}

export async function getHistorico(mes: string, ano: string) {
  const { data } = await api.get(`/escalas/historico?mes=${mes}&ano=${ano}`)
  return data
}

export async function exportarCSV(coletaId: number) {
  const { data } = await api.get(`/escalas/exportar/${coletaId}`, { responseType: 'blob' })
  return data as Blob
}
