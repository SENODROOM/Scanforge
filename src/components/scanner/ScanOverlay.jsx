import './scanner.css'

export default function ScanOverlay({ active }) {
  return (
    <div className={`scan-overlay ${active ? 'scan-overlay--active' : ''}`} aria-hidden="true">
      <div className="scan-overlay__frame">
        <span className="scan-overlay__corner scan-overlay__corner--tl" />
        <span className="scan-overlay__corner scan-overlay__corner--tr" />
        <span className="scan-overlay__corner scan-overlay__corner--bl" />
        <span className="scan-overlay__corner scan-overlay__corner--br" />
        {active && <div className="scan-overlay__laser" />}
      </div>
    </div>
  )
}
