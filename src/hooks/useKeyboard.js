import { useEffect } from 'react'
import { keyToAction } from '../logic/calculator.js'

// Traduce teclas físicas a acciones del reducer y las despacha.
export default function useKeyboard(dispatch) {
  useEffect(() => {
    function onKeyDown(e) {
      const action = keyToAction(e.key)
      if (!action) return
      e.preventDefault()
      dispatch(action)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [dispatch])
}
