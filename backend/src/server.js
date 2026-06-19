// Servidor HTTP Express - Projeto 2 (Programacao Web Fullstack).
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'

import { authRouter } from './routes/auth.routes.js'
import { municipiosRouter } from './routes/municipios.routes.js'
import { connectRedis } from './config/redis.js'
import { pool } from './config/db.js'
import { logger } from './config/logger.js'

dotenv.config()

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

// 404
app.use((req, res) => res.status(404).json({ erro: 'Recurso nao encontrado.' }))

// Handler de erro global
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(`Erro nao tratado: ${err.message}`)
  res.status(500).json({ erro: 'Erro interno do servidor.' })
})

async function start() {
  try {
    await connectRedis()
    await pool.query('SELECT 1') // valida conexao do pool
    logger.info('Pool do PostgreSQL conectado.')
    app.listen(PORT, () => logger.info(`Servidor HTTP ouvindo na porta ${PORT}.`))
  } catch (err) {
    logger.error(`Falha ao iniciar o servidor: ${err.message}`)
    process.exit(1)
  }
}

start()
