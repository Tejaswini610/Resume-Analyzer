import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useAnalysis } from '../components/AnalysisProvider'
import { Upload, FileText, Zap, ChevronDown, AlertCircle, Sparkles, X, CheckCircle } from 'lucide-react'

const JOB_ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Data Scientist', 'DevOps Engineer', 'Full Stack Developer',
  'Product Manager', 'UX Designer', 'Mobile Developer', 'ML Engineer'
]

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [jobRole, setJobRole] = useState('Software Engineer')
  const [roleOpen, setRoleOpen] = useState(false)
  const { analyzeResume, analyzeSample, isLoading, error } = useAnalysis()
  const navigate = useNavigate()

  const onDrop = useCallback(accepted => {
    if (accepted[0]) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  })

  const handleAnalyze = async () => {
    if (!file) return
    try {
      await analyzeResume(file, jobRole)
      navigate('/dashboard')
    } catch (e) { /* error shown */ }
  }

  const handleSample = async () => {
    try {
      await analyzeSample(jobRole)
      navigate('/dashboard')
    } catch (e) { /* error shown */ }
  }

  return (
    <div className="grid-bg min-h-screen" style={{ padding: '60px 24px' }}>
      {/* BG orb */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '600px', height: '600px', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4" style={{
            background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)',
            borderRadius: '20px', padding: '5px 14px'
          }}>
            <Zap size={12} style={{ color: '#a855f7' }} />
            <span style={{ color: '#a855f7', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.05em' }}>INSTANT ANALYSIS</span>
          </div>
          <h1 className="font-orbitron font-bold text-white mb-3" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' }}>
            Upload Your <span className="gradient-text">Resume</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>PDF format • Max 10MB • Results in under 5 seconds</p>
        </div>

        {/* Job Role Selector */}
        <div className="glass-card mb-6 relative z-20" style={{ padding: '24px' }}>
          <label style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '10px', display: 'block' }}>
            TARGET JOB ROLE
          </label>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRoleOpen(!roleOpen)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,255,0.2)',
                color: '#e2e8f0', fontSize: '0.95rem', fontWeight: '500', transition: 'border-color 0.2s'
              }}
            >
              {jobRole}
              <ChevronDown size={16} style={{ color: '#64748b', transform: roleOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {roleOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
                background: '#0a1225', border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: '10px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}>
                {JOB_ROLES.map(r => (
                  <button key={r} onClick={() => { setJobRole(r); setRoleOpen(false) }}
                    style={{
                      width: '100%', padding: '11px 16px', textAlign: 'left', cursor: 'pointer',
                      color: r === jobRole ? '#00d4ff' : '#94a3b8', fontSize: '0.9rem',
                      background: r === jobRole ? 'rgba(0,212,255,0.08)' : 'transparent',
                      border: 'none', transition: 'background 0.15s', fontFamily: 'Inter, sans-serif'
                    }}
                    onMouseEnter={e => { if (r !== jobRole) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (r !== jobRole) e.currentTarget.style.background = 'transparent' }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drop Zone */}
        <div className="glass-card mb-4 relative z-10" style={{ padding: '6px' }}>
          <div
            {...getRootProps()}
            style={{
              border: `2px dashed ${isDragActive ? '#00d4ff' : file ? '#00ff88' : 'rgba(0,212,255,0.25)'}`,
              borderRadius: '12px', padding: '48px 24px', textAlign: 'center', cursor: 'pointer',
              background: isDragActive ? 'rgba(0,212,255,0.05)' : file ? 'rgba(0,255,136,0.04)' : 'transparent',
              transition: 'all 0.3s ease'
            }}
          >
            <input {...getInputProps()} />
            {file ? (
              <div>
                <CheckCircle size={40} className="mx-auto mb-3" style={{ color: '#00ff88' }} />
                <p style={{ color: '#00ff88', fontWeight: '600', marginBottom: '4px' }}>{file.name}</p>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{(file.size / 1024).toFixed(0)} KB • PDF</p>
                <button onClick={e => { e.stopPropagation(); setFile(null) }}
                  style={{
                    marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px',
                    color: '#64748b', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '0.8rem'
                  }}>
                  <X size={12} /> Remove
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 16px',
                  background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isDragActive ? <Zap size={28} style={{ color: '#00d4ff' }} /> : <Upload size={28} style={{ color: '#00d4ff' }} />}
                </div>
                <p style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '6px', fontSize: '1rem' }}>
                  {isDragActive ? 'Release to upload' : 'Drag & drop your resume here'}
                </p>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>or <span style={{ color: '#00d4ff' }}>click to browse</span> • PDF only</p>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 mb-4" style={{
            background: 'rgba(255,0,110,0.08)', border: '1px solid rgba(255,0,110,0.25)',
            borderRadius: '10px', padding: '12px 16px'
          }}>
            <AlertCircle size={16} style={{ color: '#ff006e' }} />
            <p style={{ color: '#ff006e', fontSize: '0.875rem' }}>{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAnalyze}
            disabled={!file || isLoading}
            className="btn-primary flex-1 flex items-center justify-center gap-3 text-white font-bold"
            style={{ padding: '14px', borderRadius: '12px', fontSize: '1rem', opacity: !file ? 0.5 : 1, cursor: !file ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? (
              <>
                <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Analyzing...
              </>
            ) : (
              <><FileText size={18} /> Analyze Resume</>
            )}
          </button>

          <button
            onClick={handleSample}
            disabled={isLoading}
            style={{
              flex: '1', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: '600',
              background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)',
              color: '#a855f7', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,85,247,0.1)'}
          >
            <Sparkles size={18} /> Try Sample Resume
          </button>
        </div>

        <p style={{ color: '#475569', fontSize: '0.75rem', textAlign: 'center', marginTop: '16px' }}>
          🔒 Your resume is processed locally and never stored on our servers
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
