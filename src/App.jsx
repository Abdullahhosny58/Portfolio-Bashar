import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar }   from './components/layout/Navbar'
import { Footer }   from './components/layout/Footer'
import { Hero }     from './components/sections/Hero'
import { About }    from './components/sections/About'
import { Services } from './components/sections/Services'
import { Gallery }  from './components/sections/Gallery'
import { Contact }  from './components/sections/Contact'
import { CursorLens } from './components/ui/CursorLens'
import { ParticleBackground } from './components/ui/ParticleBackground'
import { StillsProjectPage } from './pages/StillsProjectPage'
import './index.css'

function HomePage() {
  return (
    <>
      <ParticleBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

function App() {
  const { i18n } = useTranslation()
  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.documentElement.dir  = i18n.language === 'ar' ? 'rtl' : 'ltr'
  }, [i18n.language])

  return (
    <>
      <CursorLens />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work/stills/:projectId" element={<StillsProjectPage />} />
      </Routes>
    </>
  )
}

export default App
