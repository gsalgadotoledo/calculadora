import { test } from 'node:test'
import assert from 'node:assert/strict'
import { initialState, reducer, keyToAction } from './calculator.js'

// Teclea una secuencia como string ("12+3=") y devuelve la pantalla final.
function run(keys) {
  let s = initialState
  for (const k of keys) {
    const action = keyToAction(k === '=' ? 'Enter' : k)
    assert.ok(action, `tecla sin acción: ${k}`)
    s = reducer(s, action)
  }
  return s.display
}

test('suma básica', () => assert.equal(run('12+3='), '15'))
test('resta con negativo', () => assert.equal(run('3-5='), '-2'))
test('multiplicación y división', () => {
  assert.equal(run('6*7='), '42')
  assert.equal(run('9/4='), '2.25')
})
test('encadena operaciones sin pulsar =', () => assert.equal(run('2+3*4='), '20'))
test('punto flotante limpio', () => assert.equal(run('0.1+0.2='), '0.3'))
test('división por cero da Error y se recupera', () => {
  let s = initialState
  for (const k of '5/0') s = reducer(s, keyToAction(k))
  s = reducer(s, { type: 'equals' })
  assert.equal(s.display, 'Error')
  s = reducer(s, keyToAction('7'))
  assert.equal(s.display, '7')
})
test('repetir = repite la última operación', () => assert.equal(run('2+3=='), '8'))
test('cambiar de operador antes del segundo operando', () => assert.equal(run('8+*2='), '16'))
test('no duplica el punto decimal', () => assert.equal(run('1..5'), '1.5'))
test('backspace y clear', () => {
  let s = initialState
  for (const k of '123') s = reducer(s, keyToAction(k))
  s = reducer(s, keyToAction('Backspace'))
  assert.equal(s.display, '12')
  s = reducer(s, keyToAction('Escape'))
  assert.equal(s.display, '0')
})
test('negar y porcentaje', () => {
  let s = initialState
  for (const k of '50') s = reducer(s, keyToAction(k))
  s = reducer(s, { type: 'negate' })
  assert.equal(s.display, '-50')
  s = reducer(s, { type: 'percent' })
  assert.equal(s.display, '-0.5')
})
test('límite de dígitos', () => assert.equal(run('1234567890123456'), '123456789012'))

// --- modo científico ---

// Teclea `keys` y luego aplica una función de un operando.
function unary(keys, fn, state = initialState) {
  let s = state
  for (const k of keys) s = reducer(s, keyToAction(k))
  return reducer(s, { type: 'unary', value: fn })
}

test('trigonometría en grados por defecto', () => {
  assert.equal(unary('90', 'sin').display, '1')
  assert.equal(unary('60', 'cos').display, '0.5')
  assert.equal(unary('45', 'tan').display, '1')
  assert.equal(unary('180', 'sin').display, '0') // no 1.2e-16
})
test('deg/rad se conmuta y sobrevive a C y =', () => {
  let s = reducer(initialState, { type: 'toggleAngle' })
  assert.equal(s.angle, 'rad')
  s = reducer(s, { type: 'constant', value: 'pi' })
  s = reducer(s, { type: 'unary', value: 'sin' })
  assert.equal(s.display, '0')
  s = reducer(s, { type: 'clear' })
  assert.equal(s.angle, 'rad')
  s = reducer(s, { type: 'toggleAngle' })
  assert.equal(s.angle, 'deg')
})
test('logaritmos, raíz, cuadrado, inverso', () => {
  assert.equal(unary('100', 'log').display, '2')
  assert.equal(unary('1', 'ln').display, '0')
  assert.equal(unary('81', 'sqrt').display, '9')
  assert.equal(unary('12', 'square').display, '144')
  assert.equal(unary('8', 'inv').display, '0.125')
})
test('dominio inválido da Error', () => {
  const neg4 = reducer(unary('4', 'noop'), { type: 'negate' })
  assert.equal(neg4.display, '-4')
  assert.equal(reducer(neg4, { type: 'unary', value: 'sqrt' }).display, 'Error')
  assert.equal(unary('0', 'ln').display, 'Error')
  assert.equal(unary('0', 'inv').display, 'Error')
  assert.equal(unary('2.5', 'fact').display, 'Error')
  assert.equal(unary('200', 'fact').display, 'Error')
})
test('factorial, exponenciales y potencia', () => {
  assert.equal(unary('5', 'fact').display, '120')
  assert.equal(unary('0', 'fact').display, '1')
  assert.equal(unary('3', 'pow10').display, '1000')
  assert.equal(unary('0', 'exp').display, '1')
  assert.equal(run('2^10='), '1024')
  assert.equal(run('2^0.5^2='), '2') // encadena por la izquierda
})
test('constantes y continuar operando', () => {
  let s = reducer(initialState, { type: 'constant', value: 'pi' })
  assert.equal(s.display, '3.14159265359')
  s = reducer(s, keyToAction('5')) // reemplaza, no concatena
  assert.equal(s.display, '5')
  s = reducer(s, { type: 'constant', value: 'e' })
  assert.equal(s.display, '2.71828182846')
  assert.equal(run('p*2='), '6.28318530718')
})
test('el valor exacto sobrevive a la pantalla redondeada', () => {
  // π en pantalla son 12 dígitos, pero sin(π) debe usar el π completo.
  let s = reducer(initialState, { type: 'toggleAngle' })
  s = reducer(s, { type: 'constant', value: 'pi' })
  s = reducer(s, { type: 'negate' })
  s = reducer(s, { type: 'unary', value: 'sin' })
  assert.equal(s.display, '0')
  // ...pero teclear encima descarta el valor exacto.
  s = reducer(s, keyToAction('3'))
  assert.equal(s.value, null)
})
test('unaria dentro de una operación pendiente', () => {
  let s = initialState
  for (const k of '2+9') s = reducer(s, keyToAction(k))
  s = reducer(s, { type: 'unary', value: 'sqrt' })
  s = reducer(s, { type: 'equals' })
  assert.equal(s.display, '5')
  assert.equal(run('3!+1='), '7')
  assert.equal(run('16r'), '4')
})
