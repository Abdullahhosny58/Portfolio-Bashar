import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const navLinks = ['about', 'services', 'work', 'contact']

export function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled]         = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen]         = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close menu on scroll
  useEffect(() => {
    const fn = () => { if (menuOpen) setMenuOpen(false) }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [menuOpen])

  useEffect(() => {
    const allSections = ['about', 'services', 'work', 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.35, rootMargin: '-80px 0px -20% 0px' }
    )
    allSections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const toggleLang = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(next)
    localStorage.setItem('bashar-lang', next)
    document.documentElement.lang = next
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
  }

  const handleNavClick = (key) => {
    setActiveSection(key)
    setMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: scrolled ? '14px 0' : '22px 0',
          background: scrolled || menuOpen ? 'rgba(8,8,8,0.96)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.12)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <a href="#hero" onClick={() => { setActiveSection(''); setMenuOpen(false) }} style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '22px', fontWeight: 700, letterSpacing: '0.02em',
            background: 'var(--grad-gold)', WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            B.
          </a>

          {/* Desktop nav */}
          <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            {navLinks.map(key => {
              const isActive = activeSection === key
              return (
                <a
                  key={key}
                  href={'#' + key}
                  onClick={() => handleNavClick(key)}
                  style={{
                    position: 'relative',
                    fontSize: '12px', fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: isActive ? 'var(--clr-gold)' : 'var(--clr-muted)',
                    transition: 'color 0.25s ease',
                    paddingBottom: '4px',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--clr-gold-lt)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--clr-muted)' }}
                >
                  {t('nav.' + key)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: '1px', background: 'var(--grad-gold)', transformOrigin: 'left',
                      }}
                    />
                  )}
                </a>
              )
            })}
            <button
              onClick={toggleLang}
              style={{
                fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
                color: 'var(--clr-gold)', border: '1px solid var(--clr-border)',
                background: 'transparent', padding: '6px 14px', borderRadius: 'var(--r-sm)',
                cursor: 'pointer', transition: 'all var(--t-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              {t('nav.lang')}
            </button>
          </nav>

          {/* Mobile right side: lang + hamburger */}
          <div className="nav-mobile" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={toggleLang}
              style={{
                fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
                color: 'var(--clr-gold)', border: '1px solid var(--clr-border)',
                background: 'transparent', padding: '5px 10px', borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              {t('nav.lang')}
            </button>

            {/* Hamburger button */}
            <button
              onClick={() => setMenuOpen(p => !p)}
              aria-label="Toggle menu"
              style={{
                background: 'transparent', border: 'none',
                cursor: 'pointer', padding: '4px',
                display: 'flex', flexDirection: 'column',
                gap: '5px', alignItems: 'flex-end',
              }}
            >
              <motion.span animate={{ width: menuOpen ? 24 : 24, rotate: menuOpen ? 45 : 0, y: menuOpen ? 9 : 0 }}
                style={{ display: 'block', height: '1.5px', background: 'var(--clr-gold)', borderRadius: '2px', width: 24, originX: 0.5, originY: 0.5 }} />
              <motion.span animate={{ opacity: menuOpen ? 0 : 1, width: menuOpen ? 0 : 16 }}
                style={{ display: 'block', height: '1.5px', background: 'var(--clr-gold)', borderRadius: '2px', width: 16 }} />
              <motion.span animate={{ width: menuOpen ? 24 : 24, rotate: menuOpen ? -45 : 0, y: menuOpen ? -9 : 0 }}
                style={{ display: 'block', height: '1.5px', background: 'var(--clr-gold)', borderRadius: '2px', width: 24, originX: 0.5, originY: 0.5 }} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed', top: '60px', left: 0, right: 0,
              zIndex: 99,
              background: 'rgba(8,8,8,0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(201,168,76,0.12)',
              padding: '24px 0 32px',
            }}
          >
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {navLinks.map((key, i) => {
                const isActive = activeSection === key
                return (
                  <motion.a
                    key={key}
                    href={'#' + key}
                    onClick={() => handleNavClick(key)}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      display: 'block',
                      padding: '16px 0',
                      borderBottom: '1px solid rgba(201,168,76,0.07)',
                      fontSize: '13px', fontWeight: 500, letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: isActive ? 'var(--clr-gold)' : 'var(--clr-muted)',
                      transition: 'color 0.2s',
                    }}
                  >
                    {t('nav.' + key)}
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show/hide nav items via CSS */}
      <style>{`
        @media (min-width: 640px) {
          .nav-desktop { display: flex !important; }
          .nav-mobile  { display: none  !important; }
        }
        @media (max-width: 639px) {
          .nav-desktop { display: none  !important; }
          .nav-mobile  { display: flex  !important; }
        }
      `}</style>
    </>
  )
}

export default Navbar
