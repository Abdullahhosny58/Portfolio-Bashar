import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const CONTACT_INFO = [
  {
    id: 'email',
    label: 'Email',
    value: 'Basharhany4@gmail.com',
    href: 'mailto:Basharhany4@gmail.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: '+20 1067 110033',
    href: 'https://wa.me/201067110033',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: '@basharforashoot',
    href: 'https://instagram.com/basharforashoot',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
]

export function Contact() {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
  }

  return (
    <section id="contact" className="section" style={{ background: 'transparent' }}>
      <div className="container" style={{ maxWidth: '720px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '20px' }}>
            <span className="gold-line" />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--clr-gold)' }}>
              {t('contact.label')}
            </span>
            <span className="gold-line" />
          </div>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700,
            color: 'var(--clr-cream)', lineHeight: 1.2, marginBottom: '16px',
          }}>
            {t('contact.title') || ' '}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--clr-muted)', lineHeight: 1.7 }}>
            {t('contact.subtitle') || ' '}
          </p>
        </motion.div>

        {/* Contact Info Chips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '52px',
          }}
        >
          {CONTACT_INFO.map((item, i) => (
            <motion.a
              key={item.id}
              href={item.href}
              target={item.id !== 'email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -2 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 20px',
                border: '1px solid rgba(201,168,76,0.2)',
                background: 'rgba(201,168,76,0.03)',
                color: 'var(--clr-muted)',
                textDecoration: 'none',
                borderRadius: '2px',
                fontSize: '13px',
                letterSpacing: '0.03em',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)'
                e.currentTarget.style.color = 'var(--clr-gold)'
                e.currentTarget.style.background = 'rgba(201,168,76,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
                e.currentTarget.style.color = 'var(--clr-muted)'
                e.currentTarget.style.background = 'rgba(201,168,76,0.03)'
              }}
            >
              <span style={{ color: 'var(--clr-gold)', flexShrink: 0 }}>
                {item.icon}
              </span>
              <span>{item.value}</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.1)' }} />
          <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--clr-faint)' }}>
            or leave a message
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(201,168,76,0.1)' }} />
        </div>

        {/* Form */}
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '48px' }}
          >
            <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '24px', color: 'var(--clr-gold)', marginBottom: '8px' }}>
              {t('contact.form.success')}
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {['name', 'email'].map(field => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--clr-muted)', marginBottom: '8px' }}>
                  {t('contact.form.' + field)}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field} required
                  style={{
                    width: '100%', padding: '14px 16px',
                    background: 'var(--clr-surface)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    color: 'var(--clr-text)', fontSize: '14px',
                    outline: 'none', borderRadius: '2px',
                    transition: 'border-color var(--t-fast)',
                    fontFamily: '"DM Sans", sans-serif',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--clr-muted)', marginBottom: '8px' }}>
                {t('contact.form.message')}
              </label>
              <textarea
                name="message" required rows={5}
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'var(--clr-surface)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  color: 'var(--clr-text)', fontSize: '14px',
                  outline: 'none', borderRadius: '2px', resize: 'vertical',
                  transition: 'border-color var(--t-fast)',
                  fontFamily: '"DM Sans", sans-serif',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.15)'}
              />
            </div>
            <motion.button
              type="submit" disabled={sending}
              whileHover={!sending ? { scale: 1.02 } : {}}
              whileTap={!sending ? { scale: 0.98 } : {}}
              style={{
                padding: '15px', marginTop: '8px',
                background: sending ? 'rgba(201,168,76,0.4)' : 'var(--clr-gold)',
                color: '#080808', fontSize: '12px', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                border: 'none', borderRadius: '2px',
                cursor: sending ? 'not-allowed' : 'pointer',
                transition: 'all var(--t-fast)',
              }}
            >
              {sending ? t('contact.form.sending') : t('contact.form.send')}
            </motion.button>
          </motion.form>
        )}

      </div>
    </section>
  )
}

export default Contact
