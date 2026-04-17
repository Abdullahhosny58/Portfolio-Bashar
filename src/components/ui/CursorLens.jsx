import { useEffect, useRef } from 'react'

export function CursorLens() {
  const outerRef = useRef(null)
  const dotRef   = useRef(null)
  const target = useRef({ x: -200, y: -200 })
  const outer  = useRef({ x: -200, y: -200 })
  const dot    = useRef({ x: -200, y: -200 })

  useEffect(() => {
    const onMove = (e) => { target.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove, { passive: true })

    let raf
    const tick = () => {
      outer.current.x += (target.current.x - outer.current.x) * 0.07
      outer.current.y += (target.current.y - outer.current.y) * 0.07
      dot.current.x   += (target.current.x - dot.current.x)   * 0.22
      dot.current.y   += (target.current.y - dot.current.y)   * 0.22

      if (outerRef.current) {
        outerRef.current.style.transform =
          'translate(' + (outer.current.x - 20) + 'px,' + (outer.current.y - 20) + 'px)'
      }
      if (dotRef.current) {
        dotRef.current.style.transform =
          'translate(' + (dot.current.x - 3) + 'px,' + (dot.current.y - 3) + 'px)'
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      {/* Aperture ring */}
      <div ref={outerRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: 40, height: 40,
        border: '1px solid rgba(201,168,76,0.6)',
        borderRadius: '50%',
        pointerEvents: 'none', zIndex: 99999,
        willChange: 'transform',
        mixBlendMode: 'difference',
      }} />
      {/* Center dot */}
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: 6, height: 6,
        background: 'var(--clr-gold)',
        borderRadius: '50%',
        pointerEvents: 'none', zIndex: 99999,
        willChange: 'transform',
      }} />
    </>
  )
}

export default CursorLens
