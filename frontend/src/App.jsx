import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'
import { AnalysisProvider } from './components/AnalysisProvider'

export default function App() {
  return (
    <AnalysisProvider>
      <Router>
        <div className="min-h-screen" style={{ background: '#020409' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </Router>
    </AnalysisProvider>
  )
}
