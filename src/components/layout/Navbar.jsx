import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Info, Menu, QrCode, ScanLine, ScrollText, X } from 'lucide-react'
import BarcodeMark from '../ui/BarcodeMark'
import './layout.css'

const NAV_ITEMS = [
  { to: '/', label: 'Scanner', icon: ScanLine, end: true },
  { to: '/generate', label: 'Generate', icon: QrCode },
  { to: '/log', label: 'Log', icon: ScrollText },
  { to: '/about', label: 'About', icon: Info }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__brand-icon">
            <BarcodeMark size={20} />
          </span>
          <span>
            Scan<span className="navbar__brand-accent">Forge</span>
          </span>
        </NavLink>

        <nav className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          className="navbar__toggle"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  )
}
