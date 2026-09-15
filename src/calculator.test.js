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
