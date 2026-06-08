import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalysis } from '../hooks/useAnalysis'
import ScoreRing from '../components/ScoreRing'
import ProgressBar from '../components/ProgressBar'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'
import { ArrowLeft, CheckCircle, XCircle, MinusCircle, Lightbulb, AlertTriangle, Info, TrendingUp } from 'lucide-react'

const REC_COLORS = {
  critical: { bg: 'rgba(255,0,110,0.08)', border: 'rgba(255,0,110,0.25)', text: '#ff006e', icon: AlertTriangle },
  moderate: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.25)', text: '#fbbf24', icon: Info },
  tip: { bg: 'rgba(0,212,255,0.06)', border: 'rgba(0,212,255,0.18)', text: '#00d4ff', icon: Lightbulb }
}

const BREAKDOWN_LABELS = {
  contact: 'Contact Info',
  sections: 'Sections',
  skills: 'Skills Match',
  jobMatch: 'Job Fit',
  quality: 'Content Quality'
}

const BREAKDOWN_MAX = { contact: 10, sections: 20, skills: 30, jobMatch: 25, quality: 15 }

function SectionBadge({ strength }) {
  if (strength === 'strong') return <span className="neon-tag neon-tag-green text-xs">Strong</span>
  if (strength === 'moderate') return <span className="neon-tag text-xs">Moderate</span>
  return <span className="neon-tag neon-tag-red text-xs">Weak</span>
}

