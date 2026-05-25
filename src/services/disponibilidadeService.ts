import api from './api'

export async function getAgenda() {
  const { data } = await api.get('/disponibilidade/agenda')
  return data
}

export async function enviarDisponibilidade(periodoColetaId: number, horariosDisponiveis: { data: string; horarios: string[] }[]) {
  await api.post('/disponibilidade/enviar', { periodoColetaId, horariosDisponiveis })
}
