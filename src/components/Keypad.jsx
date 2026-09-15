import Key from './Key.jsx'
import { BASIC_BUTTONS, SCI_BUTTONS } from './buttons.js'

// El teclado. Presentacional: recibe qué operador está activo y el modo de
// ángulo para pintar, y un único callback `onKey(action)` para avisar.
export default function Keypad({ scientific, activeOperator, angle, onKey }) {
  const renderKey = (b) => (
    <Key
      key={b.label}
      label={b.label === 'angle' ? angle : b.label}
      name={b.name}
      kind={b.kind}
      wide={b.wide}
      active={b.kind === 'op' && b.action.value === activeOperator}
      onPress={() => onKey(b.action)}
    />
  )

  return (
    <div className="calc__keys">
      {scientific && <div className="calc__sci">{SCI_BUTTONS.map(renderKey)}</div>}
      <div className="calc__basic">{BASIC_BUTTONS.map(renderKey)}</div>
    </div>
  )
}
