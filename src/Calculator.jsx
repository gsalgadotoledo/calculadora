import { useEffect, useReducer } from 'react'
import { initialState, reducer, keyToAction } from './calculator.js'
import './Calculator.css'

const BUTTONS = [
  { label: 'C', action: { type: 'clear' }, kind: 'fn' },
  { label: '±', action: { type: 'negate' }, kind: 'fn' },
  { label: '%', action: { type: 'percent' }, kind: 'fn' },
  { label: '÷', action: { type: 'operator', value: '÷' }, kind: 'op' },

  { label: '7', action: { type: 'digit', value: '7' } },
  { label: '8', action: { type: 'digit', value: '8' } },
  { label: '9', action: { type: 'digit', value: '9' } },
  { label: '×', action: { type: 'operator', value: '×' }, kind: 'op' },

  { label: '4', action: { type: 'digit', value: '4' } },
  { label: '5', action: { type: 'digit', value: '5' } },
  { label: '6', action: { type: 'digit', value: '6' } },
  { label: '−', action: { type: 'operator', value: '-' }, kind: 'op' },

  { label: '1', action: { type: 'digit', value: '1' } },
  { label: '2', action: { type: 'digit', value: '2' } },
  { label: '3', action: { type: 'digit', value: '3' } },
  { label: '+', action: { type: 'operator', value: '+' }, kind: 'op' },

  { label: '0', action: { type: 'digit', value: '0' }, wide: true },
  { label: '.', action: { type: 'decimal' } },
  { label: '=', action: { type: 'equals' }, kind: 'eq' },
]

export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    function onKeyDown(e) {
      const action = keyToAction(e.key)
      if (!action) return
      e.preventDefault()
      dispatch(action)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const pending =
    state.operator && state.accumulator !== null
      ? `${state.accumulator} ${state.operator === '-' ? '−' : state.operator}`
      : ''

  return (
    <div className="calc" role="application" aria-label="Calculadora">
      <div className="calc__screen">
        <div className="calc__pending" aria-hidden="true">{pending || ' '}</div>
        <output className="calc__display" aria-live="polite" data-length={state.display.length}>
          {state.display}
        </output>
      </div>
      <div className="calc__keys">
        {BUTTONS.map((b) => {
          const active = b.kind === 'op' && state.operator === b.action.value && state.waitingForOperand
          const cls = [
            'calc__key',
            b.kind ? `calc__key--${b.kind}` : '',
            b.wide ? 'calc__key--wide' : '',
            active ? 'is-active' : '',
          ].filter(Boolean).join(' ')
          return (
            <button key={b.label} type="button" className={cls} onClick={() => dispatch(b.action)}>
              {b.label}
            </button>
          )
        })}
      </div>
      <p className="calc__hint">Teclado: números, + − * / , Enter, Backspace, Esc</p>
    </div>
  )
}
