import { useForm } from 'react-hook-form'
import { useMunicipios } from '../hooks/useMunicipios'
import { ESTADOS, REGIOES } from '../constants'

export function SearchForm() {
  const { state, buscar } = useMunicipios()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { nome: '', uf: '', regiao: '' } })

  return (
    <form className="search-form" onSubmit={handleSubmit(buscar)} noValidate>
      <h2>Buscar municipio</h2>
      <div className="form-group">
        <label htmlFor="nome">Nome *</label>
        <input
          id="nome"
          type="text"
          placeholder="Digite o nome do municipio"
          className={errors.nome ? 'input-error' : ''}
          {...register('nome', {
            required: 'O nome do municipio e obrigatorio.',
            minLength: { value: 2, message: 'Digite ao menos 2 caracteres.' },
          })}
        />
        {errors.nome && <span className="field-error">{errors.nome.message}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="uf">Estado (UF)</label>
          <select id="uf" {...register('uf')}>
            <option value="">Todos os estados</option>
            {ESTADOS.map((e) => (
              <option key={e.sigla} value={e.sigla}>
                {e.sigla} — {e.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="regiao">Regiao</label>
          <select id="regiao" {...register('regiao')}>
            <option value="">Todas as regioes</option>
            {REGIOES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="btn-buscar" disabled={state.loading}>
        {state.loading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  )
}
