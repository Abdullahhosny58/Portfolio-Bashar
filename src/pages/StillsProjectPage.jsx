import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { stillsProjects } from '../data/content'

export function StillsProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const project = stillsProjects.find(p => p.id === projectId)
  const [lightbox, setLightbox] = useState(null) // index of open image

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Close lightbox on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight' && lightbox !== null && project) setLightbox(i => Math.min(i + 1, project.images.length - 1))
      if (e.key === 'ArrowLeft' && lightbox !== null) setLightbox(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, project])

  if (!project) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--clr-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--clr-muted)', marginBottom: '24px' }}>Project not found.</p>
          <button onClick={() => navigate('/#work')} style={{ color: 'var(--clr-gold)', background: 'none', border: '1px solid var(--clr-gold)', padding: '10px 24px', cursor: 'pointer', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Back to Work
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clr-bg)' }}>

      {/* ── Top bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,8,8,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.1)',
        padding: '20px 0',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate('/#work')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              color: 'var(--clr-muted)', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--clr-gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--clr-muted)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back to Work
          </button>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '18px', fontWeight: 700, color: 'var(--clr-cream)' }}>
              {project.titleEn}
            </p>
            <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '13px', fontStyle: 'italic', color: 'var(--clr-gold)', opacity: 0.8 }}>
              {project.titleAr}
            </p>
          </div>

          <span style={{ fontSize: '11px', color: 'var(--clr-faint)', letterSpacing: '0.1em' }}>
            {project.images.length} FRAMES
          </span>
        </div>
      </div>

      {/* ── Hero image ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ position: 'relative', height: '65vh', overflow: 'hidden', cursor: 'zoom-in' }}
        onClick={() => setLightbox(0)}
      >
        <img
          src={project.images[0]}
          alt={project.titleEn}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            objectPosition: 'center 30%',
            display: 'block',
            filter: 'brightness(0.85)',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(8,8,8,0.7) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--clr-faint)' }}>
            Click to expand
          </span>
        </div>
      </motion.div>

      {/* ── Grid of remaining images ── */}
      <div style={{ padding: '4px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '4px',
        }}>
          {project.images.slice(1).map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              onClick={() => setLightbox(i + 1)}
              style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden', cursor: 'zoom-in' }}
            >
              <img
                src={src}
                alt={`${project.titleEn} ${i + 2}`}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.6s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Gold bottom line ── */}
      <div style={{
        margin: '60px auto 80px',
        width: '1px', height: '60px',
        background: 'linear-gradient(to bottom, var(--clr-gold), transparent)',
        opacity: 0.4,
      }} />

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(4,4,4,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {/* Image */}
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3 }}
              src={project.images[lightbox]}
              alt={`${project.titleEn} ${lightbox + 1}`}
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '90vw', maxHeight: '88vh',
                objectFit: 'contain',
                borderRadius: '2px',
                boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
              }}
            />

            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              style={{
                position: 'absolute', top: '24px', right: '24px',
                background: 'none', border: '1px solid rgba(201,168,76,0.3)',
                color: 'var(--clr-cream)', cursor: 'pointer',
                width: '44px', height: '44px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              &times;
            </button>

            {/* Prev */}
            {lightbox > 0 && (
              <button
                onClick={e => { e.stopPropagation(); setLightbox(l => l - 1) }}
                style={{
                  position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: '1px solid rgba(201,168,76,0.25)',
                  color: 'var(--clr-cream)', cursor: 'pointer',
                  width: '48px', height: '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
            )}

            {/* Next */}
            {lightbox < project.images.length - 1 && (
              <button
                onClick={e => { e.stopPropagation(); setLightbox(l => l + 1) }}
                style={{
                  position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: '1px solid rgba(201,168,76,0.25)',
                  color: 'var(--clr-cream)', cursor: 'pointer',
                  width: '48px', height: '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            )}

            {/* Counter */}
            <div style={{
              position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
              fontSize: '11px', letterSpacing: '0.15em', color: 'var(--clr-faint)',
            }}>
              {lightbox + 1} / {project.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default StillsProjectPage
