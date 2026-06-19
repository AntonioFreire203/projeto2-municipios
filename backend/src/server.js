// Servidor HTTP Express - Projeto 2 (Programacao Web Fullstack).
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import https from 'node:https'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { authRouter } from './routes/auth.routes.js'
import { municipiosRouter } from './routes/municipios.routes.js'
import { connectRedis } from './config/redis.js'
import { pool } from './config/db.js'
import { logger } from './config/logger.js'

dotenv.config()

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = Number(process.env.PORT) || 3001

// --- Seguranca / otimizacao (middlewares globais) ---
app.use(helmet()) // headers seguros (mitiga XSS, clickjacking, etc.)
app.use(compression()) // compressao gzip das respostas do servidor
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json({ limit: '10kb' })) // limita payload (mitiga abuso)

// --- Rotas RESTful ---
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRouter)
app.use('/api/municipios', municipiosRouter)

// --- Servir o build do front-end (arquivos estaticos COMPRIMIDOS pelo middleware
// compression acima). Ativado por SERVE_FRONTEND=true (modo producao). ---
const SERVE_FRONTEND = process.env.SERVE_FRONTEND === 'true'
const distPath = join(__dirname, '..', '..', 'frontend', 'dist')

if (SERVE_FRONTEND && existsSync(distPath)) {
  app.use(express.static(distPath))
  // Fallback do SPA: qualquer rota nao-API devolve o index.html.
  app.get(/^(?!\/api).*/, (req, res) => res.sendFile(join(distPath, 'index.html')))
  logger.info('Servindo front-end estatico de frontend/dist (comprimido).')
} else {
  // Em dev, a raiz mostra a porta de entrada amigavel da API.
  app.get('/', (req, res) =>
    res.json({
      api: 'Brasil Municipios',
      status: 'online',
      rotas: [
        'POST /api/auth/login',
        'POST /api/auth/logout',
        'GET  /api/auth/me',
        'GET  /api/municipios?nome=&uf=&regiao=',
        'POST /api/municipios',
      ],
    })
  )
}

// 404 (rotas de API nao encontradas)
app.use((req, res) => res.status(404).json({ erro: 'Recurso nao encontrado.' }))

// Handler de erro global
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(`Erro nao tratado: ${err.message}`)
  res.status(500).json({ erro: 'Erro interno do servidor.' })
})

function iniciarServidor() {
  const useHttps = process.env.USE_HTTPS === 'true'
  const keyPath = process.env.SSL_KEY_PATH || join(__dirname, '..', 'certs', 'key.pem')
  const certPath = process.env.SSL_CERT_PATH || join(__dirname, '..', 'certs', 'cert.pem')

  // HTTPS real quando habilitado e os certificados existem; senao, HTTP.
  if (useHttps && existsSync(keyPath) && existsSync(certPath)) {
    const credenciais = { key: readFileSync(keyPath), cert: readFileSync(certPath) }
    https
      .createServer(credenciais, app)
      .listen(PORT, () => logger.info(`Servidor HTTPS ouvindo na porta ${PORT}.`))
  } else {
    if (useHttps) logger.warn('USE_HTTPS=true mas certificados nao encontrados. Use "npm run cert". Subindo em HTTP.')
    app.listen(PORT, () => logger.info(`Servidor HTTP ouvindo na porta ${PORT}.`))
  }
}

async function start() {
  try {
    await connectRedis()
    await pool.query('SELECT 1') // valida conexao do pool
    logger.info('Pool do PostgreSQL conectado.')
    iniciarServidor()
  } catch (err) {
    logger.error(`Falha ao iniciar o servidor: ${err.message}`)
    process.exit(1)
  }
}

start()
