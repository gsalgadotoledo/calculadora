// Una tecla. Presentacional: sólo props → <button>. No sabe qué hace su acción.
export default function Key({ label, name, kind, wide = false, active = false, onPress }) {
  const cls = [
    'calc__key',
    kind ? `calc__key--${kind}` : '',
    wide ? 'calc__key--wide' : '',
    active ? 'is-active' : '',
  ].filter(Boolean).join(' ')

  return (
    <button type="button" className={cls} aria-label={name} onClick={onPress}>
      {label}
    </button>
  )
}
