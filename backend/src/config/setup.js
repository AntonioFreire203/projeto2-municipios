// Script de carga inicial dos USUARIOS (senhas criptografadas com bcrypt).
// Uso: npm run db:setup
import dotenv from 'dotenv'
import { User } from '../models/User.js'
import { pool } from './db.js'
import { logger } from './logger.js'

dotenv.config()

// Conjunto de usuarios inseridos no banco para realizar o login
// (o enunciado dispensa rotina de cadastro pela aplicacao).
const USUARIOS_INICIAIS = [
  { username: 'admin', password: 'Admin@123' },
  { username: 'antonio', password: 'Utfpr@2026' },
]

async function seed() {
  try {
    for (const u of USUARIOS_INICIAIS) {
      const criado = await User.create(u.username, u.password)
      logger.info(
        criado ? `Usuario criado: ${u.username}` : `Usuario ja existia: ${u.username}`
      )
    }
    logger.info('Seed de usuarios concluido.')
  } catch (err) {
    logger.error(`Falha no seed de usuarios: ${err.message}`)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

seed()
