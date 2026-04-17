/**
 * ParticleBackground — global full-site particle canvas
 *
 * Sits at z-index: -1 (behind all page content).
 * Sections with transparent backgrounds let particles show through.
 * Sections with solid backgrounds (e.g. About) naturally block the canvas.
 *
 * Mouse interaction: particles scatter on approach, spring back to origin.
 */

import { useEffect, useRef } from 'react'

const COUNT    = 72
const MOUSE_R  = 180     // influence radius (px)
const PUSH     = 0.06    // repulsion strength
const RETURN   = 0.014   // spring-back speed
const DAMPING  = 0.86

function rand(min, max) { return Math.random() * (max - min) + min }

export function ParticleBackground() {
  const canvasRef = useRef()
  const mouse     = useRef({ x: -9999, y: -9999 })
  const particles = useRef([])
  const raf       = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    /* ── setup ── */
    const init = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight

      particles.current = Array.from({ length: COUNT }, () => {
        const ox = rand(0, canvas.width)
        const oy = rand(0, canvas.height)
        return {
          ox,  oy,
          x:   ox,  y:  oy,
          vx:  0,   vy: 0,
          r:   rand(0.5, 2.4),
          op:  rand(0.08, 0.28),    // higher opacity since we're truly behind content
          drift: rand(0.06, 0.28),
          phase: rand(0, Math.PI * 2),
        }
      })
    }

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }

    init()
    window.addEventListener('resize', resize)

    /* ── mouse ── */
    const onMove  = e => { mouse.current.x = e.clientX; mouse.current.y = e.clientY }
    const onLeave = () => { mouse.current.x = -9999; mouse.current.y = -9999 }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    /* ── loop ── */
    let t = 0
    const tick = () => {
      t += 0.011
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = mouse.current.x
      const my = mouse.current.y

      particles.current.forEach(p => {
        /* idle orbit around origin */
        const idleX = p.ox + Math.sin(t * p.drift + p.phase)        * 22
        const idleY = p.oy + Math.cos(t * p.drift * 0.65 + p.phase) * 14

        /* mouse repulsion */
        const dx   = p.x - mx
        const dy   = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_R && dist > 0.1) {
          const force = ((MOUSE_R - dist) / MOUSE_R) ** 1.4
          p.vx += (dx / dist) * force * PUSH * 18
          p.vy += (dy / dist) * force * PUSH * 18
        }

        /* spring back */
        p.vx += (idleX - p.x) * RETURN
        p.vy += (idleY - p.y) * RETURN

        /* damping */
        p.vx *= DAMPING
        p.vy *= DAMPING

        p.x += p.vx
        p.y += p.vy

        /* opacity pulse */
        const pulse = 0.72 + 0.28 * Math.sin(t * p.drift * 1.4 + p.phase)
        const alpha = p.op * pulse

        /* core dot */
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,168,76,${alpha.toFixed(3)})`
        ctx.fill()

        /* soft bokeh halo on larger particles */
        if (p.r > 1.5) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
          grad.addColorStop(0, `rgba(201,168,76,${(alpha * 0.22).toFixed(3)})`)
          grad.addColorStop(1, 'rgba(201,168,76,0)')
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }
      })

      raf.current = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         '100%',
        height:        '100%',
        zIndex:        -1,       // truly behind all page content
        pointerEvents: 'none',
      }}
    />
  )
}

export default ParticleBackground
