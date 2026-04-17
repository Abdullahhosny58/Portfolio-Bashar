import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { works, workFilters, stillsProjects, productImages } from '../../data/content'
// works used for finding project cover; stillsProjects for All tab; productImages for Products tab

export function Gallery() {
  const { t, i18n } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedStills, setSelectedStills] = useState(null)   // projectId
  const [selectedProduct, setSelectedProduct] = useState(null) // product index
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  const isAr = i18n.language === 'ar'

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const filtered = activeFilter === 'all'
    ? works
    : works.filter(w => w.category === activeFilter)

  // Lock body scroll when anything is expanded
  const isExpanded = selectedStills !== null || selectedProduct !== null
  useEffect(() => {
    document.body.style.overflow = isExpanded ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isExpanded])

  // Escape to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSelectedStills(null)
        setSelectedProduct(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const selectedProject = selectedStills
    ? stillsProjects.find(p => p.id === selectedStills)
    : null

  return (
    <section id="work" className="section" style={{ background: 'transparent' }}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '48px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <span className="gold-line" />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--clr-gold)' }}>
              {t('work.label')}
            </span>
          </div>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700,
            color: 'var(--clr-cream)', lineHeight: 1.2,
          }}>
            {t('work.title')}
          </h2>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', gap: '4px', marginBottom: '40px', flexWrap: 'wrap' }}
        >
          {workFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: '9px 22px',
                fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                border: '1px solid',
                borderColor: activeFilter === f.key ? 'var(--clr-gold)' : 'rgba(201,168,76,0.2)',
                background: activeFilter === f.key ? 'var(--clr-gold)' : 'transparent',
                color: activeFilter === f.key ? '#080808' : 'var(--clr-muted)',
                borderRadius: '2px', cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {activeFilter === 'products' ? (
            /* ── Magazine product grid ── */
            <motion.div
              key="products-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gridAutoRows: isMobile ? '180px' : '220px',
                gap: '3px',
              }}
            >
              {productImages.map((img, i) => (
                <ProductCard
                  key={img.id}
                  img={img}
                  index={i}
                  isMobile={isMobile}
                  onExpand={() => setSelectedProduct(i)}
                />
              ))}
            </motion.div>
          ) : (
            /* ── All / Stills grid — stills projects + ONE products collection card ── */
            <motion.div
              key="mixed-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '3px',
              }}
            >
              {/* Stills project cards */}
              {stillsProjects.map((p, i) => {
                const work = works.find(w => w.projectId === p.id)
                if (!work) return null
                return (
                  <StillsCard
                    key={work.id}
                    work={work}
                    index={i}
                    isAr={isAr}
                    onExpand={() => setSelectedStills(work.projectId)}
                  />
                )
              })}

              {/* Single Products collection card — only show in All tab */}
              {activeFilter === 'all' && (
                <ProductsCollectionCard
                  images={productImages}
                  index={stillsProjects.length}
                  onExpand={() => setActiveFilter('products')}
                  t={t}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Stills expanding overlay ── */}
      <AnimatePresence>
        {selectedStills && selectedProject && (
          <ExpandedStills
            project={selectedProject}
            isAr={isAr}
            onClose={() => setSelectedStills(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Product expanding overlay ── */}
      <AnimatePresence>
        {selectedProduct !== null && (
          <ExpandedProduct
            index={selectedProduct}
            images={productImages}
            onChange={setSelectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

/* ─────────────────────────────────────────
   PRODUCTS COLLECTION CARD (shown in All tab)
   — a 2x2 collage preview, click → products tab
───────────────────────────────────────── */
function ProductsCollectionCard({ images, index, onExpand, t }) {
  const [hovered, setHovered] = useState(false)
  // Pick 4 spread-out images for the collage preview
  const preview = [images[0], images[3], images[6], images[9]].filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onExpand}
      style={{
        position: 'relative',
        aspectRatio: '4/3',
        overflow: 'hidden',
        cursor: 'pointer',
        borderRadius: '2px',
      }}
    >
      {/* 2×2 collage grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        width: '100%', height: '100%',
        gap: '2px',
        transition: 'transform 0.7s ease',
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
      }}>
        {preview.map((img, i) => (
          <div key={img.id} style={{ overflow: 'hidden' }}>
            <img
              src={img.src}
              alt=""
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
              }}
            />
          </div>
        ))}
      </div>

      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(6,6,6,0.52)',
        transition: 'background 0.3s ease',
        ...(hovered ? { background: 'rgba(6,6,6,0.38)' } : {}),
        pointerEvents: 'none',
      }} />

      {/* Label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '10px',
      }}>
        <p style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '22px', fontWeight: 700,
          color: 'var(--clr-cream)', textAlign: 'center',
          lineHeight: 1.2,
        }}>
          Product Photography
        </p>
        <span style={{
          fontSize: '10px', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--clr-gold)',
          opacity: 0.8,
        }}>
          {images.length} images
        </span>
        <motion.span
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.22 }}
          style={{
            fontSize: '10px', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--clr-gold)',
          }}
        >
          View All &rarr;
        </motion.span>
      </div>

      {/* Gold border on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute', inset: 0,
          border: '1px solid rgba(201,168,76,0.4)',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   STILLS CARD (in mixed / all grid)
───────────────────────────────────────── */
function StillsCard({ work, index, isAr, onExpand }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      layout
      layoutId={`card-${work.projectId}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onExpand}
      style={{
        position: 'relative', aspectRatio: '4/3', overflow: 'hidden',
        cursor: 'pointer', gridColumn: 'span 2', borderRadius: '2px',
      }}
    >
      <motion.img
        layoutId={`cover-${work.projectId}`}
        src={work.image} alt={work.titleEn}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transition: 'transform 0.7s ease',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
        background: 'linear-gradient(to top, rgba(6,6,6,0.88) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      <motion.div
        layoutId={`label-${work.projectId}`}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px' }}
      >
        <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '22px', fontWeight: 700, color: 'var(--clr-cream)', marginBottom: '4px' }}>
          {work.titleEn}
        </p>
        <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '14px', fontStyle: 'italic', color: 'var(--clr-gold)', opacity: 0.85 }}>
          {work.titleAr}
        </p>
        <motion.span
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.22 }}
          style={{ display: 'block', marginTop: '10px', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--clr-gold)' }}
        >
          View Series &rarr;
        </motion.span>
      </motion.div>
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ position: 'absolute', inset: 0, border: '1px solid rgba(201,168,76,0.4)', pointerEvents: 'none' }}
      />
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   PRODUCT CARD — magazine grid (products tab)
───────────────────────────────────────── */
function ProductCard({ img, index, onExpand, isMobile }) {
  const [hovered, setHovered] = useState(false)

  // Magazine pattern: every 5th image is big (spans 2 cols + 2 rows)
  // On mobile (2 cols) big cards only span 2 cols, no extra row
  const isBig = index % 5 === 0
  const gridStyle = isBig
    ? isMobile
      ? { gridColumn: 'span 2' }
      : { gridColumn: 'span 2', gridRow: 'span 2' }
    : {}

  return (
    <motion.div
      layoutId={`product-${img.id}`}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onExpand}
      style={{
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer', borderRadius: '2px',
        ...gridStyle,
      }}
    >
      <img
        src={img.src} alt={`Product ${img.id}`} loading="lazy"
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transition: 'transform 0.65s ease',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
        }}
      />
      {/* Hover overlay */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(6,6,6,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Expand icon */}
        <div style={{
          width: 40, height: 40,
          border: '1px solid rgba(201,168,76,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--clr-gold)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </div>
      </motion.div>

      {/* Gold border on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ position: 'absolute', inset: 0, border: '1px solid rgba(201,168,76,0.35)', pointerEvents: 'none' }}
      />
    </motion.div>
  )
}

/* Small product card inside the mixed/all grid */
function ProductCardSmall({ work, index, imgIndex, onExpand, t }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onExpand(imgIndex >= 0 ? imgIndex : 0)}
      style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', cursor: 'pointer', borderRadius: '2px' }}
    >
      <img
        src={work.image} alt={work.titleEn} loading="lazy"
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          transition: 'transform 0.6s ease',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
      />
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          position: 'absolute', inset: 0, background: 'rgba(6,6,6,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{
          width: 36, height: 36, border: '1px solid rgba(201,168,76,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-gold)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
          </svg>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   EXPANDED STILLS (full-screen project)
───────────────────────────────────────── */
function ExpandedStills({ project, isAr, onClose }) {
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' && lightbox !== null) setLightbox(i => Math.min(i + 1, project.images.length - 1))
      if (e.key === 'ArrowLeft' && lightbox !== null) setLightbox(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, project])

  return (
    <>
      <motion.div
        key="stills-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(4,4,4,0.6)', backdropFilter: 'blur(4px)' }}
      />
      <motion.div
        key="stills-expanded"
        layoutId={`card-${project.id}`}
        style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--clr-bg)', overflowY: 'auto', borderRadius: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      >
        {/* Sticky header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '18px 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-muted)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--clr-gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--clr-muted)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Close
            </button>
            <motion.div layoutId={`label-${project.id}`} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '17px', fontWeight: 700, color: 'var(--clr-cream)' }}>{project.titleEn}</p>
              <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '12px', fontStyle: 'italic', color: 'var(--clr-gold)', opacity: 0.8 }}>{project.titleAr}</p>
            </motion.div>
            <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'var(--clr-faint)' }}>{project.images.length} FRAMES</span>
          </div>
        </div>

        {/* Hero */}
        <motion.div style={{ height: '70vh', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLightbox(0)}>
          <motion.img layoutId={`cover-${project.id}`} src={project.images[0]} alt={project.titleEn}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block', filter: 'brightness(0.88)' }}
          />
        </motion.div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '3px', padding: '3px' }}
        >
          {project.images.slice(1).map((src, i) => (
            <motion.div key={src} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.07 }}
              onClick={() => setLightbox(i + 1)}
              style={{ aspectRatio: '3/2', overflow: 'hidden', cursor: 'zoom-in' }}
            >
              <img src={src} alt={`${project.titleEn} ${i + 2}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </motion.div>
          ))}
        </motion.div>
        <div style={{ height: '80px' }} />
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox images={project.images} current={lightbox} onChange={setLightbox} onClose={() => setLightbox(null)} zIndex={200} />
        )}
      </AnimatePresence>
    </>
  )
}

/* ─────────────────────────────────────────
   EXPANDED PRODUCT (full-screen single image)
───────────────────────────────────────── */
function ExpandedProduct({ index, images, onChange, onClose }) {
  const img = images[index]

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') onChange(i => Math.min(i + 1, images.length - 1))
      if (e.key === 'ArrowLeft') onChange(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images, onChange])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(4,4,4,0.65)', backdropFilter: 'blur(6px)' }}
      />

      {/* Expanding card */}
      <motion.div
        layoutId={`product-${img.id}`}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: '#060606',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
      >
        {/* Full image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={img.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            src={img.src}
            alt={`Product ${img.id}`}
            style={{
              maxWidth: '100vw', maxHeight: '100vh',
              objectFit: 'contain', display: 'block',
            }}
          />
        </AnimatePresence>

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
        }}>
          <button onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--clr-gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Close
          </button>
          <span style={{ fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>
            {index + 1} / {images.length}
          </span>
        </div>

        {/* Thumbnail strip at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '16px 20px 20px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
          display: 'flex', gap: '6px', justifyContent: 'center', overflowX: 'auto',
        }}>
          {images.map((im, i) => (
            <button
              key={im.id}
              onClick={() => onChange(i)}
              style={{
                flexShrink: 0,
                width: '48px', height: '36px',
                border: i === index ? '2px solid var(--clr-gold)' : '2px solid transparent',
                borderRadius: '2px', padding: 0, cursor: 'pointer', overflow: 'hidden',
                opacity: i === index ? 1 : 0.5,
                transition: 'all 0.2s',
              }}
            >
              <img src={im.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>

        {/* Prev */}
        {index > 0 && (
          <button
            onClick={() => onChange(i => i - 1)}
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: '1px solid rgba(201,168,76,0.25)', color: 'var(--clr-cream)', cursor: 'pointer', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        )}
        {/* Next */}
        {index < images.length - 1 && (
          <button
            onClick={() => onChange(i => i + 1)}
            style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: '1px solid rgba(201,168,76,0.25)', color: 'var(--clr-cream)', cursor: 'pointer', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}
      </motion.div>
    </>
  )
}

/* ─────────────────────────────────────────
   SHARED LIGHTBOX
───────────────────────────────────────── */
function Lightbox({ images, current, onChange, onClose, zIndex = 200 }) {
  return (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex, background: 'rgba(4,4,4,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <motion.img
        key={current}
        initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        src={images[current]}
        alt={`frame ${current + 1}`}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}
      />
      <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--clr-cream)', cursor: 'pointer', width: '44px', height: '44px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        &times;
      </button>
      {current > 0 && (
        <button onClick={e => { e.stopPropagation(); onChange(i => i - 1) }}
          style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--clr-cream)', cursor: 'pointer', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}
      {current < images.length - 1 && (
        <button onClick={e => { e.stopPropagation(); onChange(i => i + 1) }}
          style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--clr-cream)', cursor: 'pointer', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--clr-faint)' }}>
        {current + 1} / {images.length}
      </div>
    </motion.div>
  )
}

export default Gallery
