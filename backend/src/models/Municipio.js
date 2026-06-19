// Model de acesso ao banco para a entidade Municipio.
import { query } from '../config/db.js'

export class Municipio {
  // Busca com filtros opcionais (nome / uf / regiao). Tudo parametrizado.
  static async search({ nome, uf, regiao }) {
    const conditions = []
    const params = []

    if (nome) {
      params.push(`%${nome}%`)
      // unaccent + ILIKE -> busca ignora acentos e maiusculas/minusculas.
      conditions.push(`unaccent(nome) ILIKE unaccent($${params.length})`)
    }
    if (uf) {
      params.push(uf)
      conditions.push(`uf = $${params.length}`)
    }
    if (regiao) {
      params.push(regiao)
      conditions.push(`regiao = $${params.length}`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const { rows } = await query(
      `SELECT id, nome, uf, regiao, codigo_ibge, created_at
         FROM municipios ${where}
         ORDER BY nome
         LIMIT 200`,
      params
    )
    return rows
  }

  static async findByCodigoIbge(codigoIbge) {
    const { rows } = await query(
      'SELECT id FROM municipios WHERE codigo_ibge = $1',
      [codigoIbge]
    )
    return rows[0] || null
  }

  // Insere um novo municipio associado ao usuario autor.
  static async create({ nome, uf, regiao, codigoIbge }, criadoPor) {
    const { rows } = await query(
      `INSERT INTO municipios (nome, uf, regiao, codigo_ibge, criado_por)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nome, uf, regiao, codigo_ibge, created_at`,
      [nome, uf, regiao, codigoIbge || null, criadoPor]
    )
    return rows[0]
  }
}
