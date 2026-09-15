// Configuración de las teclas: qué muestran y qué acción despachan.
// Es sólo datos; quién despacha es el container.

export const BASIC_BUTTONS = [
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
// La tecla `angle` muestra el modo actual ('deg' | 'rad'); el container le pone la etiqueta.
export const SCI_BUTTONS = [
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
