// ── Árbitros ─────────────────────────────────────────────────────────────

export interface Arbitro {
  id: number
  nome_completo: string
  email: string
  cpf: string
  telefone: string
  nivel: string
  tipo_atuacao: string
  data_nascimento: string
}

export interface ArbitroEditPayload {
  nome_completo: string
  telefone: string
  nivel: string
  tipo_atuacao: string
}

export interface ArbitroPayload {
  nome_completo: string
  email: string
  cpf: string
  telefone: string
  nivel: string
  tipo_atuacao: string
  data_nascimento: string
  senha?: string
}

export interface ArbitroPerfilPayload {
  nome_completo: string
  email: string
  telefone: string
  data_nascimento: string
}

// ── Perfis ────────────────────────────────────────────────────────────────

export interface ProfileData {
  fullName: string
  email: string
  birthDate: string
  phone: string
  cpf: string
}

export interface AdminPerfil {
  nome_completo: string
  email: string
  telefone: string
  cpf: string
  data_nascimento: string
  campeonato: { nome: string }
}

export interface AdminPerfilFormData {
  nome_completo: string
  email: string
  telefone: string
  cpf: string
  data_nascimento: string
}

// ── Dashboard Árbitro ─────────────────────────────────────────────────────

export interface EscalaArbitro {
  id: number
  data: string
  hora: string
  local: string
  categoria: string
  confronto: string
}

export interface DisponibilidadeStatus {
  coletaId: number
  inicio_jogos: string
  fim_jogos: string
  status: 'PENDENTE' | 'ENVIADA'
}

export interface EventoCalendarioArbitro {
  data: string
  status: 'escalado' | 'coleta'
}

export interface ArbitroDashboardData {
  arbitro: { nome: string }
  avisos?: Aviso[]
  proximas_escalas?: EscalaArbitro[]
  disponibilidade?: DisponibilidadeStatus
  calendario?: EventoCalendarioArbitro[]
}

// ── Avisos ────────────────────────────────────────────────────────────────

export interface Aviso {
  id: number
  titulo: string
  mensagem: string
  categoria: string
  data_validade: string
  criado_em: string
}

export interface AvisoPayload {
  titulo: string
  mensagem: string
  categoria: string
  data_validade: string
  notificar: boolean
}

// ── Coletas / Disponibilidade ─────────────────────────────────────────────

export interface ProgressoColeta {
  total_arbitros: number
  respostas_enviadas: number
  porcentagem: number
}

export interface PeriodoColeta {
  id: number
  inicio_jogos: string
  fim_jogos: string
  encerramento_em: string
  status: string
  progresso: ProgressoColeta
}

export interface ColetaPayload {
  inicio_coleta: string
  fim_coleta: string
  inicio_jogos: string
  fim_jogos: string
}

export interface DiaAgenda {
  data: string
  horarios: string[]
}

export interface PeriodoDisponibilidade {
  id: number
  inicio_jogos: string
  fim_jogos: string
}

// ── Escalas ───────────────────────────────────────────────────────────────

export interface Coleta {
  id: number
  inicio_jogos: string
  fim_jogos: string
  status: string
}

export interface Substituto {
  id: number
  nome: string
  nivel: string
  tipo: string
}

export interface ArbitroEscaladoRevisao {
  id: number
  nome_completo: string
  nivel: string
}

export interface JogoRevisao {
  jogoId: number
  data: string
  hora: string
  confronto: string
  categoria: string
  local?: string
  escalados: { quadra: ArbitroEscaladoRevisao[]; mesa: ArbitroEscaladoRevisao[] }
  opcoes_substituicao: Substituto[]
}

export interface TrocaArbitroPayload {
  jogoId: number
  arbitroAntigoId: number
  arbitroNovoId: number
  funcao: string
}

// ── Dashboard Admin ────────────────────────────────────────────────────────

export interface ArbitroPartida {
  id: number
  nome: string
  funcao: string
}

export interface Partida {
  id: number
  data: string
  hora: string
  local: string
  campeonato: string
  arbitros: ArbitroPartida[]
}

export interface EventoCalendario {
  data: string
  status: 'coletando' | 'proximas' | 'escala_enviada' | 'historico'
}

// ── Histórico ─────────────────────────────────────────────────────────────

export interface ResumoHistorico {
  id: number
  coletaId: number
  periodo: string
  qtdJogos: number
  qtdArbitros: number
  status: 'Agendado' | 'Finalizada'
}

export interface DetalheJogo {
  jogoId: number
  data: string
  hora: string
  local: string
  escalados: {
    quadra: { nome_completo: string }[]
    mesa: { nome_completo: string }[]
  }
}
