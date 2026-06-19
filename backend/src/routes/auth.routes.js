// Rotas de autenticacao (controllers INLINE, conforme exigido pelo enunciado).
import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import rateLimit from 'express-rate-limit'
import { User } from '../models/User.js'
import { signToken, revokeToken, authenticate } from '../config/auth.js'
import { logSecurityEvent } from '../config/logger.js'

export const authRouter = Router()

// Anti-brute force: limita tentativas de login por IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 tentativas por janela
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Tente novamente em alguns minutos.' },
})

// POST /api/auth/login -> autentica e devolve JWT
authRouter.post(
  '/login',
  loginLimiter,
  body('username').trim().notEmpty().withMessage('Usuario e obrigatorio.'),
  body('password').notEmpty().withMessage('Senha e obrigatoria.'),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array().map((e) => e.msg) })
    }

    const { username, password } = req.body
    try {
      const user = await User.findByUsername(username)
      // Mesma resposta para usuario inexistente ou senha errada (evita enumeracao).
      if (!user || !(await User.verifyPassword(password, user.password_hash))) {
        logSecurityEvent('LOGIN_FAILED', req, `username=${username}`)
        return res.status(401).json({ erro: 'Usuario ou senha invalidos.' })
      }

      const token = signToken(user)
      logSecurityEvent('LOGIN_SUCCESS', { ...req, user }, `username=${username}`)
      return res.json({ token, user: { id: user.id, username: user.username } })
    } catch (err) {
      logSecurityEvent('LOGIN_ERROR', req, err.message)
      return res.status(500).json({ erro: 'Erro interno ao processar o login.' })
    }
  }
)

// POST /api/auth/logout -> invalida o token atual (blacklist no Redis)
authRouter.post('/logout', authenticate, async (req, res) => {
  await revokeToken(req.token)
  logSecurityEvent('LOGOUT', req)
  return res.json({ mensagem: 'Sessao encerrada com sucesso.' })
})

// GET /api/auth/me -> dados do usuario logado (valida sessao no front)
authRouter.get('/me', authenticate, (req, res) => {
  return res.json({ user: req.user })
})
