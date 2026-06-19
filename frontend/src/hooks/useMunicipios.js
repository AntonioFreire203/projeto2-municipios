import { useContext } from 'react'
import { MunicipioContext } from '../context/MunicipioContext'
import { AuthContext } from '../context/AuthContext'
import { apiFetch } from '../api'

export function useMunicipios() {
  const { state, dispatch } = useContext(MunicipioContext)
  const { state: auth } = useContext(AuthContext)

  const buscar = async ({ nome, uf, regiao }) => {
    dispatch({ type: 'FETCH_START' })
    try {
      const params = new URLSearchParams()
      if (nome?.trim()) params.set('nome', nome.trim())
      if (uf) params.set('uf', uf)
      if (regiao) params.set('regiao', regiao)

      const data = await apiFetch(`/municipios?${params.toString()}`, { token: auth.token })

      if (data.resultados.length === 0) {
        dispatch({ type: 'FETCH_ERROR', payload: 'Nenhum municipio encontrado.' })
      } else {
        dispatch({ type: 'FETCH_SUCCESS', payload: data.resultados })
      }
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message })
    }
  }

  const inserir = async (municipio) => {
    dispatch({ type: 'FETCH_START' })
    try {
      const data = await apiFetch('/municipios', {
        method: 'POST',
        body: municipio,
        token: auth.token,
      })
      dispatch({ type: 'INSERT_SUCCESS', payload: data.mensagem })
      return true
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message })
      return false
    }
  }

  const limparFeedback = () => dispatch({ type: 'CLEAR_FEEDBACK' })

  return { state, buscar, inserir, limparFeedback }
}
