import { useNavigate } from 'react-router-dom'
import { Zap, Shield, BarChart3, Target, ArrowRight, Brain, Sparkles, Code2, Users } from 'lucide-react'

const features = [
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'Deep NLP analysis of your resume content, skills, and formatting against industry standards.', color: '#00d4ff' },
  { icon: Target, title: 'ATS Score', desc: 'Get your ATS pass-through score out of 100 with detailed breakdown of every factor.', color: '#a855f7' },
  { icon: BarChart3, title: 'Skills Gap Analysis', desc: 'Identify missing skills for your target role and get personalized recommendations.', color: '#00ff88' },
  { icon: Shield, title: 'Keyword Optimization', desc: 'Extract and highlight industry keywords to ensure maximum recruiter visibility.', color: '#ff006e' },
  { icon: Sparkles, title: 'Section Scoring', desc: 'Evaluate each resume section individually with actionable improvement tips.', color: '#fbbf24' },
  { icon: Code2, title: 'Role-Specific Insights', desc: 'Tailored analysis for Software Engineer, Data Scientist, DevOps, and more.', color: '#00d4ff' },
]

const stats = [
  { value: '95%', label: 'ATS Accuracy' },
  { value: '50K+', label: 'Resumes Analyzed' },
  { value: '2 sec', label: 'Analysis Speed' },
  { value: '12+', label: 'Job Roles' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="grid-bg min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ padding: '80px 24px 100px' }}>
        {/* BG orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '20%', right: '5%', width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 animate-fade-in-up" style={{
            background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)',
            borderRadius: '20px', padding: '6px 16px',
          }}>
            <span style={{ width: '6px', height: '6px', background: '#00ff88', borderRadius: '50%', display: 'inline-block' }} className="animate-pulse-glow" />
            <span style={{ color: '#00d4ff', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.05em' }}>AI-POWERED RESUME INTELLIGENCE</span>
          </div>

          <h1 className="font-orbitron font-black leading-tight mb-6 animate-fade-in-up" 
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards' }}>
            <span className="gradient-text">DECODE YOUR</span>
            <br />
            <span className="text-white">RESUME'S POTENTIAL</span>
          </h1>

          <p className="text-slate-400 mb-10 mx-auto animate-fade-in-up" 
            style={{ fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.7', animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
            Upload your resume and get an instant AI analysis — ATS score, skills gap report, section-by-section feedback, and actionable improvements to land more interviews.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" 
            style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
            <button onClick={() => navigate('/upload')} className="btn-primary flex items-center justify-center gap-3 text-white font-semibold"
              style={{ padding: '14px 32px', borderRadius: '12px', fontSize: '1rem' }}>
              <Zap size={18} />
              Analyze My Resume
              <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/upload')} className="flex items-center justify-center gap-2 font-semibold"
              style={{
                padding: '14px 32px', borderRadius: '12px', fontSize: '1rem',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0', transition: 'all 0.2s', cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <Sparkles size={18} style={{ color: '#a855f7' }} />
              Try Sample Resume
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 24px 80px' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="glass-card text-center" style={{ padding: '24px 16px' }}>
              <div className="font-orbitron font-black gradient-text" style={{ fontSize: '2rem' }}>{s.value}</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '4px', fontWeight: '500' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 24px 100px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-orbitron font-bold text-white mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
              Everything You Need to <span className="gradient-text">Get Hired</span>
            </h2>
            <p style={{ color: '#64748b' }}>Comprehensive resume intelligence powered by advanced AI</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-card glass-card-hover" style={{ padding: '28px' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', marginBottom: '16px',
                  background: `${f.color}15`, border: `1px solid ${f.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <h3 style={{ color: '#f1f5f9', fontWeight: '600', marginBottom: '8px', fontSize: '1rem' }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 24px 100px' }}>
        <div className="max-w-3xl mx-auto glass-card text-center" style={{ padding: '60px 40px', border: '1px solid rgba(0,212,255,0.2)' }}>
          <Users size={40} className="mx-auto mb-4" style={{ color: '#00d4ff' }} />
          <h2 className="font-orbitron font-bold text-white mb-4" style={{ fontSize: '1.8rem' }}>
            Ready to Land More Interviews?
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '28px' }}>
            Join thousands of professionals who use ATS Smart Resume Analyzer to get past ATS filters and impress recruiters.
          </p>
          <button onClick={() => navigate('/upload')} className="btn-primary text-white font-bold"
            style={{ padding: '14px 36px', borderRadius: '12px', fontSize: '1rem' }}>
            Get Your Free Analysis →
          </button>
        </div>
      </section>
    </div>
  )
}
