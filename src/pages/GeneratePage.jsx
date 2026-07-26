import QrGenerator from '../components/generate/QrGenerator'
import './pages.css'

export default function GeneratePage() {
  return (
    <div className="generate-page">
      <header className="generate-page__header">
        <span className="eyebrow">Print station</span>
        <h1>Turn text into a scannable label</h1>
        <p>Encode any text, link, or note into a QR code — generated locally and ready to download or print.</p>
      </header>

      <QrGenerator />
    </div>
  )
}
