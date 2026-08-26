import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import AaryaCinematicPortfolio from './AaryaCinematicPortfolio'
import DemoOne from './demo'
import AnimatedFooter from './components/ui/animated-footer'
import './App.css'
import VhsRecorder from './components/VhsRecorder'
import Preloader from './components/Preloader'
import AboutPage from './pages/AboutPage'
import PhotographyPage from './pages/PhotographyPage'
import WorksPage from './pages/WorksPage'
import CommunityPage from './pages/CommunityPage'
import { TransitionProvider } from './context/TransitionContext'
import { ThemeProvider } from './context/ThemeContext'

import { useTheme } from './context/ThemeContext'
import { useLocation } from 'react-router-dom'

// Root Layout wrapping all pages to supply the TransitionProvider and AnimatedFooter
const Layout = () => {
  const location = useLocation()
  const { theme } = useTheme()
  const isFullScreenPage = location.pathname === '/photography'
  const isLight = theme === 'light'

  return (
    <TransitionProvider>
      <Outlet />
      {!isFullScreenPage && (
        <AnimatedFooter 
          charColor={isLight ? "#b81d24" : "#e11d48"}
          hoverColor={isLight ? "#801418" : "#ef4444"}
          accentColor="#b81d24"
          textColor={isLight ? "#12100e" : "#ffffff"}
          background={isLight ? "#f5f3ec" : "#000000"}
        />
      )}
    </TransitionProvider>
  )
}

// Router Setup using Data Routing (required for useBlocker)
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <AaryaCinematicPortfolio /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'photography', element: <PhotographyPage /> },
      { path: 'works', element: <WorksPage /> },
      { path: 'works/:id', element: <WorksPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'gallery', element: <DemoOne /> },
      { path: 'demo', element: <VhsRecorder /> },
    ]
  }
])

function App() {
  return (
    <ThemeProvider>
      <Preloader>
        <RouterProvider router={router} />
      </Preloader>
    </ThemeProvider>
  )
}

export default App
