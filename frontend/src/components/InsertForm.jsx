import { useForm } from 'react-hook-form'
import { useMunicipios } from '../hooks/useMunicipios'

const REGIOES = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

export function InsertForm() {
  const { state, inserir } = useMunicipios()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { nome: '', uf: '', regiao: '', codigoIbge: '' } })

  const onSubmit = async (dados) => {
    const ok = await inserir(dados)
    if (ok) reset()
  }

  return (
    <form className="search-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>Cadastrar municipio</h2>

      <div className="form-group">
        <label htmlFor="ins-nome">Nome *</label>
        <input
          id="ins-nome"
          type="text"
          className={errors.nome ? 'input-error' : ''}
          {...register('nome', {
            required: 'O nome e obrigatorio.',
            minLength: { value: 2, message: 'Digite ao menos 2 caracteres.' },
          })}
        />
        {errors.nome && <span className="field-error">{errors.nome.message}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ins-uf">UF *</label>
          <input
            id="ins-uf"
            type="text"
            maxLength={2}
            style={{ textTransform: 'uppercase' }}
            className={errors.uf ? 'input-error' : ''}
            {...register('uf', {
              required: 'Informe a UF.',
              pattern: { value: /^[A-Za-z]{2}$/, message: 'UF deve ter 2 letras.' },
            })}
          />
          {errors.uf && <span className="field-error">{errors.uf.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="ins-regiao">Regiao *</label>
          <select
            id="ins-regiao"
            className={errors.regiao ? 'input-error' : ''}
            {...register('regiao', { required: 'Selecione a regiao.' })}
          >
            <option value="">Selecione</option>
            {REGIOES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.regiao && <span className="field-error">{errors.regiao.message}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="ins-codigo">Codigo IBGE (opcional)</label>
        <input
          id="ins-codigo"
          type="text"
          maxLength={7}
          placeholder="7 digitos"
          className={errors.codigoIbge ? 'input-error' : ''}
          {...register('codigoIbge', {
            pattern: { value: /^\d{7}$/, message: 'Deve ter 7 digitos numericos.' },
          })}
        />
        {errors.codigoIbge && <span className="field-error">{errors.codigoIbge.message}</span>}
      </div>

      <button type="submit" className="btn-buscar" disabled={state.loading}>
        {state.loading ? 'Salvando...' : 'Cadastrar'}
      </button>
    </form>
  )
}
