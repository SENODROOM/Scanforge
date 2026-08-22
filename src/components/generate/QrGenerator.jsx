import { useCallback, useEffect, useRef, useState } from 'react'
import { Copy, Download, FileImage, ImageUp, QrCode, X } from 'lucide-react'
import { useQrGenerator } from '../../hooks/useQrGenerator'
import { useScanHistory } from '../../context/ScanHistoryContext'
import { useToast } from '../../context/ToastContext'
import { drawLogoOnCanvas, embedLogoInSvg, loadImage } from '../../utils/qrLogo'
import Button from '../ui/Button'
import '../ui/ui.css'
import './generate.css'

const ERROR_LEVELS = [
  { value: 'L', label: 'L · 7%' },
  { value: 'M', label: 'M · 15%' },
  { value: 'Q', label: 'Q · 25%' },
  { value: 'H', label: 'H · 30%' }
]

const SIZE_OPTIONS = [
  { value: 200, label: 'Small' },
  { value: 320, label: 'Medium' },
  { value: 480, label: 'Large' }
]

const MAX_LENGTH = 2000
const MAX_LOGO_BYTES = 2 * 1024 * 1024
const RENDER_COLORS = { dark: '#000000', light: '#ffffff' }

export default function QrGenerator() {
  const [text, setText] = useState('')
  const [errorLevel, setErrorLevel] = useState('M')
  const [size, setSize] = useState(320)
  const [hasCode, setHasCode] = useState(false)
  const [logoDataUrl, setLogoDataUrl] = useState(null)
  const canvasRef = useRef(null)
  const logoImageRef = useRef(null)
  const logoInputRef = useRef(null)

  const { renderToCanvas, toSvgString, error } = useQrGenerator()
  const { addScan } = useScanHistory()
  const { pushToast } = useToast()

  useEffect(() => {
    const trimmed = text.trim()
    const canvas = canvasRef.current

    if (!trimmed) {
      setHasCode(false)
      const ctx = canvas?.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      return undefined
    }

    const timeout = setTimeout(async () => {
      try {
        await renderToCanvas(canvas, trimmed, {
          width: size,
          margin: 2,
          errorCorrectionLevel: errorLevel,
          color: RENDER_COLORS
        })
        if (logoDataUrl && logoImageRef.current) {
          drawLogoOnCanvas(canvas, logoImageRef.current)
        }
        setHasCode(true)
      } catch {
        setHasCode(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [text, size, errorLevel, logoDataUrl, renderToCanvas])

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      pushToast('Please choose an image file', 'error')
      return
    }
    if (file.size > MAX_LOGO_BYTES) {
      pushToast('Image is too large (max 2MB)', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result
      try {
        logoImageRef.current = await loadImage(dataUrl)
        setLogoDataUrl(dataUrl)
      } catch {
        pushToast('Unable to load that image', 'error')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    logoImageRef.current = null
    setLogoDataUrl(null)
  }

  const logGeneration = useCallback(() => {
    addScan({ text: text.trim(), formatLabel: 'QR Code', source: 'generated' })
  }, [text, addScan])

  const handleDownloadPng = () => {
    if (!hasCode || !canvasRef.current) return
    const link = document.createElement('a')
    link.href = canvasRef.current.toDataURL('image/png')
    link.download = 'qrcode.png'
    link.click()
    logGeneration()
    pushToast('QR code downloaded as PNG', 'success')
  }

  const handleDownloadSvg = async () => {
    if (!hasCode) return
    try {
      let svg = await toSvgString(text.trim(), {
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: RENDER_COLORS
      })
      if (logoDataUrl) {
        svg = embedLogoInSvg(svg, logoDataUrl)
      }
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'qrcode.svg'
      link.click()
      URL.revokeObjectURL(url)
      logGeneration()
      pushToast('QR code downloaded as SVG', 'success')
    } catch {
      pushToast('Unable to export as SVG', 'error')
    }
  }

  const handleCopyImage = () => {
    if (!hasCode || !canvasRef.current) return
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
      pushToast('Copying images is not supported in this browser', 'error')
      return
    }
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        logGeneration()
        pushToast('QR code copied to clipboard', 'success')
      } catch {
        pushToast('Could not copy the image', 'error')
      }
    }, 'image/png')
  }

  return (
    <div className="qr-generator">
      <div className="qr-generator__form">
        <label className="qr-generator__label" htmlFor="qr-generator-text">
          Text, link, or any content to encode
        </label>
        <textarea
          id="qr-generator-text"
          className="qr-generator__textarea"
          placeholder="https://example.com or any text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          maxLength={MAX_LENGTH}
        />
        <div className="qr-generator__meta">
          <span>
            {text.length} / {MAX_LENGTH}
          </span>
        </div>

        <div className="qr-generator__options">
          <div className="qr-generator__option-group">
            <span className="qr-generator__option-label">Error correction</span>
            <div className="qr-generator__chips">
              {ERROR_LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  className={`toggle-chip ${errorLevel === level.value ? 'toggle-chip--active' : ''}`}
                  onClick={() => setErrorLevel(level.value)}
                  aria-pressed={errorLevel === level.value}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          <div className="qr-generator__option-group">
            <span className="qr-generator__option-label">Size</span>
            <div className="qr-generator__chips">
              {SIZE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`toggle-chip ${size === opt.value ? 'toggle-chip--active' : ''}`}
                  onClick={() => setSize(opt.value)}
                  aria-pressed={size === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="qr-generator__option-group">
            <span className="qr-generator__option-label">Center image (optional)</span>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleLogoUpload}
            />
            {logoDataUrl ? (
              <div className="qr-generator__logo-preview">
                <img src={logoDataUrl} alt="Uploaded center logo" className="qr-generator__logo-thumb" />
                <span className="qr-generator__logo-name">Image added for styling</span>
                <button
                  type="button"
                  className="qr-generator__logo-remove"
                  onClick={handleRemoveLogo}
                  aria-label="Remove center image"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="toggle-chip qr-generator__logo-add"
                onClick={() => logoInputRef.current?.click()}
              >
                <ImageUp size={14} /> Upload image
              </button>
            )}
            {logoDataUrl && (errorLevel === 'L' || errorLevel === 'M') && (
              <p className="qr-generator__hint">
                For reliable scanning with a center image, use Q or H error correction.
              </p>
            )}
          </div>
        </div>

        {error && <p className="qr-generator__error">{error}</p>}
      </div>

      <div className="qr-generator__preview">
        <span className="eyebrow">Printed label</span>
        <div className="qr-generator__label-card">
          <canvas ref={canvasRef} width={size} height={size} className="qr-generator__canvas" />
          {!hasCode && (
            <div className="qr-generator__placeholder">
              <QrCode size={28} />
              <p>Your QR code will appear here</p>
            </div>
          )}
        </div>
        <div className="qr-generator__actions">
          <Button icon={Download} onClick={handleDownloadPng} disabled={!hasCode}>
            PNG
          </Button>
          <Button icon={FileImage} variant="ghost" onClick={handleDownloadSvg} disabled={!hasCode}>
            SVG
          </Button>
          <Button icon={Copy} variant="ghost" onClick={handleCopyImage} disabled={!hasCode}>
            Copy
          </Button>
        </div>
      </div>
    </div>
  )
}
