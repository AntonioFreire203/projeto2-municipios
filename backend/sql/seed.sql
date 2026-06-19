-- Carga inicial de municipios (dados no mesmo tema do Projeto 1 - IBGE).
-- Os usuarios sao inseridos pelo script `npm run db:setup` (senhas com bcrypt).

INSERT INTO municipios (nome, uf, regiao, codigo_ibge) VALUES
  ('Curitiba',        'PR', 'Sul',          '4106902'),
  ('Londrina',        'PR', 'Sul',          '4113700'),
  ('Maringa',         'PR', 'Sul',          '4115200'),
  ('Porto Alegre',    'RS', 'Sul',          '4314902'),
  ('Florianopolis',   'SC', 'Sul',          '4205407'),
  ('Sao Paulo',       'SP', 'Sudeste',      '3550308'),
  ('Campinas',        'SP', 'Sudeste',      '3509502'),
  ('Rio de Janeiro',  'RJ', 'Sudeste',      '3304557'),
  ('Belo Horizonte',  'MG', 'Sudeste',      '3106200'),
  ('Vitoria',         'ES', 'Sudeste',      '3205309'),
  ('Salvador',        'BA', 'Nordeste',     '2927408'),
  ('Recife',          'PE', 'Nordeste',     '2611606'),
  ('Fortaleza',       'CE', 'Nordeste',     '2304400'),
  ('Natal',           'RN', 'Nordeste',     '2408102'),
  ('Brasilia',        'DF', 'Centro-Oeste', '5300108'),
  ('Goiania',         'GO', 'Centro-Oeste', '5208707'),
  ('Cuiaba',          'MT', 'Centro-Oeste', '5103403'),
  ('Campo Grande',    'MS', 'Centro-Oeste', '5002704'),
  ('Manaus',          'AM', 'Norte',        '1302603'),
  ('Belem',           'PA', 'Norte',        '1501402')
ON CONFLICT (codigo_ibge) DO NOTHING;
