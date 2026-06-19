# Brasil Municípios — Projeto 2 (Programação Web Fullstack)

Aplicação web em **3 camadas** (Front-end React + Back-end Express + Banco PostgreSQL) que permite **login**, **busca** e **inserção** de municípios brasileiros — tema herdado do [Projeto 1](https://github.com/AntonioFreire203/-brasil-municipios).

Apenas usuários autenticados (sessão ativa) podem buscar e inserir.

## Arquitetura

```
projeto2-municipios/
├── docker-compose.yml      # infra: PostgreSQL + Redis
├── backend/                # API HTTP RESTful (Express)
│   ├── src/
│   │   ├── routes/         # rotas + controllers (inline)
│   │   ├── models/         # classes de acesso ao banco
│   │   └── config/         # db (pool), redis, logger, auth
│   └── sql/                # schema + seed
└── frontend/               # SPA React (Vite) — context / hooks / components
```

## Tecnologias

| Camada | Stack |
|--------|-------|
| Front-end | React + Vite, React Hook Form, Context API + useReducer |
| Back-end | Express, JWT, bcrypt, express-validator, helmet, compression |
| Banco | PostgreSQL (pool de conexões via `pg`) |
| Cache | Redis (cache de busca + blacklist de tokens) |

## Segurança implementada

- **Criptografia**: senhas com **bcrypt** e **HTTPS** real (TLS) ativável via `USE_HTTPS=true` (gere o certificado com `npm run cert`).
- **Injeção / XSS**: queries **parametrizadas** (anti SQL Injection), sanitização de entrada (`express-validator`), headers seguros (`helmet`).
- **Autenticação**: **JWT** com expiração, **rate limiting** no login (anti-brute force), **invalidação de token** no logout (blacklist no Redis) e validação da sessão no carregamento (`GET /api/auth/me`).
- **Logs / monitoramento**: registro de falhas de login, buscas e inserções (`winston` → `backend/logs/`).

## Otimização

- **Compressão de respostas** do servidor (`compression`).
- **Compressão de arquivos estáticos**: com `SERVE_FRONTEND=true`, o back-end serve o build do front (`frontend/dist`) e o middleware `compression` comprime os assets nas respostas HTTP.
- **Cache** de buscas no Redis (TTL configurável), invalidado nas inserções.
- **Pool de conexões** no PostgreSQL.

### Modo produção (HTTPS + front servido pelo back-end)

```bash
cd frontend && npm run build      # gera frontend/dist
cd ../backend && npm run cert     # gera certificado self-signed (certs/)
USE_HTTPS=true SERVE_FRONTEND=true npm start   # https://localhost:3001
```

## Como executar (modelo híbrido)

Pré-requisitos: **Docker** (para banco e cache) e **Node.js 18+**.

### 1. Subir a infraestrutura (PostgreSQL + Redis)

```bash
docker compose up -d
```

O schema e a carga de municípios são aplicados automaticamente na primeira subida.

### 2. Back-end

```bash
cd backend
cp .env.example .env
npm install
npm run db:setup     # cria os usuários iniciais (senhas com bcrypt)
npm start            # servidor em http://localhost:3001
```

### 3. Front-end

```bash
cd frontend
npm install
npm run dev          # SPA em http://localhost:5173
```

## Usuários de teste

| Usuário | Senha |
|---------|-------|
| `admin` | `Admin@123` |
| `antonio` | `Utfpr@2026` |

## API REST

| Método | Rota | Protegida | Descrição |
|--------|------|-----------|-----------|
| POST | `/api/auth/login` | — | Autentica e retorna JWT |
| POST | `/api/auth/logout` | ✓ | Invalida o token atual |
| GET | `/api/auth/me` | ✓ | Dados do usuário logado |
| GET | `/api/municipios?nome=&uf=&regiao=` | ✓ | Busca (com cache) |
| POST | `/api/municipios` | ✓ | Insere município |

## Autor

Antonio Freire — Projeto 2 — Programação Web Fullstack (UTFPR)
