import { useState } from 'react'
import { Camera, Upload } from 'lucide-react'
import CameraScanner from '../components/scanner/CameraScanner'
import FileScanner from '../components/scanner/FileScanner'
import FormatSelector from '../components/scanner/FormatSelector'
import ResultPanel from '../components/scanner/ResultPanel'
import { DEFAULT_ACTIVE_FORMATS } from '../utils/barcodeFormats'
import './pages.css'

export default function ScannerPage() {
  const [mode, setMode] = useState('camera')
  const [activeFormats, setActiveFormats] = useState(DEFAULT_ACTIVE_FORMATS)
  const [latestResult, setLatestResult] = useState(null)

  const toggleFormat = (value) => {
    setActiveFormats((prev) => (prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]))
  }

  return (
    <div className="scanner-page">
      <header className="scanner-page__header">
        <span className="eyebrow">Scan bay // 01</span>
        <h1>Scan anything, instantly</h1>
        <p>Live camera decoding or drag-and-drop image scanning — every read happens right on this device.</p>
      </header>

      <div className="scanner-page__layout">
        <div className="scanner-page__main">
          <div className="scanner-page__tabs">
            <button
              className={`scanner-page__tab ${mode === 'camera' ? 'scanner-page__tab--active' : ''}`}
              onClick={() => setMode('camera')}
            >
              <Camera size={15} /> Camera
            </button>
            <button
              className={`scanner-page__tab ${mode === 'upload' ? 'scanner-page__tab--active' : ''}`}
              onClick={() => setMode('upload')}
            >
              <Upload size={15} /> Upload
            </button>
          </div>

          {mode === 'camera' ? (
            <CameraScanner activeFormats={activeFormats} onResult={setLatestResult} />
          ) : (
            <FileScanner activeFormats={activeFormats} onResult={setLatestResult} />
          )}

          <FormatSelector
            activeFormats={activeFormats}
            onToggle={toggleFormat}
            onSelectAll={() => setActiveFormats(DEFAULT_ACTIVE_FORMATS)}
            onSelectNone={() => setActiveFormats([])}
          />
        </div>

        <aside className="scanner-page__side">
          <ResultPanel result={latestResult} />
        </aside>
      </div>
    </div>
  )
}
