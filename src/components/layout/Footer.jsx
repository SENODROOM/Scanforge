import BarcodeMark from '../ui/BarcodeMark'
import './layout.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__brand">
          <BarcodeMark size={13} /> ScanForge
        </span>
        <p>Every scan is decoded on this device. Nothing is uploaded, ever.</p>
        <p className="footer__meta">React · ZXing</p>
      </div>
    </footer>
  )
}
