import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const { state, login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } })

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit(login)} noValidate>
        <h1>Brasil Municipios</h1>
        <p className="login-sub">Faca login para acessar o sistema</p>

        <div className="form-group">
          <label htmlFor="username">Usuario *</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            className={errors.username ? 'input-error' : ''}
            {...register('username', { required: 'Informe o usuario.' })}
          />
          {errors.username && <span className="field-error">{errors.username.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha *</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={errors.password ? 'input-error' : ''}
            {...register('password', { required: 'Informe a senha.' })}
          />
          {errors.password && <span className="field-error">{errors.password.message}</span>}
        </div>

        {state.error && <div className="error-banner">{state.error}</div>}

        <button type="submit" className="btn-buscar" disabled={state.loading}>
          {state.loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
