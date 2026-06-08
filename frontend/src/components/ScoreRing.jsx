import { useEffect, useState } from 'react'

export default function ScoreRing({ score, size = 180 }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - 24) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDash = (animatedScore / 100) * circumference

  const getColor = (s) => s >= 80 ? '#00ff88' : s >= 60 ? '#00d4ff' : s >= 40 ? '#fbbf24' : '#ff006e'
  const getLabel = (s) => s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : s >= 40 ? 'Fair' : 'Needs Work'

  useEffect(() => {
    let start = 0
    const step = score / 60
    const interval = setInterval(() => {
      start += step
      if (start >= score) { setAnimatedScore(score); clearInterval(interval) }
      else setAnimatedScore(Math.round(start))
    }, 16)
    return () => clearInterval(interval)
  }, [score])

  const color = getColor(score)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 12px ${color}50)` }}>
          {/* Track */}
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          {/* Progress */}
          <circle
            cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.05s linear' }}
          />
        </svg>
        {/* Center text */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="font-orbitron font-black" style={{ fontSize: size * 0.22, color }}>{animatedScore}</span>
          <span style={{ fontSize: size * 0.08, color: '#64748b', fontWeight: '500' }}>/ 100</span>
        </div>
      </div>
      <span style={{
        background: `${color}18`, border: `1px solid ${color}40`,
        borderRadius: '12px', padding: '4px 14px', color, fontSize: '0.8rem', fontWeight: '600'
      }}>
        {getLabel(score)}
      </span>
    </div>
  )
}
