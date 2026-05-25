Você é um Engenheiro de Software Sênior especialista em React, TypeScript e Arquitetura de Front-end trabalhando no projeto **RefHouse**.

---

## Visão Geral do Projeto

Painel de gestão para campeonatos esportivos, dividido em duas áreas:
- **Admin** — gestão de escalas, árbitros, coletas de disponibilidade, avisos e histórico
- **Árbitro** — visualização de escalas, envio de disponibilidade, perfil

---

## Stack

React 19 + TypeScript (strict) + Vite 8, React Router DOM v7, Axios com interceptor JWT.

---

## Autenticação

- Token: `localStorage['@Refhouse:token']`
- Usuário: `localStorage['@Refhouse:user']` (JSON com `nome`, `role`)
- Dois roles: `admin` e `arbitro`
- Rotas protegidas via `PrivateRoute` em `App.tsx`

---

## Layouts

- `AdminLayout` — sidebar + topbar para rotas `/admin/*`
- `ArbitroLayout` — sidebar + topbar para rotas `/home`, `/disponibilidade`, etc.

---

## Estrutura de Pastas

```
src/
  components/
    auth/       BrandLogo, AuthShell, AdminAuthShell, AuthCard
    common/     SuccessIcon, SuccessModal, ConfirmModal, PageHeader, SearchBar
    home/       HomeCards (UpcomingScalesCard, AvailabilityCard, TimelineCard)
    layouts/    AdminLayout, ArbitroLayout
  context/
    ToastContext.tsx   — ToastProvider + useToast() hook
  hooks/         Custom hooks por domínio
  pages/         Páginas (UI + chama hooks)
  services/      api.ts (axios client) + módulos por domínio
  styles/        Módulos CSS
  types/
    index.ts     — TODAS as interfaces TypeScript centralizadas
  utils/
    formatters.ts
```

---

## Sistema de Tipagem (`src/types/index.ts`)

Todas as interfaces estão centralizadas aqui. Hooks re-exportam os tipos relevantes para compatibilidade de imports existentes (`export type { X } from '../types'`).

### Árbitros
| Tipo | Uso |
|------|-----|
| `Arbitro` | Entidade completa retornada pela API |
| `ArbitroPayload` | Payload para **criar** árbitro (todos os campos obrigatórios) |
| `ArbitroEditPayload` | Payload para **editar** árbitro — apenas `nome_completo, telefone, nivel, tipo_atuacao` |
| `ArbitroPerfilPayload` | Payload para árbitro atualizar o próprio perfil |

### Perfil Admin
| Tipo | Uso |
|------|-----|
| `AdminPerfil` | Dados do perfil retornados pela API |
| `AdminPerfilFormData` | Campos do formulário de edição |
| `ProfileData` | Perfil do árbitro no frontend (`fullName, email, birthDate, phone, cpf`) |

### Avisos
| Tipo | Uso |
|------|-----|
| `Aviso` | Entidade completa (`id, titulo, mensagem, categoria, data_validade, criado_em`) |
| `AvisoPayload` | Payload para criar/editar |

### Coletas / Disponibilidade
| Tipo | Uso |
|------|-----|
| `PeriodoColeta` | Coleta listada no admin com progresso |
| `ProgressoColeta` | Nested: `total_arbitros, respostas_enviadas, porcentagem` |
| `ColetaPayload` | Payload para abrir coleta |
| `Coleta` | Coleta simplificada usada em `useEscalas` |
| `DiaAgenda` | `{ data, horarios[] }` para tela de disponibilidade |
| `DisponibilidadeStatus` | Status da coleta do ponto de vista do árbitro |

### Escalas
| Tipo | Uso |
|------|-----|
| `JogoRevisao` | Jogo na etapa de revisão da escala |
| `ArbitroEscaladoRevisao` | Árbitro dentro de `JogoRevisao`: `{ id, nome_completo, nivel }` |
| `Substituto` | Opção de substituição: `{ id, nome, nivel, tipo }` |
| `TrocaArbitroPayload` | `{ jogoId, arbitroAntigoId, arbitroNovoId, funcao }` |
| `EscalaArbitro` | Escala do ponto de vista do árbitro logado |

### Dashboard Admin / Partidas
| Tipo | Uso |
|------|-----|
| `Partida` | Partida no dashboard admin |
| `ArbitroPartida` | Árbitro dentro de `Partida`: `{ id, nome, funcao }` — distinto de `ArbitroEscaladoRevisao` |
| `EventoCalendario` | `{ data, status: 'coletando' | 'escala_enviada' | ... }` |

### Histórico
| Tipo | Uso |
|------|-----|
| `ResumoHistorico` | Linha da tabela de histórico |
| `DetalheJogo` | Detalhe de jogo no modal de histórico |

### Dashboard Árbitro
| Tipo | Uso |
|------|-----|
| `ArbitroDashboardData` | Dados completos do dashboard (`arbitro, avisos, proximas_escalas, disponibilidade, calendario`) |

---

## Sistema de Toast (`src/context/ToastContext.tsx`)

```tsx
// No App.tsx, envolve todas as rotas:
<ToastProvider>
  <Routes>...</Routes>
</ToastProvider>

// Em qualquer componente:
const { showToast } = useToast()
showToast('success' | 'error' | 'warning', 'mensagem')
```

