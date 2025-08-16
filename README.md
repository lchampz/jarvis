# 🚀 Jarvis - Sistema de Gestão de Salas em Tempo Real

Sistema completo para gerenciamento de salas com check-in/check-out de visitantes em tempo real, utilizando WebSockets para sincronização instantânea entre múltiplos usuários.

## 📸 Screenshots

### Tela de Login
![Tela de Login](./screenshots/login.png)
*Tela de login com suporte para visitantes e administradores*
![Dashboard](./screenshots/dash.png)
*Dashboard para gestão das salas*

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Routes](#api-routes)
- [WebSocket Events](#websocket-events)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

## 🎯 Visão Geral

Jarvis é um sistema de gestão de salas inteligente que permite:

- **Gestão de Salas**: Criar, editar e excluir salas com capacidades personalizadas
- **Check-in/Check-out**: Sistema de entrada e saída de visitantes em tempo real
- **Monitoramento**: Acompanhamento da ocupação das salas em tempo real
- **Autenticação**: Sistema de login para administradores e visitantes
- **Logs**: Registro completo de todas as ações do sistema
- **WebSockets**: Sincronização instantânea entre todos os usuários

## 🛠️ Tecnologias

### Backend
- **Runtime**: [Bun](https://bun.sh/) - Runtime JavaScript/TypeScript ultra-rápido
- **Framework**: [Elysia](https://elysiajs.com/) - Framework web moderno e performático
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional robusto
- **ORM**: [Prisma](https://www.prisma.io/) - ORM moderno com type-safety
- **WebSockets**: [Socket.IO](https://socket.io/) - Comunicação em tempo real
- **Validação**: [Yup](https://github.com/jquense/yup) - Validação de schemas JavaScript/TypeScript

### Frontend
- **Framework**: [React 18](https://react.dev/) - Biblioteca para interfaces de usuário
- **Build Tool**: [Vite](https://vitejs.dev/) - Build tool ultra-rápido
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Gerenciamento de estado simples
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Componentes React reutilizáveis
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) - Sistema de toast elegante
- **Routing**: [React Router](https://reactrouter.com/) - Roteamento declarativo

### DevOps & Tools
- **Containerização**: [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/)
- **Package Manager**: [Bun](https://bun.sh/) - Gerenciador de pacotes ultra-rápido
- **TypeScript**: [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript tipado
- **Linting**: [ESLint](https://eslint.org/) - Linter JavaScript configurável
- **Formatting**: [Prettier](https://prettier.io/) - Formatador de código opinativo

##  Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Elysia)      │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│   - Dashboard   │    │   - API Routes  │    │   - Rooms       │
│   - Auth        │    │   - WebSockets  │    │   - Visitors    │
│   - Real-time   │    │   - Business    │    │   - Logs        │
│   - Responsive  │    │   - Validation  │    │   - Users       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         └───────────────────────┘
                    │
         ┌─────────────────┐
         │   WebSockets    │
         │   (Socket.IO)   │
         │                 │
         │   - Real-time   │
         │   - Room updates│
         │   - User events │
         └─────────────────┘
```

## 📁 Estrutura do Projeto

```
jarvis/
├── 📁 api/                          # Backend da aplicação
│   ├── 📁 database/                 # Configurações de banco
│   │   └── prisma.ts               # Cliente Prisma
│   ├── 📁 dtos/                    # Data Transfer Objects
│   │   ├── auth.dto.ts             # DTOs de autenticação
│   │   ├── rooms.dto.ts            # DTOs de salas
│   │   └── visitors.dto.ts         # DTOs de visitantes
│   ├── 📁 enum/                    # Enumerações
│   │   └── actions.ts              # Ações do sistema
│   ├── 📁 generated/                # Código gerado pelo Prisma
│   ├── 📁 middlewares/              # Middlewares da aplicação
│   │   └── log.middleware.ts       # Middleware de logging
│   ├── 📁 prisma/                   # Schema e migrações do banco
│   │   ├── migrations/             # Migrações do banco
│   │   └── schema.prisma           # Schema do banco
│   ├── 📁 repositories/             # Camada de acesso a dados
│   │   ├── auth.repository.ts      # Repository de autenticação
│   │   ├── rooms.repository.ts     # Repository de salas
│   │   └── visitors.repository.ts  # Repository de visitantes
│   ├── 📁 routes/                   # Rotas da API
│   │   ├── auth.route.ts           # Rotas de autenticação
│   │   ├── rooms.route.ts          # Rotas de salas
│   │   └── visitors.route.ts       # Rotas de visitantes
│   ├── 📁 types/                    # Tipos TypeScript
│   ├── docker-compose.yml           # Configuração Docker
│   ├── package.json                 # Dependências do backend
│   └── server.ts                    # Servidor principal
├── 📁 src/                          # Frontend da aplicação
│   ├── 📁 components/               # Componentes React
│   │   ├── 📁 Dashboard/            # Componentes do Dashboard
│   │   │   ├── DashboardHeader.tsx  # Header do Dashboard
│   │   │   ├── SearchBar.tsx        # Barra de busca
│   │   │   ├── StatsCards.tsx       # Cards de estatísticas
│   │   │   ├── RoomCard.tsx         # Card de sala individual
│   │   │   ├── RoomsGrid.tsx        # Grid de salas
│   │   │   ├── RoomDetailsModal.tsx # Modal de detalhes
│   │   │   └── AddRoomModal.tsx     # Modal de adicionar sala
│   │   ├── 📁 ui/                   # Componentes de UI base
│   │   │   ├── button.tsx           # Botão reutilizável
│   │   │   ├── card.tsx             # Card reutilizável
│   │   │   ├── input.tsx            # Input reutilizável
│   │   │   └── ...                  # Outros componentes
│   │   └── 📁 Auth/                 # Componentes de autenticação
│   ├── 📁 hooks/                    # Hooks React customizados
│   │   └── useSocket.ts             # Hook para WebSockets
│   ├── 📁 lib/                      # Utilitários e configurações
│   │   ├── api.ts                   # Configuração da API
│   │   └── utils.ts                 # Funções utilitárias
│   ├── 📁 pages/                    # Páginas da aplicação
│   │   ├── Dashboard.tsx            # Página principal
│   │   ├── Login.tsx                # Página de login
│   │   └── Register.tsx             # Página de registro
│   ├── 📁 requests/                 # Funções de requisição HTTP
│   │   ├── auth.request.ts          # Requisições de auth
│   │   ├── room.request.ts          # Requisições de salas
│   │   └── visitor.request.ts       # Requisições de visitantes
│   ├── 📁 routes/                   # Configuração de rotas
│   │   └── routes.config.tsx        # Configuração das rotas
│   ├── 📁 stores/                   # Gerenciamento de estado
│   │   ├── auth.store.ts            # Store de autenticação
│   │   ├── rooms.store.ts           # Store de salas
│   │   └── visitors.store.ts        # Store de visitantes
│   ├── 📁 types/                    # Tipos TypeScript
│   │   ├── auth.types.ts            # Tipos de autenticação
│   │   ├── rooms.types.ts           # Tipos de salas
│   │   ├── visitors.types.ts        # Tipos de visitantes
│   │   └── ...                      # Outros tipos
│   ├── 📁 validators/                # Validações de formulário
│   │   ├── auth.validator.ts        # Validações de auth
│   │   ├── rooms.validator.ts       # Validações de salas
│   │   └── visitors.validator.ts    # Validações de visitantes
│   ├── App.tsx                      # Componente principal
│   ├── index.tsx                    # Ponto de entrada
│   └── package.json                 # Dependências do frontend
├── 📁 styles/                       # Estilos globais
├── 📁 docs/                         # Documentação adicional
├── .env.example                     # Exemplo de variáveis de ambiente
├── docker-compose.yml               # Configuração Docker principal
├── package.json                     # Dependências do projeto
└── README.md                        # Este arquivo
```

##  API Routes

### 🔐 Autenticação (`/auth`)

| Método | Endpoint | Descrição | Parâmetros | Resposta |
|--------|----------|-----------|------------|----------|
| `POST` | `/auth/login` | Login de usuário | `{ email/cpf, password }` | `{ token, user }` |
| `POST` | `/auth/register` | Registro de visitante | `{ name, email, cpf, password }` | `{ user }` |
| `POST` | `/auth/logout` | Logout do usuário | `{ token }` | `{ message }` |

###  Salas (`/rooms`)

| Método | Endpoint | Descrição | Parâmetros | Resposta |
|--------|----------|-----------|------------|----------|
| `GET` | `/rooms` | Listar todas as salas | - | `{ rooms: Room[] }` |
| `GET` | `/rooms/:id` | Buscar sala por ID | `id` | `{ room: Room }` |
| `POST` | `/rooms` | Criar nova sala | `{ name, visitorsCapacity }` | `{ room: Room }` |
| `PUT` | `/rooms/:id` | Atualizar sala | `id, { name, visitorsCapacity }` | `{ room: Room }` |
| `DELETE` | `/rooms/:id` | Excluir sala | `id` | `{ message }` |

### 👥 Visitantes (`/visitors`)

| Método | Endpoint | Descrição | Parâmetros | Resposta |
|--------|----------|-----------|------------|----------|
| `GET` | `/visitors` | Listar todos os visitantes | - | `{ visitors: Visitor[] }` |
| `GET` | `/visitors/:id` | Buscar visitante por ID | `id` | `{ visitor: Visitor }` |
| `POST` | `/visitors` | Criar novo visitante | `{ name, email, cpf, password }` | `{ visitor: Visitor }` |
| `PUT` | `/visitors/:id` | Atualizar visitante | `id, { name, email, cpf }` | `{ visitor: Visitor }` |
| `DELETE` | `/visitors/:id` | Excluir visitante | `id` | `{ message }` |

###  Check-in/Check-out (`/visitors`)

| Método | Endpoint | Descrição | Parâmetros | Resposta |
|--------|----------|-----------|------------|----------|
| `POST` | `/visitors/:id/checkin` | Check-in em sala | `id, { roomId }` | `{ visitor: Visitor }` |
| `POST` | `/visitors/:id/checkout` | Check-out da sala | `id` | `{ visitor: Visitor }` |

### 📊 Logs (`/logs`)

| Método | Endpoint | Descrição | Parâmetros | Resposta |
|--------|----------|-----------|------------|----------|
| `GET` | `/logs` | Listar logs do sistema | `{ page, limit, action, userId }` | `{ logs: Log[], total }` |
| `GET` | `/logs/:id` | Buscar log por ID | `id` | `{ log: Log }` |

##  WebSocket Events

###  Eventos do Cliente para o Servidor

| Evento | Descrição | Dados | Resposta |
|--------|-----------|-------|----------|
| `join-room` | Entrar em uma sala específica | `{ roomId: string }` | - |
| `leave-room` | Sair de uma sala específica | `{ roomId: string, visitorId: string }` | - |
| `disconnect` | Desconexão do usuário | - | - |

### 📢 Eventos do Servidor para o Cliente

| Evento | Descrição | Dados | Escopo |
|--------|-----------|-------|--------|
| `room-created` | Nova sala criada | `{ action: 'created', room: Room, message: string, timestamp: Date }` | Global |
| `room-updated` | Sala atualizada | `{ action: 'checkin'\|'checkout', roomId: string, visitorId: string, room: Room, timestamp: Date }` | Global |
| `room-updated` | Atualização específica da sala | `{ roomId: string, data: Room, timestamp: Date }` | Sala específica |
| `visitor-checked-in` | Visitante fez check-in | `{ visitorId: string, roomId: string, action: 'checkin', timestamp: Date }` | Global |
| `visitor-checked-out` | Visitante fez check-out | `{ visitorId: string, roomId: string, action: 'checkout', timestamp: Date }` | Global |
| `user-joined-room` | Usuário entrou em uma sala | `{ roomId: string, visitorId: string, timestamp: Date }` | Global |

###  Rooms do Socket.IO

| Room | Descrição | Membros |
|------|-----------|---------|
| `room-{roomId}` | Sala específica | Usuários na sala |
| Global | Todos os usuários conectados | Todos os usuários |

## 🚀 Instalação

### Pré-requisitos

- [Bun](https://bun.sh/) (versão 1.0+)
- [Docker](https://www.docker.com/) (versão 20.0+)
- [Docker Compose](https://docs.docker.com/compose/) (versão 2.0+)
- [PostgreSQL](https://www.postgresql.org/) (versão 15+)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/jarvis.git
cd jarvis
```

### 2. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/jarvis"

# API
API_PORT=3001
API_HOST=localhost

# WebSocket
SOCKET_PORT=3002
SOCKET_HOST=localhost

# Frontend
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

### 3. Inicie o banco de dados

```bash
# Iniciar PostgreSQL com Docker
docker-compose up -d postgres

# Aguarde o banco estar pronto
docker-compose logs postgres
```

### 4. Configure o banco de dados

```bash
cd api

# Instalar dependências
bun install

# Gerar cliente Prisma
bunx prisma generate

# Executar migrações
bunx prisma migrate dev

# (Opcional) Seed do banco
bunx prisma db seed
```

### 5. Configure o frontend

```bash
cd ../src

# Instalar dependências
bun install

# Configurar variáveis de ambiente
cp .env.example .env
```

### 6. Inicie os serviços

```bash
# Terminal 1: Backend + WebSocket
cd api
bun run dev

# Terminal 2: Frontend
cd src
bun run dev

# Terminal 3: Banco de dados (se não estiver usando Docker)
docker-compose up postgres
```

## ⚙️ Configuração

### Banco de Dados

O sistema usa PostgreSQL com Prisma como ORM. O schema está definido em `api/prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String?  @unique
  cpf       String?  @unique
  password  String
  userType  UserType @default(VISITOR)
  roomId    String?
  room      Room?    @relation(fields: [roomId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  logs      Log[]
}

model Room {
  id             String     @id @default(cuid())
  name           String
  visitorsCount  Int        @default(0)
  visitorsCapacity Int
  visitors       User[]
  logs           Log[]
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
}

model Log {
  id         String        @id @default(cuid())
  action     VisitorActions
  userId     String
  user       User          @relation(fields: [userId], references: [id])
  roomId     String?
  room       Room?         @relation(fields: [roomId], references: [id])
  timestamp  DateTime      @default(now())
}
```

### WebSockets

O sistema usa Socket.IO para comunicação em tempo real. A configuração está em `api/server.ts`:

```typescript
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:3001"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
});
```

### Autenticação

O sistema usa Bun para autenticação. Os tokens são validados em cada requisição protegida:

```typescript
// Middleware de autenticação
const authMiddleware = new E
```

## 🤝 Contribuição

- [Bug Reports](https://github.com/seu-usuario/jarvis/issues)
- [Feature Requests](https://github.com/seu-usuario/jarvis/issues)
- [Pull Requests](https://github.com/seu-usuario/jarvis/pulls)

