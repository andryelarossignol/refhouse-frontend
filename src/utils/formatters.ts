export function formatarTelefone(tel: string): string {
  if (!tel) return ''
  const n = tel.replace(/\D/g, '')
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7, 11)}`
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6, 10)}`
  return tel
}

export function formatarCPF(cpf: string): string {
  if (!cpf) return ''
  const n = cpf.replace(/\D/g, '')
  if (n.length === 11) return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  return cpf
}

export function formatarDataBr(dataIso: string): string {
  if (!dataIso) return ''
  return dataIso.split('T')[0].split('-').reverse().join('/')
}

export function extrairDataInput(dataIso: string): string {
  if (!dataIso) return ''
  return dataIso.split('T')[0]
}

export function formatarDataHoraBr(dataIso: string, hora?: string): string {
  if (!dataIso) return ''
  const dataParte = dataIso.split('T')[0].split('-').reverse().join('/')
  if (!hora) return dataParte
  return `${dataParte} às ${hora}`
}
