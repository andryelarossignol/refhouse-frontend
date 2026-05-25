import api from './api'
import { garantirUtf8 } from '../utils/encoding'

export async function importarJogos(file: File) {
  const fileUtf8 = await garantirUtf8(file)
  const formData = new FormData()
  formData.append('file', fileUtf8)
  const { data } = await api.post('/jogos/importar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data as { totalInserido: number; inicio_jogos?: string; fim_jogos?: string }
}
