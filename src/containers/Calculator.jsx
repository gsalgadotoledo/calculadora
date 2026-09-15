import { useReducer } from 'react'
import { initialState, reducer } from '../logic/calculator.js'
import useKeyboard from '../hooks/useKeyboard.js'
import useScientificPref from '../hooks/useScientificPref.js'
import Toolbar from '../components/Toolbar.jsx'
import Display from '../components/Display.jsx'
import Keypad from '../components/Keypad.jsx'
import Hint from '../components/Hint.jsx'
import '../styles/calculator.css'

// El container: el único componente con estado y efectos.
// Tiene el reducer, la preferencia de modo y el teclado; deriva lo que la UI
// necesita y se lo pasa a componentes presentacionales como props.
export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [scientific, toggleScientific] = useScientificPref()
  useKeyboard(dispatch)

  // Derivados del estado, calculados aquí para que los componentes sólo pinten.
  const pending =
    state.operator && state.accumulator !== null
      ? `${state.accumulator} ${state.operator === '-' ? '−' : state.operator}`
      : ''
  const activeOperator = state.waitingForOperand ? state.operator : null

  return (
    <div className={`calc${scientific ? ' calc--sci' : ''}`} role="application" aria-label="Calculadora">
      <Toolbar scientific={scientific} angle={state.angle} onToggleScientific={toggleScientific} />
      <Display value={state.display} pending={pending} />
      <Keypad scientific={scientific} activeOperator={activeOperator} angle={state.angle} onKey={dispatch} />
      <Hint scientific={scientific} />
    </div>
  )
}
