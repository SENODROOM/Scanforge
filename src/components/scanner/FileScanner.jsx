import { useCallback, useRef, useState } from 'react'
import { Image as ImageIcon, UploadCloud } from 'lucide-react'
import { useBarcodeScanner } from '../../hooks/useBarcodeScanner'
import { useScanHistory } from '../../context/ScanHistoryContext'
import { useToast } from '../../context/ToastContext'
import { formatLabel } from '../../utils/barcodeFormats'
import './scanner.css'

export default function FileScanner({ activeFormats, onResult }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const { addScan } = useScanHistory()
  const { pushToast } = useToast()

  const handleDecode = useCallback(
    (result) => {
      const scan = {
        text: result.getText(),
        formatLabel: formatLabel(result.getBarcodeFormat()),
        source: 'upload'
      }
      addScan(scan)
      onResult?.({ ...scan, timestamp: Date.now() })
      pushToast(`Decoded ${scan.formatLabel}`, 'success')
    },
    [addScan, onResult, pushToast]
  )

  const { decodeFile, lastError } = useBarcodeScanner({
    formats: activeFormats,
    onDecode: handleDecode
  })

  const processFile = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith('image/')) {
        pushToast('Please choose an image file', 'error')
        return
      }
      setPreview(URL.createObjectURL(file))
      try {
        await decodeFile(file)
      } catch {
        pushToast('No barcode found in that image', 'error')
      }
    },
    [decodeFile, pushToast]
  )

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    processFile(e.dataTransfer.files?.[0])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div
      className={`file-scanner ${isDragging ? 'file-scanner--dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => processFile(e.target.files?.[0])}
      />
      {preview ? (
        <img src={preview} alt="Uploaded barcode preview" className="file-scanner__preview" />
      ) : (
        <>
          <UploadCloud size={26} />
          <p>Drop an image here or click to upload</p>
          <span className="file-scanner__hint">
            <ImageIcon size={13} /> PNG, JPG, or WEBP
          </span>
        </>
      )}
      {lastError && <p className="file-scanner__error">{lastError}</p>}
    </div>
  )
}
