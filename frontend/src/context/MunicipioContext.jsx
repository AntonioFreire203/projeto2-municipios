import { createContext, useReducer } from 'react'

const initialState = {
  loading: false,
  results: [],
  error: null,
  mensagem: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null, mensagem: null }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, results: action.payload }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload, results: [] }
    case 'INSERT_SUCCESS':
      return { ...state, loading: false, mensagem: action.payload }
    case 'CLEAR_FEEDBACK':
      return { ...state, error: null, mensagem: null }
    default:
      return state
  }
}

export const MunicipioContext = createContext()

export function MunicipioProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <MunicipioContext.Provider value={{ state, dispatch }}>
      {children}
    </MunicipioContext.Provider>
  )
}
