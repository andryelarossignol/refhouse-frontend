import api from './api'
import type { AdminPerfilFormData } from '../types'

export async function getDashboardAdmin(mes: number, ano: number) {
  const { data } = await api.get(`/admin/dashboard?mes=${mes}&ano=${ano}`)
  return data
}

export async function getAdminPerfil() {
  const { data } = await api.get('/admin/me')
  return data
}

export async function atualizarAdminPerfil(payload: AdminPerfilFormData) {
  await api.put('/admin/me', payload)
}

export async function alterarSenhaAdmin(payload: { senhaAtual: string; novaSenha: string; confirmarNovaSenha: string }) {
  await api.put('/admin/me/senha', payload)
}
