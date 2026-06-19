-- Esquema do banco de dados (Projeto 2 - Programacao Web Fullstack)
-- Executado automaticamente pelo container do PostgreSQL na primeira subida.

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(60) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS municipios (
  id           SERIAL PRIMARY KEY,
  nome         VARCHAR(120) NOT NULL,
  uf           CHAR(2)      NOT NULL,
  regiao       VARCHAR(20)  NOT NULL,
  codigo_ibge  VARCHAR(7)   UNIQUE,
  criado_por   INTEGER      REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Indices para acelerar a busca por nome / UF / regiao
CREATE INDEX IF NOT EXISTS idx_municipios_nome   ON municipios (LOWER(nome));
CREATE INDEX IF NOT EXISTS idx_municipios_uf     ON municipios (uf);
CREATE INDEX IF NOT EXISTS idx_municipios_regiao ON municipios (regiao);
