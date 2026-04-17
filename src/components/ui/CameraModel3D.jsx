import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, ContactShadows, Center, Bounds } from '@react-three/drei'

function CameraGLB({ mouse }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/models/camera_canon_eos_400d.glb')

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Floating up/down
    groupRef.current.position.y = Math.sin(t * 0.7) * 0.08

    // Auto rotate + mouse parallax
    groupRef.current.rotation.y = -0.45 + Math.sin(t * 0.2) * 0.12 + mouse.current.x * 0.22
    groupRef.current.rotation.x = -0.08 + mouse.current.y * 0.09 + Math.sin(t * 0.15) * 0.03
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.015
  })

  return (
    <group ref={groupRef} dispose={null}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  )
}

function Fallback() {
  const ref = useRef()
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.5, 0.07, 16, 60]} />
      <meshStandardMaterial color="#c9a84c" emissive="#c9a84c" emissiveIntensity={0.5} />
    </mesh>
  )
}

function Scene({ mouse }) {
  return (
    <>
      {/* Base ambient */}
      <ambientLight intensity={1.8} />

      {/* Key light — warm golden from top-front-right */}
      <directionalLight
        position={[4, 6, 4]}
        intensity={4}
        color="#fff5d6"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Fill light — cool from left */}
      <directionalLight position={[-4, 2, -2]} intensity={1.8} color="#c8d8ff" />
      {/* Rim light — golden from back */}
      <directionalLight position={[0, 3, -5]} intensity={2} color="#e8c060" />
      {/* Bottom bounce */}
      <directionalLight position={[0, -4, 3]} intensity={0.8} color="#ffffff" />
      {/* Gold point light for shimmer */}
      <pointLight position={[2, 1, 3]} intensity={3} color="#c9a84c" distance={8} />

      <Suspense fallback={<Fallback />}>
        <Bounds fit clip observe margin={1.15}>
          <CameraGLB mouse={mouse} />
        </Bounds>
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.25}
          scale={5}
          blur={3.5}
          color="#c9a84c"
        />
      </Suspense>
    </>
  )
}

export function CameraModel3D() {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0.1, 3.8], fov: 38 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/camera_canon_eos_400d.glb')

export default CameraModel3D
