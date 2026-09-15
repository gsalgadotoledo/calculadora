import { useEffect, useReducer, useState } from 'react'
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

// Tres columnas que aparecen a la izquierda en modo científico, fila a fila.
const SCI_BUTTONS = [
  { label: 'angle', action: { type: 'toggleAngle' }, name: 'Grados o radianes' },
  { label: 'sin', action: { type: 'unary', value: 'sin' } },
  { label: 'cos', action: { type: 'unary', value: 'cos' } },

  { label: 'tan', action: { type: 'unary', value: 'tan' } },
  { label: 'ln', action: { type: 'unary', value: 'ln' } },
  { label: 'log', action: { type: 'unary', value: 'log' } },

  { label: 'sqrt', action: { type: 'unary', value: 'sqrt' }, name: 'Raíz cuadrada' },
  { label: 'x^2', action: { type: 'unary', value: 'square' }, name: 'Cuadrado' },
  { label: 'x^y', action: { type: 'operator', value: '^' }, name: 'Potencia', kind: 'op' },

  { label: '1/x', action: { type: 'unary', value: 'inv' }, name: 'Inverso' },
  { label: 'x!', action: { type: 'unary', value: 'fact' }, name: 'Factorial' },
  { label: 'π', action: { type: 'constant', value: 'pi' } },

  { label: 'e^x', action: { type: 'unary', value: 'exp' }, name: 'e elevado a x' },
  { label: '10^x', action: { type: 'unary', value: 'pow10' }, name: '10 elevado a x' },
  { label: 'e', action: { type: 'constant', value: 'e' } },
]

const SCI_KEY = 'calc:scientific'

function readSciPref() {
  try { return localStorage.getItem(SCI_KEY) === '1' } catch { return false }
}

export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [scientific, setScientific] = useState(readSciPref)

  useEffect(() => {
    try { localStorage.setItem(SCI_KEY, scientific ? '1' : '0') } catch { /* modo privado, da igual */ }
  }, [scientific])

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

  const renderKey = (b) => {
    const active = b.kind === 'op' && state.operator === b.action.value && state.waitingForOperand
    const cls = [
      'calc__key',
      b.kind ? `calc__key--${b.kind}` : '',
      b.wide ? 'calc__key--wide' : '',
      active ? 'is-active' : '',
    ].filter(Boolean).join(' ')
    const label = b.label === 'angle' ? (state.angle === 'deg' ? 'deg' : 'rad') : b.label
    return (
      <button key={b.label} type="button" className={cls} aria-label={b.name} onClick={() => dispatch(b.action)}>
        {label}
      </button>
    )
  }

  return (
    <div className={`calc${scientific ? ' calc--sci' : ''}`} role="application" aria-label="Calculadora">
      <div className="calc__bar">
        <button
          type="button"
          className={`calc__toggle${scientific ? ' is-on' : ''}`}
          aria-pressed={scientific}
          onClick={() => setScientific((v) => !v)}
        >
          <span aria-hidden="true">🍄 </span>Científica
        </button>
        <span className="calc__angle" aria-live="polite">{scientific ? state.angle.toUpperCase() : ''}</span>
      </div>
      <div className="calc__screen">
        <div className="calc__pending" aria-hidden="true">{pending || ' '}</div>
        <output className="calc__display" aria-live="polite" data-length={state.display.length}>
          {state.display}
        </output>
      </div>
      <div className="calc__keys">
        {scientific && <div className="calc__sci">{SCI_BUTTONS.map(renderKey)}</div>}
        <div className="calc__basic">{BUTTONS.map(renderKey)}</div>
      </div>
      <p className="calc__hint">
        Teclado: números, + − * / ^ ! , Enter, Backspace, Esc{scientific ? ' · r = √, p = π' : ''}
      </p>
    </div>
  )
}
