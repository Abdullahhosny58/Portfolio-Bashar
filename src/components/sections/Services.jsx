import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const ICONS = [
  <svg key="cam" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  <svg key="apt" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="14.31" y1="8" x2="20.05" y2="17.94"/><line x1="9.69" y1="8" x2="21.17" y2="8"/><line x1="7.38" y1="12" x2="13.12" y2="2.06"/><line x1="9.69" y1="16" x2="3.95" y2="6.06"/><line x1="14.31" y1="16" x2="2.83" y2="16"/><line x1="16.62" y1="12" x2="10.88" y2="21.94"/></svg>,
  <svg key="film" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
  <svg key="lay" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
]

const SERVICE_KEYS = [
  { titleKey: 'services.items.0.title', descKey: 'services.items.0.desc' },
  { titleKey: 'services.items.1.title', descKey: 'services.items.1.desc' },
  { titleKey: 'services.items.2.title', descKey: 'services.items.2.desc' },
  { titleKey: 'services.items.3.title', descKey: 'services.items.3.desc' },
]

export function Services() {
  const { t } = useTranslation()

  return (
    <section id="services" className="section" style={{ background: 'transparent' }}>
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: '64px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <span className="gold-line" />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--clr-gold)' }}>
              {t('services.label')}
            </span>
          </div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: 'var(--clr-cream)', lineHeight: 1.2, marginBottom: '16px' }}>
            {t('services.title')}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--clr-muted)', maxWidth: '480px', lineHeight: 1.7 }}>
            {t('services.subtitle')}
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2px' }}>
          {SERVICE_KEYS.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ background: 'rgba(201,168,76,0.06)' }}
              style={{
                padding: '44px 36px',
                border: '1px solid rgba(201,168,76,0.1)',
                background: 'rgba(255,255,255,0.02)',
                transition: 'background 0.3s ease',
                cursor: 'default',
              }}
            >
              <div style={{ width: 48, height: 48, marginBottom: '28px', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-gold)' }}>
                {ICONS[i]}
              </div>
              <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--clr-gold)', marginBottom: '12px', opacity: 0.5 }}>
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: '20px', fontWeight: 600, color: 'var(--clr-cream)', marginBottom: '14px', lineHeight: 1.3 }}>
                {t(svc.titleKey)}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--clr-muted)', lineHeight: 1.85 }}>
                {t(svc.descKey)}
              </p>
              <div style={{ marginTop: '28px', height: '1px', background: 'var(--grad-gold)', opacity: 0.2 }} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Services