- Posição: canto superior direito, `position: fixed`
- Auto-dismiss: 5000 ms, com botão de fechar manual
- **Nunca usar `alert()`** — sempre substituir por `showToast`

---

## Padrão de Separação Hooks / Páginas

| Responsabilidade | Onde fica |
|-----------------|-----------|
| Fetch de dados, estado da API, `loading`, `isSubmitting` | Hook |
| Estado de modal (open/close) | Página |
| `formData`, item selecionado p/ edição | Página |
| Handlers de UI (onChange, onClick) | Página |
| Chamar `showToast` nos catch | Página |

---

## Padrão de Feedback Visual

- **`loading`**: exibido enquanto dados iniciais carregam
- **`isSubmitting`**: botões ficam `disabled` + label dinâmico durante o envio
- **Erros**: `showToast('error', error.response?.data?.erro || 'Fallback')`
- **Validações**: `showToast('warning', 'Mensagem')` antes de chamar a API
- **Sucesso**: `SuccessModal` para ações principais
- **Empty States**: todas as tabelas/listas exibem mensagem amigável quando vazias

```tsx
<button onClick={handleSalvar} disabled={isSubmitting}>
  {isSubmitting ? 'Salvando...' : 'Salvar'}
</button>
```

---

## Camada de Serviços (`src/services/`)

Funções puras async que chamam a API e retornam `data` (lançam erro em falha):

| Arquivo | Funções principais |
|---------|-------------------|
| `authService.ts` | `loginArbitro`, `loginAdmin`, `esqueciSenha` |
| `arbitrosService.ts` | `getArbitros`, `cadastrarArbitro`, `editarArbitro` (usa `ArbitroEditPayload`), `deletarArbitro`, `getMeuPerfil`, `atualizarMeuPerfil` |
| `adminService.ts` | `getAdminPerfil`, `atualizarAdminPerfil`, `alterarSenhaAdmin` |
| `avisosService.ts` | `getAvisos`, `criar`, `editar`, `deletar` |
| `coletasService.ts` | `getAcompanhamento`, `abrir`, `encerrar` |
| `disponibilidadeService.ts` | `getAgenda`, `enviar` |
| `escalasService.ts` | `gerarEscala`, `getRevisao`, `trocarArbitro`, `publicarEscala`, `getHistorico`, `exportarCSV` |
| `jogosService.ts` | `importar` |

---

## Camada de Hooks (`src/hooks/`)

| Hook | Página(s) |
|------|-----------|
| `useArbitroDashboard` | `HomePage`, `MyScalesPage` |
| `useArbitroPerfil` | `ProfilePage` |
| `useAdminPerfil` | `AdminPerfilPage` |
| `useAdminDashboard` | `AdminDashboardPage` |
| `useArbitros` | `GerenciarArbitrosPage` |
| `useAvisos` | `GerenciarAvisosPage` |
| `useColetas` | `GerenciarDisponibilidadesPage` |
| `useDisponibilidade` | `AvailabilityPage` |
| `useEscalas` | `GerenciarEscalasPage` |
| `useHistorico` | `HistoricoPage` |

---

## Endpoints da API (baseURL: `http://localhost:3333/api`)

```
POST   /auth/arbitro/login
POST   /auth/login
POST   /auth/esqueci-senha

GET    /arbitros/dashboard
GET    /arbitros/meu-perfil
PUT    /arbitros/meu-perfil
PUT    /arbitros/meu-perfil/senha
GET    /arbitros
POST   /arbitros/cadastrar
PUT    /arbitros/:id
DELETE /arbitros/:id

GET    /admin/dashboard
GET    /admin/me
PUT    /admin/me
PUT    /admin/me/senha

GET    /avisos
POST   /avisos
PUT    /avisos/:id
DELETE /avisos/:id

GET    /coletas/acompanhar
POST   /coletas/abrir
PUT    /coletas/:id/encerrar

GET    /disponibilidade/agenda
POST   /disponibilidade/enviar

POST   /escalas/gerar/:id
GET    /escalas/revisao/:id
PUT    /escalas/:id/trocar-arbitro
PATCH  /escalas/:id/publicar
GET    /escalas/opcoes-substituicao/:id
GET    /escalas/historico
GET    /escalas/exportar/:id

POST   /jogos/importar  (multipart)
```

---

## Estado Atual do Projeto

Build limpo: `tsc -b && vite build` — **0 erros TypeScript**, 126 módulos.

### Concluído
- Arquitetura hooks / serviços / páginas totalmente separada
- Tipagem centralizada em `src/types/index.ts` (sem `any` solto)
- Sistema de toast global substituindo todos os `alert()`
- `isSubmitting` em todos os hooks com ações assíncronas
- Empty states em todas as tabelas e listas
- `ArbitroEditPayload` separado de `ArbitroPayload`

### Pendente / Futuro
- Tela "Ver histórico" em `GerenciarDisponibilidadesPage` (exibe toast "em breve")
- Tela de importação de jogos (`/admin/jogos/importar`) — serviço existe, página não

---

## Diretrizes Gerais

1. Não altere lógica de negócio, endpoints ou roteamento sem consultar o usuário.
2. Nunca usar `alert()` — sempre `showToast`.
3. Novos tipos sempre em `src/types/index.ts`.
4. Ao adicionar ação assíncrona, expor `isSubmitting` no hook e desabilitar o botão na página.
