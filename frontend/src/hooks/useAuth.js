import { useContext } from 'react'
import { AuthContext, TOKEN_KEY, USER_KEY } from '../context/AuthContext'
import { apiFetch } from '../api'

export function useAuth() {
  const { state, dispatch } = useContext(AuthContext)

  const login = async ({ username, password }) => {
    dispatch({ type: 'LOGIN_START' })
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { username, password },
      })
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      dispatch({ type: 'LOGIN_SUCCESS', payload: data })
    } catch (err) {
      dispatch({ type: 'LOGIN_ERROR', payload: err.message })
    }
  }

  const logout = async () => {
    try {
      if (state.token) await apiFetch('/auth/logout', { method: 'POST', token: state.token })
    } catch {
      // mesmo se falhar no servidor, limpamos a sessao local
    }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    dispatch({ type: 'LOGOUT' })
  }

  return { state, login, logout, isAuthenticated: Boolean(state.token) }
}
