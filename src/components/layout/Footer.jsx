import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  return (
    <footer style={{
      borderTop: '1px solid rgba(201,168,76,0.1)',
      background: 'transparent',
      padding: '40px 0',
      textAlign: 'center',
    }}>
      <div className="container">
        <p style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: '20px', fontWeight: 700, letterSpacing: '0.04em',
          background: 'var(--grad-gold)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: '12px',
        }}>
          {t('footer.copy')}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--clr-faint)', letterSpacing: '0.08em', marginBottom: '10px' }}>
          &copy; {year} &nbsp;&mdash;&nbsp; {t('footer.rights')}
        </p>
        <p style={{ fontSize: '11px', color: 'var(--clr-faint)', letterSpacing: '0.06em', opacity: 0.6 }}>
          Site by{' '}
          <a
            href="https://portfolio-lovat-psi-72.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--clr-gold)',
              opacity: 0.75,
              textDecoration: 'none',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}
          >
            Abdullah Hosny
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
