import api from './api'

export async function loginArbitro(cpf: string, senha: string) {
  const { data } = await api.post('/auth/arbitro/login', { cpf, senha })
  return data as { token: string; nome: string }
}

export async function loginAdmin(cpf: string, senha: string) {
  const { data } = await api.post('/auth/login', { cpf, senha })
  return data as { token: string; admin: Record<string, unknown> }
}

export async function esqueciSenha(email: string) {
  await api.post('/auth/esqueci-senha', { email })
}