export default function DashboardPage() {
  const { analysisData } = useAnalysis()
  const navigate = useNavigate()

  useEffect(() => {
    if (!analysisData) navigate('/upload')
  }, [analysisData, navigate])

  if (!analysisData) return null

  const { atsScore, atsBreakdown, sections, skills, topSkills, suggestedSkills, recommendations, stats, jobRole } = analysisData

  const radarData = skills.slice(0, 6).map(s => ({
    subject: s.category.replace(' & ', '/').replace('Programming Languages', 'Languages'),
    score: s.score, fullMark: 100
  }))

  const barData = Object.entries(atsBreakdown).map(([key, val]) => ({
    name: BREAKDOWN_LABELS[key] || key,
    score: val,
    max: BREAKDOWN_MAX[key] || 10
  }))

  return (
    <div className="grid-bg min-h-screen" style={{ padding: '40px 16px 80px' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/upload')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '0.85rem'
              }}>
              <ArrowLeft size={14} /> Back
            </button>
            <div>
              <h1 className="font-orbitron font-bold text-white" style={{ fontSize: '1.5rem' }}>
                Analysis <span className="gradient-text">Dashboard</span>
              </h1>
              <p style={{ color: '#475569', fontSize: '0.8rem', marginTop: '2px' }}>
                Role: <span style={{ color: '#00d4ff' }}>{jobRole}</span>
                {!analysisData.isRealResume && <span style={{ color: '#fbbf24', marginLeft: '8px' }}>• Sample Resume</span>}
              </p>
            </div>
          </div>
          <div style={{ color: '#475569', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>
            {new Date(analysisData.analyzedAt).toLocaleString()}
          </div>
        </div>

        {/* Top row: Score + Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* ATS Score */}
          <div className="glass-card flex flex-col items-center justify-center" style={{ padding: '36px 24px', gridColumn: 'span 1' }}>
            <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.08em', marginBottom: '20px' }}>ATS SCORE</p>
            <ScoreRing score={atsScore} size={170} />
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-4" style={{ gridColumn: 'span 1' }}>
            {[
              { label: 'Word Count', value: stats.wordCount, color: '#00d4ff' },
              { label: 'Skills Found', value: stats.skillsFound, color: '#a855f7' },
              { label: 'Sections', value: `${stats.sectionsFound}/7`, color: '#00ff88' },
              { label: 'Readability', value: `${stats.readabilityScore}%`, color: '#fbbf24' },
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                <div className="font-orbitron font-black" style={{ fontSize: '1.6rem', color: s.color }}>{s.value}</div>
                <div style={{ color: '#475569', fontSize: '0.75rem', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ATS Breakdown */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.08em', marginBottom: '16px' }}>ATS BREAKDOWN</p>
            {barData.map((item, i) => (
              <ProgressBar
                key={i}
                label={item.name}
                sublabel={`${item.score}/${item.max}`}
                value={Math.round((item.score / item.max) * 100)}
                color="auto"
                delay={i * 100}
              />
            ))}
          </div>
        </div>

        {/* Middle row: Skills radar + Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Radar */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.06em', marginBottom: '16px' }}>
              SKILLS COVERAGE RADAR
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Sections */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.06em', marginBottom: '16px' }}>
              SECTION ANALYSIS
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sections.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: '8px',
                  background: s.found ? 'rgba(255,255,255,0.03)' : 'rgba(255,0,110,0.04)',
                  border: `1px solid ${s.found ? 'rgba(255,255,255,0.06)' : 'rgba(255,0,110,0.1)'}`
                }}>
                  {s.found
                    ? <CheckCircle size={16} style={{ color: '#00ff88', flexShrink: 0 }} />
                    : <XCircle size={16} style={{ color: '#ff006e', flexShrink: 0 }} />}
                  <span style={{ flex: 1, color: '#e2e8f0', fontSize: '0.875rem' }}>{s.name}</span>
                  <SectionBadge strength={s.strength} />
                  <span className="font-mono" style={{ color: s.found ? '#00d4ff' : '#ff006e', fontSize: '0.8rem', minWidth: '30px', textAlign: 'right' }}>
                    {s.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Bar Chart */}
        <div className="glass-card mb-6" style={{ padding: '24px' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.06em', marginBottom: '20px' }}>
            SKILLS BY CATEGORY
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={skills} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="category" tick={{ fill: '#475569', fontSize: 10 }}
                tickFormatter={v => v.split(' ')[0]} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#0a1225', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', color: '#e2e8f0' }}
                cursor={{ fill: 'rgba(0,212,255,0.06)' }}
              />
              <Bar dataKey="score" fill="#00d4ff" radius={[4, 4, 0, 0]}
                label={{ position: 'top', fill: '#64748b', fontSize: 10, formatter: v => `${v}%` }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom row: Skills + Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Found skills */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} style={{ color: '#00ff88' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.06em' }}>DETECTED SKILLS</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {topSkills.length > 0 ? topSkills.map((s, i) => (
                <span key={i} className="neon-tag neon-tag-green">{s}</span>
              )) : (
                <p style={{ color: '#475569', fontSize: '0.85rem' }}>No skills detected. Try uploading a resume with a skills section.</p>
              )}
            </div>
          </div>

          {/* Missing skills */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div className="flex items-center gap-2 mb-4">
              <MinusCircle size={16} style={{ color: '#ff006e' }} />
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.06em' }}>SUGGESTED SKILLS TO ADD</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {suggestedSkills.map((s, i) => (
                <span key={i} className="neon-tag neon-tag-purple">{s}</span>
              ))}
            </div>
            <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '12px' }}>
              Adding these skills could improve your ATS score by <span style={{ color: '#fbbf24' }}>+{Math.min(15, suggestedSkills.length * 2)} points</span>
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.06em', marginBottom: '20px' }}>
            PERSONALIZED RECOMMENDATIONS
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendations.map((rec, i) => {
              const style = REC_COLORS[rec.type] || REC_COLORS.tip
              const Icon = style.icon
              return (
                <div key={i} style={{
                  background: style.bg, border: `1px solid ${style.border}`,
                  borderRadius: '10px', padding: '16px 18px',
                  display: 'flex', gap: '14px', alignItems: 'flex-start'
                }}>
                  <Icon size={16} style={{ color: style.text, flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.9rem', marginBottom: '4px' }}>{rec.title}</p>
                    <p style={{ color: '#94a3b8', fontSize: '0.825rem', lineHeight: '1.5' }}>{rec.desc}</p>
                  </div>
                  <span style={{
                    flexShrink: 0, fontSize: '0.7rem', fontWeight: '600', padding: '3px 10px',
                    borderRadius: '8px', background: style.bg, border: `1px solid ${style.border}`, color: style.text
                  }}>
                    {rec.type.toUpperCase()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
