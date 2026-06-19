import { createContext, useReducer, useEffect } from 'react'
import { apiFetch } from '../api'

const TOKEN_KEY = 'municipios:token'
const USER_KEY = 'municipios:user'

const storedToken = localStorage.getItem(TOKEN_KEY) || null

const initialState = {
  token: storedToken,
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  loading: false,
  error: null,
  // Enquanto valida o token existente no servidor, evita "piscar" o dashboard.
  checking: Boolean(storedToken),
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        checking: false,
        token: action.payload.token,
        user: action.payload.user,
      }
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SESSION_VALID':
      return { ...state, checking: false }
    case 'SESSION_INVALID':
    case 'LOGOUT':
      return { ...state, token: null, user: null, error: null, checking: false }
    default:
      return state
  }
}

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Ao abrir/recarregar: se ha token, confirma com o servidor se a sessao e valida.
  useEffect(() => {
    if (!storedToken) return
    apiFetch('/auth/me', { token: storedToken })
      .then(() => dispatch({ type: 'SESSION_VALID' }))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        dispatch({ type: 'SESSION_INVALID' })
      })
  }, [])

  return (
    <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
  )
}

export { TOKEN_KEY, USER_KEY }
