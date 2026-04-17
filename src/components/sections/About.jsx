import { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function About() {
  const { t } = useTranslation()
  const sectionRef = useRef()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  // Smooth spring follow
  const x = useSpring(rawX, { stiffness: 60, damping: 22, mass: 1 })
  const y = useSpring(rawY, { stiffness: 60, damping: 22, mass: 1 })

  useEffect(() => {
    const onMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      const cx = (e.clientX - rect.left) / rect.width  - 0.5
      const cy = (e.clientY - rect.top)  / rect.height - 0.5
      rawX.set(cx * 28)   // max 28px drift X
      rawY.set(cy * 18)   // max 18px drift Y
    }
    const el = sectionRef.current
    el?.addEventListener('mousemove', onMove)
    return () => el?.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  const stats = [
    { value: t('about.stats.years'),   label: t('about.stats.years_label') },
    { value: t('about.stats.shoots'),  label: t('about.stats.shoots_label') },
    { value: t('about.stats.clients'), label: t('about.stats.clients_label') },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: 'relative',
        background: 'var(--clr-bg-2)',
        overflow: 'hidden',
        padding: '120px 0',
      }}
    >
      {/* ── Parallax background photo ── */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-40px',          // oversized so drift doesn't clip
          x, y,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <img
          src="/images/bashar.jpg"
          alt=""
          aria-hidden="true"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
            opacity: 0.09,
            filter: 'blur(2px) grayscale(20%)',
            display: 'block',
          }}
        />
      </motion.div>

      {/* ── Gradient vignette over photo ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 70% 80% at 50% 50%, transparent 30%, var(--clr-bg-2) 100%),
          linear-gradient(to bottom, var(--clr-bg-2) 0%, transparent 15%, transparent 85%, var(--clr-bg-2) 100%)
        `,
      }} />

      {/* ── Content ── */}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '80px',
          alignItems: 'center',
        }}>

          {/* Left — photo card with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: 'relative' }}
          >
            {/* Gold frame behind */}
            <div style={{
              position: 'absolute',
              top: 16, left: 16, right: -16, bottom: -16,
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: '2px', zIndex: 0,
            }} />

            {/* Photo */}
            <motion.div
              style={{
                position: 'relative', zIndex: 1,
                aspectRatio: '3/4',
                borderRadius: '2px',
                overflow: 'hidden',
                border: '1px solid rgba(201,168,76,0.2)',
                x: useSpring(useMotionValue(0), { stiffness: 80, damping: 25 }),
              }}
            >
              <motion.img
                src="/images/bashar.jpg"
                alt="Bashar Hani — Photographer and Cinematographer"
                style={{
                  width: '106%', height: '106%',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                  display: 'block',
                  marginLeft: '-3%',
                  marginTop: '-3%',
                  filter: 'brightness(0.88) contrast(1.08)',
                  x,
                  y,
                }}
              />
              {/* Bottom gradient */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '45%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
                pointerEvents: 'none',
              }} />
            </motion.div>

            {/* Gold corner */}
            <div style={{
              position: 'absolute', bottom: -20, right: -20, zIndex: 2,
              width: 72, height: 72,
              border: '1px solid var(--clr-gold)', borderRadius: '2px',
            }} />
          </motion.div>

          {/* Right — text */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
              <span className="gold-line" />
              <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--clr-gold)' }}>
                {t('about.label')}
              </span>
            </div>

            <h2 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 700, color: 'var(--clr-cream)',
              lineHeight: 1.2, marginBottom: '28px',
            }}>
              {t('about.title')}
            </h2>

            <p style={{ fontSize: '15px', color: 'var(--clr-muted)', lineHeight: 1.85, marginBottom: '18px' }}>
              {t('about.para1')}
            </p>
            <p style={{ fontSize: '15px', color: 'var(--clr-muted)', lineHeight: 1.85, marginBottom: '52px' }}>
              {t('about.para2')}
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex', gap: '48px', flexWrap: 'wrap',
              paddingTop: '32px',
              borderTop: '1px solid rgba(201,168,76,0.12)',
            }}>
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '44px', fontWeight: 700, lineHeight: 1,
                    background: 'var(--grad-gold)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '8px',
                  }}>
                    {value || '—'}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--clr-faint)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default About
