import { useEffect, useRef, useState } from 'react'

export default function ProgressBar({ value, label, sublabel, color = '#00d4ff', delay = 0 }) {
  const [width, setWidth] = useState(0)
  const ref = useRef()

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay + 100)
    return () => clearTimeout(timer)
  }, [value, delay])

  const barColor = color === 'auto'
    ? value >= 75 ? '#00ff88' : value >= 50 ? '#00d4ff' : value >= 25 ? '#fbbf24' : '#ff006e'
    : color

  return (
    <div style={{ marginBottom: '14px' }} ref={ref}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div>
          <span style={{ color: '#e2e8f0', fontSize: '0.875rem', fontWeight: '500' }}>{label}</span>
          {sublabel && <span style={{ color: '#475569', fontSize: '0.75rem', marginLeft: '8px' }}>{sublabel}</span>}
        </div>
        <span style={{ color: barColor, fontSize: '0.875rem', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace' }}>
          {value}%
        </span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${width}%`, borderRadius: '3px',
          background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
          boxShadow: `0 0 8px ${barColor}60`,
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>
    </div>
  )
}
