import { useMunicipios } from '../hooks/useMunicipios'
import { MunicipioCard } from './MunicipioCard'

export function MunicipioList() {
  const { state } = useMunicipios()
  const { results } = state

  if (results.length === 0) return null

  return (
    <section className="municipio-list">
      <p className="list-count">{results.length} município(s) encontrado(s)</p>
      <div className="list-grid">
        {results.map((m) => (
          <MunicipioCard key={m.id} municipio={m} />
        ))}
      </div>
    </section>
  )
}
