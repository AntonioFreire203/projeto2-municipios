import { useMunicipios } from '../hooks/useMunicipios'

// Exibe mensagens de erro (vermelho) ou sucesso (verde) vindas do servidor.
export function Feedback() {
  const { state } = useMunicipios()

  if (state.error) return <div className="error-banner">{state.error}</div>
  if (state.mensagem) return <div className="success-banner">{state.mensagem}</div>
  return null
}

export function LoadingSpinner() {
  const { state } = useMunicipios()
  if (!state.loading) return null
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <span>Processando...</span>
    </div>
  )
}
