// Lógica pura de la calculadora: un reducer sin React, para poder probarla sola.

export const initialState = {
  display: '0',        // lo que se ve en pantalla
  value: null,         // el número exacto detrás de display cuando viene de un cálculo (π, sin, resultados)
  accumulator: null,   // el operando izquierdo pendiente
  operator: null,      // '+', '-', '×', '÷'
  waitingForOperand: false, // true justo después de un operador o '='
  lastOperand: null,   // para repetir '=' (ej: 2 + 3 = = → 8)
  lastOperator: null,
  angle: 'deg',        // 'deg' | 'rad' — para sin/cos/tan del modo científico
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
    case '^': return a ** b
    default: return b
  }
}

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN
  if (n > 170) return Infinity
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

// Funciones de un solo operando del modo científico.
// Las trigonométricas reciben el ángulo en la unidad indicada.
export function applyUnary(fn, x, angle = 'deg') {
  const toRad = angle === 'deg' ? Math.PI / 180 : 1
  // sin(π) da 1.2e-16 en coma flotante: lo dejamos en 0 limpio.
  const trig = (v) => (Math.abs(v) < 1e-14 ? 0 : v)
  switch (fn) {
    case 'sin': return trig(Math.sin(x * toRad))
    case 'cos': return trig(Math.cos(x * toRad))
    case 'tan': return trig(Math.tan(x * toRad))
    case 'ln': return x > 0 ? Math.log(x) : NaN
    case 'log': return x > 0 ? Math.log10(x) : NaN
    case 'sqrt': return x >= 0 ? Math.sqrt(x) : NaN
    case 'square': return x * x
    case 'inv': return x === 0 ? NaN : 1 / x
    case 'fact': return factorial(x)
    case 'exp': return Math.exp(x)
    case 'pow10': return 10 ** x
    default: return x
  }
}

export const CONSTANTS = { pi: Math.PI, e: Math.E }

// Estado limpio que conserva las preferencias (deg/rad) del usuario.
const reset = (state) => ({ ...initialState, angle: state.angle })

// El operando actual: el valor exacto si lo hay, si no lo que se tecleó.
const current = (state) => (state.value ?? parseFloat(state.display))

// Campos de pantalla para un resultado numérico.
const show = (n) => ({ display: format(n), value: Number.isFinite(n) ? n : null })

export function reducer(state, action) {
  const { display } = state

  switch (action.type) {
    case 'digit': {
      if (display === 'Error') return { ...reset(state), display: action.value }
      if (state.waitingForOperand) {
        return { ...state, display: action.value, value: null, waitingForOperand: false }
      }
      if (display.replace(/[-.]/g, '').length >= MAX_DIGITS) return state
      return { ...state, display: display === '0' ? action.value : display + action.value, value: null }
    }

    case 'decimal': {
      if (display === 'Error') return { ...reset(state), display: '0.' }
      if (state.waitingForOperand) return { ...state, display: '0.', value: null, waitingForOperand: false }
      if (display.includes('.')) return state
      return { ...state, display: display + '.', value: null }
    }

    case 'operator': {
      if (display === 'Error') return state
      const cur = current(state)
      // Cambiar de operador sin haber tecleado un segundo operando.
      if (state.operator && state.waitingForOperand) {
        return { ...state, operator: action.value }
      }
      if (state.accumulator === null || state.operator === null) {
        return { ...state, accumulator: cur, operator: action.value, waitingForOperand: true, lastOperand: null }
      }
      const result = compute(state.accumulator, state.operator, cur)
      return {
        ...state,
        ...show(result),
        accumulator: Number.isFinite(result) ? result : null,
        operator: Number.isFinite(result) ? action.value : null,
        waitingForOperand: true,
        lastOperand: null,
      }
    }

    case 'equals': {
      if (display === 'Error') return state
      const cur = current(state)
      let a, op, b
      if (state.operator !== null && state.accumulator !== null) {
        a = state.accumulator; op = state.operator
        b = state.waitingForOperand && state.lastOperand !== null ? state.lastOperand : cur
      } else if (state.lastOperand !== null && state.lastOperator) {
        // Repetir la última operación al volver a pulsar '='.
        a = cur; op = state.lastOperator; b = state.lastOperand
      } else {
        return state
      }
      const result = compute(a, op, b)
      return {
        ...reset(state),
        ...show(result),
        lastOperand: b,
        lastOperator: op,
        waitingForOperand: true,
      }
    }

    case 'clear':
      return reset(state)

    case 'backspace': {
      if (display === 'Error' || state.waitingForOperand) return state
      const next = display.length > 1 ? display.slice(0, -1) : '0'
      return { ...state, display: next === '-' ? '0' : next, value: null }
    }

    case 'negate': {
      if (display === 'Error' || display === '0') return state
      return {
        ...state,
        display: display.startsWith('-') ? display.slice(1) : '-' + display,
        value: state.value === null ? null : -state.value,
        waitingForOperand: false,
      }
    }

    case 'percent': {
      if (display === 'Error') return state
      return { ...state, ...show(current(state) / 100), waitingForOperand: false }
    }

    // --- modo científico ---

    case 'unary': {
      if (display === 'Error') return state
      const result = applyUnary(action.value, current(state), state.angle)
      // El resultado reemplaza al operando actual; el siguiente dígito empieza uno nuevo.
      return { ...state, ...show(result), waitingForOperand: true }
    }

    case 'constant': {
      const value = CONSTANTS[action.value]
      if (value === undefined) return state
      const base = display === 'Error' ? reset(state) : state
      return { ...base, ...show(value), waitingForOperand: true }
    }

    case 'toggleAngle':
      return { ...state, angle: state.angle === 'deg' ? 'rad' : 'deg' }

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
    case '^': return { type: 'operator', value: '^' }
    case '!': return { type: 'unary', value: 'fact' }
    case 'r': return { type: 'unary', value: 'sqrt' }
    case 'p': return { type: 'constant', value: 'pi' }
    case 'Enter': case '=': return { type: 'equals' }
    case 'Backspace': return { type: 'backspace' }
    case 'Escape': case 'Delete': case 'c': case 'C': return { type: 'clear' }
    case '%': return { type: 'percent' }
    default: return null
  }
}
