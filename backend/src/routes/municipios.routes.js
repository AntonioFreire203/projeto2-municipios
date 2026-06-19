// Rotas de municipios (controllers INLINE). Todas exigem sessao ativa.
import { Router } from 'express'
import { body, query as q, validationResult } from 'express-validator'
import { Municipio } from '../models/Municipio.js'
import { authenticate } from '../config/auth.js'
import { redis } from '../config/redis.js'
import { logSecurityEvent } from '../config/logger.js'

export const municipiosRouter = Router()

const CACHE_TTL = 60 // segundos
const REGIOES = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

// Todas as rotas abaixo sao protegidas por autenticacao.
municipiosRouter.use(authenticate)

// GET /api/municipios?nome=&uf=&regiao=  -> BUSCA (com cache no Redis)
municipiosRouter.get(
  '/',
  q('nome').optional().trim().escape(),
  q('uf').optional().trim().toUpperCase().isLength({ min: 2, max: 2 }).withMessage('UF invalida.'),
  q('regiao').optional().trim().isIn(REGIOES).withMessage('Regiao invalida.'),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array().map((e) => e.msg) })
    }

    const filtros = {
      nome: req.query.nome || '',
      uf: req.query.uf || '',
      regiao: req.query.regiao || '',
    }
    const cacheKey = `busca:${filtros.nome}:${filtros.uf}:${filtros.regiao}`

    try {
      const cached = await redis.get(cacheKey)
      if (cached) {
        logSecurityEvent('SEARCH', req, `cache=HIT ${cacheKey}`)
        return res.json({ origem: 'cache', resultados: JSON.parse(cached) })
      }

      const resultados = await Municipio.search(filtros)
      await redis.set(cacheKey, JSON.stringify(resultados), { EX: CACHE_TTL })
      logSecurityEvent('SEARCH', req, `cache=MISS total=${resultados.length} ${cacheKey}`)
      return res.json({ origem: 'banco', resultados })
    } catch (err) {
      logSecurityEvent('SEARCH_ERROR', req, err.message)
      return res.status(500).json({ erro: 'Erro ao buscar municipios.' })
    }
  }
)

// POST /api/municipios  -> INSERCAO (validacao no servidor)
municipiosRouter.post(
  '/',
  body('nome').trim().notEmpty().withMessage('O nome do municipio e obrigatorio.')
    .isLength({ min: 2, max: 120 }).withMessage('Nome deve ter entre 2 e 120 caracteres.').escape(),
  body('uf').trim().toUpperCase().isLength({ min: 2, max: 2 }).withMessage('UF deve ter 2 letras.')
    .isAlpha().withMessage('UF deve conter apenas letras.'),
  body('regiao').trim().isIn(REGIOES).withMessage('Regiao invalida.'),
  body('codigoIbge').optional({ values: 'falsy' }).trim()
    .isNumeric().withMessage('Codigo IBGE deve ser numerico.')
    .isLength({ min: 7, max: 7 }).withMessage('Codigo IBGE deve ter 7 digitos.'),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array().map((e) => e.msg) })
    }

    const { nome, uf, regiao, codigoIbge } = req.body
    try {
      if (codigoIbge && (await Municipio.findByCodigoIbge(codigoIbge))) {
        return res.status(409).json({ erro: 'Ja existe um municipio com este codigo IBGE.' })
      }

      const novo = await Municipio.create({ nome, uf, regiao, codigoIbge }, req.user.id)
      logSecurityEvent('INSERT', req, `municipio=${novo.nome}/${novo.uf} id=${novo.id}`)
      return res.status(201).json({ mensagem: 'Municipio cadastrado com sucesso.', municipio: novo })
    } catch (err) {
      logSecurityEvent('INSERT_ERROR', req, err.message)
      return res.status(500).json({ erro: 'Erro ao cadastrar municipio.' })
    }
  }
)
