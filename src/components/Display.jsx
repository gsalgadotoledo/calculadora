// La pantalla: operación pendiente arriba, número actual abajo. Presentacional.
export default function Display({ value, pending = '' }) {
  return (
    <div className="calc__screen">
      <div className="calc__pending" aria-hidden="true">{pending || ' '}</div>
      <output className="calc__display" aria-live="polite" data-length={value.length}>
        {value}
      </output>
    </div>
  )
}
