// Ayuda de teclado al pie. Presentacional.
export default function Hint({ scientific }) {
  return (
    <p className="calc__hint">
      Teclado: números, + − * / ^ ! , Enter, Backspace, Esc{scientific ? ' · r = √, p = π' : ''}
    </p>
  )
}
