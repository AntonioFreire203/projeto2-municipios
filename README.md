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

- **Criptografia**: senhas com **bcrypt**; suporte a HTTPS em produção.
- **Injeção / XSS**: queries **parametrizadas** (anti SQL Injection), sanitização de entrada (`express-validator`), headers seguros (`helmet`).
- **Autenticação**: **JWT** com expiração, **rate limiting** no login (anti-brute force) e **invalidação de token** no logout (blacklist no Redis).
- **Logs / monitoramento**: registro de falhas de login, buscas e inserções (`winston` → `backend/logs/`).

## Otimização

- **Compressão** de respostas do servidor (`compression`) e build minificado/gzip do front (Vite).
- **Cache** de buscas no Redis (TTL configurável).
- **Pool de conexões** no PostgreSQL.

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
