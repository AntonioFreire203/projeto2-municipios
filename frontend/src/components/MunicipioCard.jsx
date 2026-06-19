export function MunicipioCard({ municipio }) {
  return (
    <div className="municipio-card">
      <h3 className="card-nome">{municipio.nome}</h3>
      <div className="card-info">
        <span className="badge">{municipio.uf}</span>
        <span>{municipio.regiao}</span>
      </div>
      <p className="card-micro">Código IBGE: {municipio.codigo_ibge || '—'}</p>
    </div>
  )
}
