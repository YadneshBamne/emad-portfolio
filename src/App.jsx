import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AaryaCinematicPortfolio from './AaryaCinematicPortfolio'
import DemoOne from './demo'
import { CinematicFooter } from './components/motion-footer'
import './App.css'
import VhsRecorder from './components/VhsRecorder'
import Preloader from './components/Preloader'

import AboutPage from './pages/AboutPage'
import PhotographyPage from './pages/PhotographyPage'
import WorksPage from './pages/WorksPage'
import CommunityPage from './pages/CommunityPage'

function App() {
  return (
    <Preloader>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AaryaCinematicPortfolio />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/photography" element={<PhotographyPage />} />
          <Route path="/works" element={<WorksPage />} />
          <Route path="/community" element={<CommunityPage />} />
          
          <Route path="/gallery" element={<DemoOne />} />
          <Route path="/demo" element={<VhsRecorder />} />
        </Routes>
        <CinematicFooter />
      </BrowserRouter>
    </Preloader>
  )
}

export default App
