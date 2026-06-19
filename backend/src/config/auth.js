// Configuracao de autenticacao: geracao/validacao de JWT e middleware de protecao.
// Inclui invalidacao de token (blacklist no Redis) para o logout.
import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'
import { redis } from './redis.js'
import { logSecurityEvent } from './logger.js'

const JWT_SECRET = process.env.JWT_SECRET || 'troque-este-segredo-em-producao'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'
const BLACKLIST_PREFIX = 'blacklist:'

// Gera um token assinado com um identificador unico (jti) para permitir revogacao.
export function signToken(user) {
  const jti = randomUUID()
  const token = jwt.sign({ sub: user.id, username: user.username, jti }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
  return token
}

// Coloca o token na blacklist ate o seu vencimento natural.
export async function revokeToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const ttl = decoded.exp - Math.floor(Date.now() / 1000)
    if (ttl > 0) await redis.set(`${BLACKLIST_PREFIX}${decoded.jti}`, '1', { EX: ttl })
  } catch {
    // token invalido/expirado nao precisa ser revogado
  }
}

// Middleware: exige sessao ativa (token valido e nao revogado).
export async function authenticate(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    logSecurityEvent('AUTH_MISSING_TOKEN', req)
    return res.status(401).json({ erro: 'Autenticacao necessaria.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const revoked = await redis.get(`${BLACKLIST_PREFIX}${decoded.jti}`)
    if (revoked) {
      logSecurityEvent('AUTH_REVOKED_TOKEN', req)
      return res.status(401).json({ erro: 'Sessao expirada. Faca login novamente.' })
    }
    req.user = { id: decoded.sub, username: decoded.username }
    req.token = token
    next()
  } catch {
    logSecurityEvent('AUTH_INVALID_TOKEN', req)
    return res.status(401).json({ erro: 'Token invalido ou expirado.' })
  }
}
