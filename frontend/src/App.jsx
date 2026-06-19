import { AuthProvider } from './context/AuthContext'
import { MunicipioProvider } from './context/MunicipioContext'
import { useAuth } from './hooks/useAuth'
import { Login } from './components/Login'
import { SearchForm } from './components/SearchForm'
import { InsertForm } from './components/InsertForm'
import { MunicipioList } from './components/MunicipioList'
import { Feedback, LoadingSpinner } from './components/Feedback'

// Area protegida: so renderiza para usuario com sessao ativa.
function Dashboard() {
  const { state, logout } = useAuth()

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Brasil Municípios</h1>
          <p>Bem-vindo, {state.user?.username}</p>
        </div>
        <button className="btn-logout" onClick={logout}>
          Sair
        </button>
      </header>

      <main className="app-main">
        <MunicipioProvider>
          <div className="painel">
            <SearchForm />
            <InsertForm />
          </div>
          <Feedback />
          <LoadingSpinner />
          <MunicipioList />
        </MunicipioProvider>
      </main>
    </div>
  )
}

function Roteador() {
  const { state, isAuthenticated } = useAuth()

  // Enquanto confirma a sessao no servidor, evita exibir o dashboard indevidamente.
  if (state.checking) {
    return (
      <div className="login-wrapper">
        <div className="spinner-wrapper">
          <div className="spinner" />
          <span>Verificando sessão...</span>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <Dashboard /> : <Login />
}

function App() {
  return (
    <AuthProvider>
      <Roteador />
    </AuthProvider>
  )
}

export default App
