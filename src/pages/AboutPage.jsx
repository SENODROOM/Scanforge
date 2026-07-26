import { Cpu, Layers, QrCode, ShieldCheck } from 'lucide-react'
import { BARCODE_FORMATS } from '../utils/barcodeFormats'
import Card from '../components/ui/Card'
import './pages.css'

export default function AboutPage() {
  const twoD = BARCODE_FORMATS.filter((f) => f.group === '2D')
  const oneD = BARCODE_FORMATS.filter((f) => f.group === '1D')

  return (
    <div className="about-page">
      <header className="about-page__header">
        <span className="eyebrow">Spec sheet</span>
        <h1>About ScanForge</h1>
        <p>A fast, private barcode and QR scanner that runs entirely client-side.</p>
      </header>

      <div className="about-page__grid">
        <Card className="about-card">
          <ShieldCheck size={20} />
          <h3>Private by design</h3>
          <p>Images and camera frames are decoded on-device. Nothing is uploaded anywhere.</p>
        </Card>
        <Card className="about-card">
          <Cpu size={20} />
          <h3>Powered by ZXing</h3>
          <p>Uses the battle-tested ZXing decoding engine for accurate, fast recognition.</p>
        </Card>
        <Card className="about-card">
          <Layers size={20} />
          <h3>Built to extend</h3>
          <p>Modular React components and hooks make it straightforward to add new features.</p>
        </Card>
        <Card className="about-card">
          <QrCode size={20} />
          <h3>Encodes too</h3>
          <p>Turn any text or link into a printable QR label from the Generate tab.</p>
        </Card>
      </div>

      <Card className="about-formats">
        <h3>Supported formats</h3>
        <div className="about-formats__group">
          <h4>2D codes</h4>
          <ul>
            {twoD.map((f) => (
              <li key={f.value}>{f.label}</li>
            ))}
          </ul>
        </div>
        <div className="about-formats__group">
          <h4>1D barcodes</h4>
          <ul>
            {oneD.map((f) => (
              <li key={f.value}>{f.label}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  )
}
