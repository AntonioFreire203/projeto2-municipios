// Configuracao do acesso ao PostgreSQL usando POOL DE CONEXOES.
import pkg from 'pg'
import dotenv from 'dotenv'
import { logger } from './logger.js'

dotenv.config()

const { Pool } = pkg

// Pool de conexoes: reaproveita conexoes em vez de abrir/fechar a cada query.
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'municipios',
  password: process.env.DB_PASSWORD || 'municipios',
  database: process.env.DB_NAME || 'municipios',
  max: Number(process.env.DB_POOL_MAX) || 10, // maximo de conexoes simultaneas
  idleTimeoutMillis: 30_000, // fecha conexao ociosa apos 30s
  connectionTimeoutMillis: 5_000,
})

pool.on('error', (err) => {
  logger.error(`Erro inesperado no pool do PostgreSQL: ${err.message}`)
})

// Helper para executar queries SEMPRE parametrizadas (previne SQL Injection).
export function query(text, params) {
  return pool.query(text, params)
}
