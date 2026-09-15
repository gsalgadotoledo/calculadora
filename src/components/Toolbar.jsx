// Barra superior: botón «Científica» e indicador DEG/RAD. Presentacional.
export default function Toolbar({ scientific, angle, onToggleScientific }) {
  return (
    <div className="calc__bar">
      <button
        type="button"
        className={`calc__toggle${scientific ? ' is-on' : ''}`}
        aria-pressed={scientific}
        onClick={onToggleScientific}
      >
        <span aria-hidden="true">🍄 </span>Científica
      </button>
      <span className="calc__angle" aria-live="polite">{scientific ? angle.toUpperCase() : ''}</span>
    </div>
  )
}
