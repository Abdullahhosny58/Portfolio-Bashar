/**
 * SectionCamera — contextual 3D camera companion
 *
 * One canvas, one renderer. Per-section config defines where the camera sits,
 * what angle it shows, and how it enters/exits. Smooth Framer Motion transitions
 * between states. Hidden on viewports < 1320px to avoid overlapping content.
 *
 * Composition rule: camera always lives in the right gutter — the space between
 * the 1200px container edge and the viewport edge. On wide screens this is ~100–200px.
 */

import { useRef, useEffect, useState, Suspense, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, Bounds } from '@react-three/drei'
import { useCameraSection } from '../../context/CameraContext'

/* ─── Per-section camera configurations ─────────────────────────────────────
   Each entry defines:
   - top / bottom   : vertical anchor in vh units (viewport-relative)
   - size           : canvas size in px
   - opacity        : final opacity (camera is editorial, not dominant)
   - rotation       : target euler angles for the GLB model
   - enter          : initial animation state (where it comes FROM)
   - glow           : show warm gold ambient glow behind lens
   - blur           : apply slight CSS blur (depth-of-field feel)
────────────────────────────────────────────────────────────────────────── */
const CONFIGS = {
  about: {
    // About: photo LEFT, text RIGHT. Camera anchors to lower-right,
    // below the stats row — outside reading path, balanced with photo height.
    top: 62,           // vh
    size: 200,
    opacity: 0.72,
    rotation: { y: 0.55,  x: 0.04 },
    enter: { x: 28, opacity: 0 },
    glow: true,
    blur: false,
  },
  services: {
    // Services: full-width 4-card grid. Camera sits upper-right,
    // aligned with the section headline — outside the card grid below.
    top: 20,
    size: 170,
    opacity: 0.62,
    rotation: { y: -0.82, x: -0.09 },
    enter: { y: -22, opacity: 0 },
    glow: false,
    blur: true,
  },
  work: {
    // Work/Gallery: header + tabs, then grid. Camera right of header area,
    // above the card grid so it never overlaps images.
    top: 28,
    size: 158,
    opacity: 0.58,
    rotation: { y: 0.28,  x: 0.07 },
    enter: { x: 22, opacity: 0 },
    glow: false,
    blur: true,
  },
  contact: {
    // Contact: centered form with wide negative space on both sides.
    // Camera right-center — the empty side column is the ideal home.
    top: 44,
    size: 182,
    opacity: 0.68,
    rotation: { y: -0.32, x: 0.11 },
    enter: { x: 18, opacity: 0 },
    glow: true,
    blur: false,
  },
}

/* ─── 3D Model ──────────────────────────────────────────────────────────── */
function CameraModel({ targetRotation }) {
  const ref = useRef()
  const { scene } = useGLTF('/models/camera_canon_eos_400d.glb')
  const ry = useRef(targetRotation.y)
  const rx = useRef(targetRotation.x)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    // Spring toward target
    ry.current += (targetRotation.y - ry.current) * 0.04
    rx.current += (targetRotation.x - rx.current) * 0.04
    // Gentle idle float
    ref.current.rotation.y = ry.current + Math.sin(t * 0.22) * 0.05
    ref.current.rotation.x = rx.current + Math.sin(t * 0.17) * 0.018
    ref.current.rotation.z = Math.sin(t * 0.28) * 0.01
    ref.current.position.y = Math.sin(t * 0.65) * 0.055
  })

  return (
    <group ref={ref} dispose={null}>
      <Center><primitive object={scene} /></Center>
    </group>
  )
}

function Scene({ rotation }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 4]}  intensity={3.2} color="#fff5d6" castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={1.4} color="#c8d8ff" />
      <directionalLight position={[0, 3, -5]}  intensity={1.6} color="#e8c060" />
      <pointLight       position={[2, 1, 3]}   intensity={2.2} color="#c9a84c" distance={8} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.18}>
          <CameraModel targetRotation={rotation} />
        </Bounds>
      </Suspense>
    </>
  )
}

/* ─── Main component ────────────────────────────────────────────────────── */
export function SectionCamera() {
  const { activeSection, setActiveSection } = useCameraSection()
  const [isWide, setIsWide] = useState(() => window.innerWidth >= 1320)

  // Responsive: hide on narrow viewports
  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 1320)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Observe sections
  useEffect(() => {
    const IDS = ['contact', 'work', 'services', 'about', 'hero']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id) })
      },
      { threshold: 0.3 }
    )
    IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [setActiveSection])

  // Subtle parallax: camera drifts slightly upward as page scrolls
  const { scrollY } = useScroll()
  const driftY = useTransform(scrollY, [0, 6000], [0, -80])

  const config = CONFIGS[activeSection]
  const showCamera = isWide && !!config

  // Right gutter position:
  // On a 1440px viewport with 1200px container → 120px gutter each side.
  // We position the camera center at gutter midpoint from the right edge.
  // right = (viewport - container) / 2 / 2  ≈  viewport * 0.083 at 1440px
  // Using fixed value that works across 1320–1920px screens:
  const gutterRight = 'clamp(8px, calc((100vw - 1200px) / 4), 60px)'

  return (
    <AnimatePresence mode="wait">
      {showCamera && (
        <motion.div
          key={activeSection}
          initial={{ ...config.enter, scale: 0.92 }}
          animate={{ x: 0, y: 0, opacity: config.opacity, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, x: 16 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'fixed',
            right: gutterRight,
            top: `${config.top}vh`,
            width: config.size,
            height: config.size,
            zIndex: 40,
            pointerEvents: 'none',
            y: driftY,
            filter: config.blur ? 'blur(0.4px)' : 'none',
          }}
        >
          {/* Gold ambient glow */}
          {config.glow && (
            <div style={{
              position: 'absolute',
              inset: '-24px',
              background: 'radial-gradient(ellipse 65% 65% at 50% 55%, rgba(201,168,76,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
          )}

          {/* Lens edge highlight — editorial feel */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse 40% 35% at 35% 30%, rgba(255,245,210,0.07) 0%, transparent 60%)',
            pointerEvents: 'none',
            zIndex: 2,
          }} />

          {/* Three.js canvas */}
          <Canvas
            camera={{ position: [0, 0.1, 3.8], fov: 38 }}
            style={{ background: 'transparent', display: 'block' }}
            gl={{ antialias: true, alpha: true }}
          >
            <Scene rotation={config.rotation} />
          </Canvas>

          {/* Section label — minimal, refined */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            style={{
              position: 'absolute',
              bottom: '-22px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '8px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.35)',
              whiteSpace: 'nowrap',
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            {activeSection}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

useGLTF.preload('/models/camera_canon_eos_400d.glb')
export default SectionCamera
