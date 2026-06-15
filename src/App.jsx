import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
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
import { TransitionProvider } from './context/TransitionContext'
import { ThemeProvider } from './context/ThemeContext'

// Root Layout wrapping all pages to supply the TransitionProvider and CinematicFooter
const Layout = () => {
  return (
    <TransitionProvider>
      <Outlet />
      <CinematicFooter />
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
