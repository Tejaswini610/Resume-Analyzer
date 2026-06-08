import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Brain, Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/upload', label: 'Analyze' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/about', label: 'About' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      background: 'rgba(2, 4, 9, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0, 212, 255, 0.12)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div style={{
              background: 'linear-gradient(135deg, #00d4ff20, #a855f720)',
              border: '1px solid rgba(0, 212, 255, 0.4)',
              borderRadius: '10px',
              padding: '7px',
            }} className="group-hover:scale-110 transition-transform">
              <Brain size={20} style={{ color: '#00d4ff' }} />
            </div>
            <span className="font-orbitron font-bold text-white text-lg hidden sm:block">
              RESUME<span style={{ color: '#00d4ff' }}>AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  color: isActive(link.to) ? '#00d4ff' : '#94a3b8',
                  background: isActive(link.to) ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                  border: isActive(link.to) ? '1px solid rgba(0, 212, 255, 0.25)' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive(link.to)) e.target.style.color = '#e2e8f0' }}
                onMouseLeave={e => { if (!isActive(link.to)) e.target.style.color = '#94a3b8' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/upload" className="btn-primary flex items-center gap-2 text-white font-semibold text-sm"
              style={{ padding: '9px 20px', borderRadius: '10px' }}>
              <Zap size={14} />
              Analyze Resume
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden" style={{ color: '#94a3b8' }}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ borderTop: '1px solid rgba(0, 212, 255, 0.1)', padding: '16px 0' }}>
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  color: isActive(link.to) ? '#00d4ff' : '#94a3b8',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  background: isActive(link.to) ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
