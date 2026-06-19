import { createContext, useReducer } from 'react'

const TOKEN_KEY = 'municipios:token'
const USER_KEY = 'municipios:user'

const initialState = {
  token: localStorage.getItem(TOKEN_KEY) || null,
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  loading: false,
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, token: action.payload.token, user: action.payload.user }
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'LOGOUT':
      return { ...state, token: null, user: null, error: null }
    default:
      return state
  }
}

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
  )
}

export { TOKEN_KEY, USER_KEY }
