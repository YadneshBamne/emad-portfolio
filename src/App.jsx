import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AaryaCinematicPortfolio from './AaryaCinematicPortfolio'
import DemoOne from './demo'
import { CinematicFooter } from './components/motion-footer'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AaryaCinematicPortfolio />} />
        <Route path="/gallery" element={<DemoOne />} />
      </Routes>
      <CinematicFooter />
    </BrowserRouter>
  )
}

export default App
