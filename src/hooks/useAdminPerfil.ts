import { useState, useEffect, useCallback } from 'react'
import { getAdminPerfil, atualizarAdminPerfil, alterarSenhaAdmin } from '../services/adminService'
import type { AdminPerfil, AdminPerfilFormData } from '../types'

export type { AdminPerfil } from '../types'

const emptyPerfil: AdminPerfil = {
  nome_completo: '', email: '', telefone: '', cpf: '', data_nascimento: '', campeonato: { nome: '' }
}

export function useAdminPerfil() {
  const [perfil, setPerfil] = useState<AdminPerfil>(emptyPerfil)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const carregar = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getAdminPerfil()
      const dados = { ...res, campeonato: res.campeonato || { nome: 'Nenhum campeonato vinculado' } }
      setPerfil(dados)
      const userStorage = JSON.parse(localStorage.getItem('@Refhouse:user') || '{}')
      localStorage.setItem('@Refhouse:user', JSON.stringify({ ...userStorage, nome_completo: res.nome_completo }))
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  async function salvarEdicao(formData: AdminPerfilFormData) {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const payload = { ...formData, cpf: formData.cpf.replace(/\D/g, ''), telefone: formData.telefone.replace(/\D/g, '') }
      await atualizarAdminPerfil(payload)
      await carregar()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function alterarSenha(payload: { senhaAtual: string; novaSenha: string; confirmarNovaSenha: string }) {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await alterarSenhaAdmin(payload)
    } finally {
      setIsSubmitting(false)
    }
  }

  return { perfil, loading, isSubmitting, salvarEdicao, alterarSenha }
}
