// Configuracao do cliente Redis (cache de buscas + blacklist de tokens).
import { createClient } from 'redis'
import dotenv from 'dotenv'
import { logger } from './logger.js'

dotenv.config()

export const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
})

redis.on('error', (err) => logger.error(`Erro no Redis: ${err.message}`))
redis.on('connect', () => logger.info('Redis conectado.'))

export async function connectRedis() {
  if (!redis.isOpen) await redis.connect()
}
