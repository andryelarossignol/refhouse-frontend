import api from './api'
import type { ColetaPayload } from '../types'

export async function getAcompanhamento() {
  const { data } = await api.get('/coletas/acompanhar')
  return data
}

export async function abrirColeta(payload: ColetaPayload) {
  await api.post('/coletas/abrir', payload)
}

export async function encerrarColeta(id: number) {
  await api.put(`/coletas/${id}/encerrar`)
}
