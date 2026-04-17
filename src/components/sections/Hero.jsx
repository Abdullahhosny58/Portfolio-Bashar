import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CameraModel3D } from '../ui/CameraModel3D'

export function Hero() {
  const { t } = useTranslation()
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  return (
    <section id="hero" style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      background: 'transparent',
      overflow: 'hidden',
    }}>
      {/* Gold radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 55% at 68% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)',
      }} />

      {/* Horizontal lines */}
      {[20, 40, 60, 80].map(pct => (
        <div key={pct} style={{
          position: 'absolute', left: 0, right: 0,
          top: pct + '%', height: '1px',
          background: 'rgba(201,168,76,0.04)',
          pointerEvents: 'none',
        }} />
      ))}

      <div className="container" style={{
        position: 'relative', zIndex: 1,
        paddingTop: isMobile ? '88px' : '100px',
        paddingBottom: isMobile ? '72px' : '60px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '0' : '48px',
        alignItems: 'center',
      }}>

        {/* ─── Left: Text ─── */}
        <div>
          {/* Greeting label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}
          >
            <span className="gold-line" />
            <span style={{
              fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--clr-gold)',
            }}>
              {t('hero.greeting')}
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: isMobile ? 'clamp(38px, 11vw, 56px)' : 'clamp(44px, 7vw, 96px)',
              fontWeight: 700, lineHeight: 1.05,
              color: 'var(--clr-cream)',
              letterSpacing: '-0.02em',
              marginBottom: '8px',
            }}
          >
            {t('hero.name')}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(16px, 2.2vw, 26px)',
              fontStyle: 'italic', fontWeight: 400,
              color: 'var(--clr-gold)', marginBottom: '28px',
            }}
          >
            {t('hero.tagline')}
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            style={{
              fontSize: '15px', color: 'var(--clr-muted)',
              maxWidth: '380px', lineHeight: 1.75,
              marginBottom: isMobile ? '28px' : '52px',
            }}
          >
            {t('hero.sub')}
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#work"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '14px 36px',
              border: '1px solid var(--clr-gold)',
              color: 'var(--clr-gold)',
              fontSize: '12px', fontWeight: 600, letterSpacing: '0.14em',
              textTransform: 'uppercase',
              background: 'transparent',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--clr-gold)'
              e.currentTarget.style.color = '#080808'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--clr-gold)'
            }}
          >
            {t('hero.cta')}
            <span style={{ fontSize: '18px', lineHeight: 1 }}>&rarr;</span>
          </motion.a>

          {/* ── Quick contact chips ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '24px' }}
          >
            {[
              {
                href: 'mailto:Basharhany4@gmail.com',
                label: 'Basharhany4@gmail.com',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                ),
              },
              {
                href: 'https://wa.me/201067110033',
                label: '+20 1067 110033',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                ),
              },
              {
                href: 'https://instagram.com/basharforashoot',
                label: '@basharforashoot',
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                ),
              },
            ].map(chip => (
              <a
                key={chip.href}
                href={chip.href}
                target={chip.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '7px 14px',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '2px',
                  color: 'var(--clr-muted)',
                  fontSize: '11px', letterSpacing: '0.06em',
                  background: 'rgba(201,168,76,0.04)',
                  transition: 'all 0.22s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'
                  e.currentTarget.style.color = 'var(--clr-gold-lt)'
                  e.currentTarget.style.background = 'rgba(201,168,76,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
                  e.currentTarget.style.color = 'var(--clr-muted)'
                  e.currentTarget.style.background = 'rgba(201,168,76,0.04)'
                }}
              >
                <span style={{ color: 'var(--clr-gold)', opacity: 0.7 }}>{chip.icon}</span>
                {!isMobile && <span>{chip.label}</span>}
              </a>
            ))}
          </motion.div>
        </div>

        {/* ─── Right: 3D Camera ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'relative',
            height: isMobile ? '260px' : '520px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            maxWidth: '100%',
          }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Gold glow behind camera */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
            <CameraModel3D />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}
      >
        <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--clr-faint)' }}>
          {t('hero.scroll')}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--clr-gold), transparent)' }}
        />
      </motion.div>

    </section>
  )
}

export default Hero
