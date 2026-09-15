// Lógica pura de la calculadora: un reducer sin React, para poder probarla sola.

export const initialState = {
  display: '0',        // lo que se ve en pantalla
  accumulator: null,   // el operando izquierdo pendiente
  operator: null,      // '+', '-', '×', '÷'
  waitingForOperand: false, // true justo después de un operador o '='
  lastOperand: null,   // para repetir '=' (ej: 2 + 3 = = → 8)
  lastOperator: null,
}

const MAX_DIGITS = 12

function format(n) {
  if (!Number.isFinite(n)) return 'Error'
  // Evita basura de punto flotante (0.1 + 0.2) sin perder rango.
  const rounded = parseFloat(n.toPrecision(MAX_DIGITS))
  const s = String(rounded)
  return s.length > MAX_DIGITS + 6 ? rounded.toExponential(6) : s
}

export function compute(a, op, b) {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '×': return a * b
    case '÷': return b === 0 ? NaN : a / b
    default: return b
  }
}

export function reducer(state, action) {
  const { display } = state

  switch (action.type) {
    case 'digit': {
      if (display === 'Error') return { ...initialState, display: action.value }
      if (state.waitingForOperand) {
        return { ...state, display: action.value, waitingForOperand: false }
      }
      if (display.replace(/[-.]/g, '').length >= MAX_DIGITS) return state
      return { ...state, display: display === '0' ? action.value : display + action.value }
    }

    case 'decimal': {
      if (display === 'Error') return { ...initialState, display: '0.' }
      if (state.waitingForOperand) return { ...state, display: '0.', waitingForOperand: false }
      if (display.includes('.')) return state
      return { ...state, display: display + '.' }
    }

    case 'operator': {
      if (display === 'Error') return state
      const current = parseFloat(display)
      // Cambiar de operador sin haber tecleado un segundo operando.
      if (state.operator && state.waitingForOperand) {
        return { ...state, operator: action.value }
      }
      if (state.accumulator === null || state.operator === null) {
        return { ...state, accumulator: current, operator: action.value, waitingForOperand: true, lastOperand: null }
      }
      const result = compute(state.accumulator, state.operator, current)
      return {
        ...state,
        display: format(result),
        accumulator: Number.isFinite(result) ? result : null,
        operator: Number.isFinite(result) ? action.value : null,
        waitingForOperand: true,
        lastOperand: null,
      }
    }

    case 'equals': {
      if (display === 'Error') return state
      const current = parseFloat(display)
      let a, op, b
      if (state.operator !== null && state.accumulator !== null) {
        a = state.accumulator; op = state.operator
        b = state.waitingForOperand && state.lastOperand !== null ? state.lastOperand : current
      } else if (state.lastOperand !== null && state.lastOperator) {
        // Repetir la última operación al volver a pulsar '='.
        a = current; op = state.lastOperator; b = state.lastOperand
      } else {
        return state
      }
      const result = compute(a, op, b)
      return {
        ...initialState,
        display: format(result),
        lastOperand: b,
        lastOperator: op,
        waitingForOperand: true,
      }
    }

    case 'clear':
      return initialState

    case 'backspace': {
      if (display === 'Error' || state.waitingForOperand) return state
      const next = display.length > 1 ? display.slice(0, -1) : '0'
      return { ...state, display: next === '-' ? '0' : next }
    }

    case 'negate': {
      if (display === 'Error' || display === '0') return state
      return { ...state, display: display.startsWith('-') ? display.slice(1) : '-' + display, waitingForOperand: false }
    }

    case 'percent': {
      if (display === 'Error') return state
      return { ...state, display: format(parseFloat(display) / 100), waitingForOperand: false }
    }

    default:
      return state
  }
}

// Traduce una tecla del teclado a una acción; null si no aplica.
export function keyToAction(key) {
  if (/^[0-9]$/.test(key)) return { type: 'digit', value: key }
  switch (key) {
    case '.': case ',': return { type: 'decimal' }
    case '+': return { type: 'operator', value: '+' }
    case '-': return { type: 'operator', value: '-' }
    case '*': case 'x': case '×': return { type: 'operator', value: '×' }
    case '/': case '÷': return { type: 'operator', value: '÷' }
    case 'Enter': case '=': return { type: 'equals' }
    case 'Backspace': return { type: 'backspace' }
    case 'Escape': case 'Delete': case 'c': case 'C': return { type: 'clear' }
    case '%': return { type: 'percent' }
    default: return null
  }
}
