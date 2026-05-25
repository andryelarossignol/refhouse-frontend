import api from './api'
import type { ArbitroPayload, ArbitroEditPayload, ArbitroPerfilPayload } from '../types'

export async function getDashboard() {
  const { data } = await api.get('/arbitros/dashboard')
  return data
}

export async function getMeuPerfil() {
  const { data } = await api.get('/arbitros/meu-perfil')
  return data
}

export async function atualizarMeuPerfil(payload: ArbitroPerfilPayload) {
  await api.put('/arbitros/meu-perfil', payload)
}

export async function alterarSenhaArbitro(payload: { senhaAtual: string; novaSenha: string }) {
  await api.put('/arbitros/meu-perfil/senha', payload)
}

export async function getArbitros() {
  const { data } = await api.get('/arbitros')
  return data
}

export async function cadastrarArbitro(payload: ArbitroPayload) {
  const { data } = await api.post('/arbitros/cadastrar', payload)
  return data
}

export async function editarArbitro(id: number, payload: ArbitroEditPayload) {
  await api.put(`/arbitros/${id}`, payload)
}

export async function deletarArbitro(id: number) {
  await api.delete(`/arbitros/${id}`)
}
