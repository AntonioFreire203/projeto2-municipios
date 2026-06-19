// Cliente HTTP simples para falar com o back-end Express.
// Injeta o token JWT (quando existe) e padroniza o tratamento de erros.
const BASE_URL = '/api'

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    // O back-end devolve { erro } ou { erros: [...] }
    const mensagem = data.erro || (data.erros && data.erros.join(' ')) || 'Erro inesperado.'
    const erro = new Error(mensagem)
    erro.status = res.status
    throw erro
  }

  return data
}
