import { useState, useEffect } from 'react'
import { getMeuPerfil, atualizarMeuPerfil, alterarSenhaArbitro } from '../services/arbitrosService'
import type { ProfileData } from '../types'

export type { ProfileData } from '../types'

const emptyProfile: ProfileData = { fullName: '', email: '', birthDate: '', phone: '', cpf: '' }

export function useArbitroPerfil() {
  const [profile, setProfile] = useState<ProfileData>(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function carregar() {
      try {
        const p = await getMeuPerfil()
        let dataFormatada = ''
        if (p.data_nascimento) {
          const d = new Date(p.data_nascimento)
          dataFormatada = `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`
        }
        setProfile({ fullName: p.nome_completo, email: p.email, cpf: p.cpf, phone: p.telefone, birthDate: dataFormatada })
      } catch (error) {
        console.error('Erro ao buscar perfil', error)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  async function salvarPerfil(draft: ProfileData) {
    setIsSubmitting(true)
    try {
      await atualizarMeuPerfil({ nome_completo: draft.fullName, telefone: draft.phone, email: draft.email, data_nascimento: draft.birthDate })
      setProfile(draft)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function mudarSenha(senhaAtual: string, novaSenha: string) {
    setIsSubmitting(true)
    try {
      await alterarSenhaArbitro({ senhaAtual, novaSenha })
    } finally {
      setIsSubmitting(false)
    }
  }

  return { profile, loading, isSubmitting, salvarPerfil, mudarSenha }
}
