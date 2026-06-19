// Model de acesso ao banco para a entidade Usuario.
import bcrypt from 'bcrypt'
import { query } from '../config/db.js'

export class User {
  // Busca usuario por nome (query parametrizada -> previne SQL Injection).
  static async findByUsername(username) {
    const { rows } = await query(
      'SELECT id, username, password_hash FROM users WHERE username = $1',
      [username]
    )
    return rows[0] || null
  }

  // Cria usuario com senha criptografada (bcrypt). Usado no seed.
  static async create(username, plainPassword) {
    const hash = await bcrypt.hash(plainPassword, 12)
    const { rows } = await query(
      `INSERT INTO users (username, password_hash) VALUES ($1, $2)
       ON CONFLICT (username) DO NOTHING
       RETURNING id, username`,
      [username, hash]
    )
    return rows[0] || null
  }

  // Compara a senha informada com o hash armazenado.
  static verifyPassword(plainPassword, passwordHash) {
    return bcrypt.compare(plainPassword, passwordHash)
  }
}
