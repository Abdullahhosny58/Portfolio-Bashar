import { createContext, useContext, useState } from 'react'

export const CameraContext = createContext({ activeSection: 'hero', setActiveSection: () => {} })

export function CameraProvider({ children }) {
  const [activeSection, setActiveSection] = useState('hero')
  return (
    <CameraContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </CameraContext.Provider>
  )
}

export const useCameraSection = () => useContext(CameraContext)
