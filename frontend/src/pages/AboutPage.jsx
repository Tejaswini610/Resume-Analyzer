import { Brain, Zap, Shield, Target, Code2 } from 'lucide-react'

const team = [
  { role: 'AI/ML Engine', desc: 'Advanced NLP pipeline for skill extraction, section detection, and keyword analysis', icon: Brain, color: '#00d4ff' },
  { role: 'ATS Simulator', desc: 'Replicates Applicant Tracking System scoring algorithms used by top companies', icon: Target, color: '#a855f7' },
  { role: 'Scoring Engine', desc: 'Multi-factor weighted scoring across contact, sections, skills, job fit, and quality', icon: Zap, color: '#00ff88' },
  { role: 'Security', desc: 'Zero data retention — your resume is analyzed in memory and never stored', icon: Shield, color: '#ff006e' },
]

const tech = ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'pdf-parse', 'Recharts', 'React Router', 'React Dropzone']

export default function AboutPage() {
  return (
    <div className="grid-bg min-h-screen" style={{ padding: '60px 24px 100px' }}>
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-16">
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 20px',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(168,85,247,0.15))',
            border: '1px solid rgba(0,212,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Brain size={34} style={{ color: '#00d4ff' }} />
          </div>
          <h1 className="font-orbitron font-black text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            About <span className="gradient-text">ResumeAI</span>
          </h1>
          <p style={{ color: '#64748b', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7', fontSize: '1rem' }}>
            ResumeAI is an intelligent resume analysis platform that helps job seekers optimize their resumes for ATS systems and human recruiters alike. Built with modern AI techniques and a recruiter-informed scoring model.
          </p>
        </div>

        {/* How it works */}
        <div className="glass-card mb-8" style={{ padding: '32px' }}>
          <h2 className="font-orbitron font-bold text-white mb-6" style={{ fontSize: '1.2rem' }}>
            How It <span style={{ color: '#00d4ff' }}>Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', label: 'Upload', desc: 'Drop your PDF resume — no account needed' },
              { step: '02', label: 'Extract', desc: 'Text and structure are extracted from your resume' },
              { step: '03', label: 'Analyze', desc: 'AI engine scores 50+ data points across 5 dimensions' },
              { step: '04', label: 'Report', desc: 'Get detailed insights, scores, and action items' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-orbitron font-black gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.step}</div>
                <div style={{ color: '#e2e8f0', fontWeight: '600', marginBottom: '6px' }}>{s.label}</div>
                <div style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: '1.5' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {team.map((t, i) => (
            <div key={i} className="glass-card glass-card-hover" style={{ padding: '24px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px', marginBottom: '14px',
                background: `${t.color}12`, border: `1px solid ${t.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <t.icon size={20} style={{ color: t.color }} />
              </div>
              <h3 style={{ color: '#f1f5f9', fontWeight: '600', marginBottom: '6px' }}>{t.role}</h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: '1.5' }}>{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div className="flex items-center gap-3 mb-5">
            <Code2 size={18} style={{ color: '#00d4ff' }} />
            <h2 className="font-orbitron font-bold text-white" style={{ fontSize: '1rem' }}>Tech Stack</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tech.map((t, i) => (
              <span key={i} className="neon-tag">{t}</span>
            ))}
          </div>
          <p style={{ color: '#475569', fontSize: '0.8rem', marginTop: '16px', lineHeight: '1.6' }}>
            Built as a full-stack application with a React + Vite frontend and Node.js + Express backend.
            PDF parsing is done server-side with <code style={{ color: '#00d4ff', fontFamily: 'JetBrains Mono' }}>pdf-parse</code>,
            and all analysis runs in a custom scoring engine with no third-party AI APIs required.
          </p>
        </div>

      </div>
    </div>
  )
}
