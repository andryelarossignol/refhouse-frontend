import api from './api'
import type { AvisoPayload } from '../types'

export async function getAvisos() {
  const { data } = await api.get('/avisos')
  return data
}

export async function criarAviso(payload: AvisoPayload) {
  await api.post('/avisos', payload)
}

export async function editarAviso(id: number, payload: AvisoPayload) {
  await api.put(`/avisos/${id}`, payload)
}

export async function deletarAviso(id: number) {
  await api.delete(`/avisos/${id}`)
}
