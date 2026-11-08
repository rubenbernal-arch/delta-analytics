const giros = [
  'Restaurantes',
  'Tours y turismo',
  'Florerías',
  'Clínicas dentales',
  'Constructoras',
  'Despachos',
  'Tiendas en línea',
  'Talleres',
  'Escuelas',
  'Servicios a domicilio',
]

export function Cinta() {
  const fila = [...giros, ...giros]
  return (
    <div className="overflow-hidden border-y border-[var(--line)] bg-surface py-5" aria-label="Giros de negocio para los que hacemos páginas web">
      <div className="cinta-giros flex w-max items-center" aria-hidden="true">
        {fila.map((g, i) => (
          <span key={i} className="flex items-center font-mono text-[0.78rem] uppercase tracking-[0.18em] text-white/70">
            <span className="px-8">{g}</span>
            <span className="text-accent">▲</span>
          </span>
        ))}
      </div>
    </div>
  )
}
