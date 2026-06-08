import { createContext, useContext, useState } from 'react'

const AnalysisContext = createContext(null)

export function AnalysisProvider({ children }) {
  const [analysisData, setAnalysisData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyzeResume = async (file, jobRole) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobRole', jobRole)

      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setAnalysisData(data.analysis)
      return data.analysis
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeSample = async (jobRole) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/analyze-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRole })
      })
      if (!res.ok) throw new Error('Sample analysis failed')
      const data = await res.json()
      setAnalysisData(data.analysis)
      return data.analysis
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnalysisContext.Provider value={{ analysisData, isLoading, error, analyzeResume, analyzeSample, setAnalysisData }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext)
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider')
  return ctx
}
