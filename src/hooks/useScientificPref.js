import { useEffect, useState } from 'react'

const KEY = 'calc:scientific'

function read() {
  try { return localStorage.getItem(KEY) === '1' } catch { return false }
}

// ¿Modo científico? Se recuerda en localStorage entre visitas.
export default function useScientificPref() {
  const [scientific, setScientific] = useState(read)

  useEffect(() => {
    try { localStorage.setItem(KEY, scientific ? '1' : '0') } catch { /* modo privado, da igual */ }
  }, [scientific])

  const toggle = () => setScientific((v) => !v)
  return [scientific, toggle]
}
