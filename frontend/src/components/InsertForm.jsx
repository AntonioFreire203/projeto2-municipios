import { useForm } from 'react-hook-form'
import { useMunicipios } from '../hooks/useMunicipios'
import { ESTADOS, REGIOES } from '../constants'

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
      <h2>Cadastrar município</h2>

      <div className="form-group">
        <label htmlFor="ins-nome">Nome *</label>
        <input
          id="ins-nome"
          type="text"
          className={errors.nome ? 'input-error' : ''}
          {...register('nome', {
            required: 'O nome é obrigatório.',
            minLength: { value: 2, message: 'Digite ao menos 2 caracteres.' },
          })}
        />
        {errors.nome && <span className="field-error">{errors.nome.message}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ins-uf">UF *</label>
          <select
            id="ins-uf"
            className={errors.uf ? 'input-error' : ''}
            {...register('uf', { required: 'Selecione a UF.' })}
          >
            <option value="">Selecione</option>
            {ESTADOS.map((e) => (
              <option key={e.sigla} value={e.sigla}>
                {e.sigla} — {e.nome}
              </option>
            ))}
          </select>
          {errors.uf && <span className="field-error">{errors.uf.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="ins-regiao">Região *</label>
          <select
            id="ins-regiao"
            className={errors.regiao ? 'input-error' : ''}
            {...register('regiao', { required: 'Selecione a região.' })}
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
        <label htmlFor="ins-codigo">Código IBGE (opcional)</label>
        <input
          id="ins-codigo"
          type="text"
          maxLength={7}
          placeholder="7 dígitos"
          className={errors.codigoIbge ? 'input-error' : ''}
          {...register('codigoIbge', {
            pattern: { value: /^\d{7}$/, message: 'Deve ter 7 dígitos numéricos.' },
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
