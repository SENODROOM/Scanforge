import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, Square, Zap, ZapOff } from 'lucide-react'
import { useCameraDevices } from '../../hooks/useCameraDevices'
import { useBarcodeScanner } from '../../hooks/useBarcodeScanner'
import { useScanHistory } from '../../context/ScanHistoryContext'
import { useToast } from '../../context/ToastContext'
import { formatLabel } from '../../utils/barcodeFormats'
import ScanOverlay from './ScanOverlay'
import DeviceSelector from './DeviceSelector'
import Button from '../ui/Button'
import './scanner.css'

export default function CameraScanner({ activeFormats, onResult }) {
  const videoRef = useRef(null)
  const { devices, permissionState, error: deviceError, requestPermissionAndList } = useCameraDevices()
  const { addScan } = useScanHistory()
  const { pushToast } = useToast()
  const [activeDeviceId, setActiveDeviceId] = useState('')
  const [torchOn, setTorchOn] = useState(false)
  const [torchSupported, setTorchSupported] = useState(false)

  const handleDecode = useCallback(
    (result) => {
      const scan = {
        text: result.getText(),
        formatLabel: formatLabel(result.getBarcodeFormat()),
        source: 'camera'
      }
      addScan(scan)
      onResult?.({ ...scan, timestamp: Date.now() })
      pushToast(`Scanned ${scan.formatLabel}`, 'success')
      if (navigator.vibrate) navigator.vibrate(80)
    },
    [addScan, onResult, pushToast]
  )

  const { startCamera, stopCamera, isScanning, lastError } = useBarcodeScanner({
    formats: activeFormats,
    onDecode: handleDecode
  })

  useEffect(() => {
    requestPermissionAndList()
    return () => stopCamera()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (devices.length > 0 && !activeDeviceId) {
      const backCamera = devices.find((d) => /back|rear|environment/i.test(d.label))
      setActiveDeviceId((backCamera || devices[0]).deviceId)
    }
  }, [devices, activeDeviceId])

  const handleStart = async () => {
    if (!videoRef.current) return
    await startCamera(activeDeviceId, videoRef.current)
    const track = videoRef.current.srcObject?.getVideoTracks?.()[0]
    const capabilities = track?.getCapabilities?.()
    setTorchSupported(Boolean(capabilities?.torch))
  }

  const handleStop = () => {
    stopCamera()
    setTorchOn(false)
    setTorchSupported(false)
  }

  const toggleTorch = async () => {
    const track = videoRef.current?.srcObject?.getVideoTracks?.()[0]
    if (!track) return
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] })
      setTorchOn((prev) => !prev)
    } catch {
      pushToast('Torch is not supported on this camera', 'error')
    }
  }

  const handleDeviceChange = async (deviceId) => {
    setActiveDeviceId(deviceId)
    if (isScanning) {
      await startCamera(deviceId, videoRef.current)
    }
  }

  return (
    <div className="camera-scanner">
      <div className="camera-scanner__viewport">
        <video ref={videoRef} className="camera-scanner__video" muted playsInline />
        <ScanOverlay active={isScanning} />
        {permissionState === 'denied' && (
          <div className="camera-scanner__notice">
            Camera access was denied. Enable it in your browser settings to scan live.
          </div>
        )}
      </div>

      <div className="camera-scanner__controls">
        <DeviceSelector
          devices={devices}
          activeDeviceId={activeDeviceId}
          onChange={handleDeviceChange}
          disabled={false}
        />

        <div className="camera-scanner__buttons">
          {!isScanning ? (
            <Button icon={Play} onClick={handleStart} disabled={devices.length === 0}>
              Start scanning
            </Button>
          ) : (
            <Button icon={Square} variant="danger" onClick={handleStop}>
              Stop
            </Button>
          )}
          {torchSupported && (
            <Button icon={torchOn ? ZapOff : Zap} variant="ghost" onClick={toggleTorch} disabled={!isScanning}>
              {torchOn ? 'Torch off' : 'Torch on'}
            </Button>
          )}
        </div>
      </div>

      {(lastError || deviceError) && <p className="camera-scanner__error">{lastError || deviceError}</p>}
    </div>
  )
}
