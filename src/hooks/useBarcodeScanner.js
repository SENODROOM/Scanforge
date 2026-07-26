import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import { DecodeHintType, NotFoundException } from '@zxing/library'

/**
 * Wraps ZXing's BrowserMultiFormatReader to provide:
 *  - continuous decoding from a live camera video element
 *  - one-shot decoding from an uploaded image file
 *
 * `formats` is a list of ZXing BarcodeFormat values to restrict detection to,
 * which improves both accuracy and scan speed.
 */
export function useBarcodeScanner({ formats = [], onDecode } = {}) {
  const controlsRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [lastError, setLastError] = useState(null)

  const buildReader = useCallback(() => {
    const hints = new Map()
    if (formats && formats.length > 0) {
      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats)
    }
    hints.set(DecodeHintType.TRY_HARDER, true)
    return new BrowserMultiFormatReader(hints)
  }, [formats])

  const stopCamera = useCallback(() => {
    controlsRef.current?.stop()
    controlsRef.current = null
    setIsScanning(false)
  }, [])

  const startCamera = useCallback(
    async (deviceId, videoElement) => {
      stopCamera()
      setLastError(null)
      const reader = buildReader()
      try {
        const controls = await reader.decodeFromVideoDevice(
          deviceId || undefined,
          videoElement,
          (result, err) => {
            if (result) {
              onDecode?.(result)
            }
            if (err && !(err instanceof NotFoundException)) {
              setLastError(err.message)
            }
          }
        )
        controlsRef.current = controls
        setIsScanning(true)
      } catch (err) {
        setLastError(err.message || 'Unable to start the camera')
        setIsScanning(false)
      }
    },
    [buildReader, onDecode, stopCamera]
  )

  const decodeFile = useCallback(
    async (file) => {
      setLastError(null)
      const reader = buildReader()
      const url = URL.createObjectURL(file)
      try {
        const result = await reader.decodeFromImageUrl(url)
        onDecode?.(result)
        return result
      } catch (err) {
        setLastError('No barcode was found in that image')
        throw err
      } finally {
        URL.revokeObjectURL(url)
      }
    },
    [buildReader, onDecode]
  )

  useEffect(() => stopCamera, [stopCamera])

  return { startCamera, stopCamera, decodeFile, isScanning, lastError }
}
