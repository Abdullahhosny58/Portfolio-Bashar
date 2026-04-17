import { useRef, useEffect, useState, Suspense } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, Bounds } from '@react-three/drei'
import { useCameraSection } from '../../context/CameraContext'

// Section IDs in order — each one gives the camera a different angle
const SECTION_ROTATIONS = {
  hero:     { y: -0.45, x: -0.08 },
  about:    { y:  0.6,  x:  0.05 },
  services: { y: -0.8,  x: -0.1  },
  work:     { y:  0.2,  x:  0.08 },
  contact:  { y: -0.3,  x:  0.12 },
}

/* ── 3D model that animates to a target rotation ── */
function CameraGLB({ target }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/camera_canon_eos_400d.glb')

  // Current rotation (springs toward target)
  const currentY = useRef(target.y)
  const currentX = useRef(target.x)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Spring toward target rotation
    currentY.current += (target.y - currentY.current) * 0.035
    currentX.current += (target.x - currentX.current) * 0.035

    groupRef.current.rotation.y = currentY.current + Math.sin(t * 0.25) * 0.06
    groupRef.current.rotation.x = currentX.current + Math.sin(t * 0.18) * 0.02
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.012
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.06
  })

  return (
    <group ref={groupRef} dispose={null}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  )
}

function Scene({ target }) {
  return (
    <>
      <ambientLight intensity={1.6} />
      <directionalLight position={[4, 6, 4]} intensity={3.5} color="#fff5d6" castShadow />
      <directionalLight position={[-4, 2, -2]} intensity={1.5} color="#c8d8ff" />
      <directionalLight position={[0, 3, -5]} intensity={1.8} color="#e8c060" />
      <pointLight position={[2, 1, 3]} intensity={2.5} color="#c9a84c" distance={8} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.2}>
          <CameraGLB target={target} />
        </Bounds>
      </Suspense>
    </>
  )
}

export function FloatingCamera() {
  const { scrollY } = useScroll()
  const { setActiveSection } = useCameraSection()
  const [localSection, setLocalSection] = useState('hero')
  const [visible, setVisible] = useState(false)

  // Fade in after scrolling ~60% of hero height
  useEffect(() => {
    const unsub = scrollY.on('change', (y) => {
      setVisible(y > window.innerHeight * 0.55)
    })
    return unsub
  }, [scrollY])

  // Track which section is in view — broadcast via context
  useEffect(() => {
    const sections = ['contact', 'work', 'services', 'about', 'hero']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLocalSection(entry.target.id)
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.35 }
    )
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [setActiveSection])

  // Subtle vertical drift with scroll
  const rawY = useTransform(scrollY, [0, 4000], [0, -120])
  const smoothY = useSpring(rawY, { stiffness: 40, damping: 20 })

  const target = SECTION_ROTATIONS[localSection] || SECTION_ROTATIONS.hero

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 40 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'fixed',
        right: '2vw',
        top: '50%',
        translateY: '-50%',
        y: smoothY,
        width: '220px',
        height: '220px',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      {/* Subtle gold glow behind */}
      <div style={{
        position: 'absolute', inset: '-20px',
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <Canvas
        camera={{ position: [0, 0.1, 3.8], fov: 38 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene target={target} />
      </Canvas>

      {/* Section label */}
      <motion.div
        key={localSection}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          bottom: '-28px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '9px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(201,168,76,0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        {localSection}
      </motion.div>
    </motion.div>
  )
}

useGLTF.preload('/models/camera_canon_eos_400d.glb')

export default FloatingCamera
