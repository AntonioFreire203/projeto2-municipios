// Logger centralizado (winston) para registro/monitoramento de seguranca.
// Registra falhas de autenticacao, buscas e insercoes.
import winston from 'winston'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const logDir = join(__dirname, '..', '..', 'logs')

// Garante que a pasta de logs exista (ela e ignorada pelo git).
mkdirSync(logDir, { recursive: true })

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: join(logDir, 'security.log') }),
    new winston.transports.File({ filename: join(logDir, 'error.log'), level: 'error' }),
  ],
})

// Evento de seguranca com formato padronizado (auditoria).
export function logSecurityEvent(event, req, detail = '') {
  const ip = req?.ip || req?.headers?.['x-forwarded-for'] || 'desconhecido'
  const user = req?.user?.username || 'anonimo'
  logger.info(`SECURITY event=${event} user=${user} ip=${ip} ${detail}`.trim())
}
