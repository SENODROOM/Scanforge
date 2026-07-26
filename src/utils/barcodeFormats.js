import { BarcodeFormat } from '@zxing/library'

/**
 * The set of barcode/QR formats ScanForge can detect, with display labels
 * grouped by 2D (matrix) vs 1D (linear) symbologies for the format selector
 * and the about page's spec sheet.
 */
export const BARCODE_FORMATS = [
  { value: BarcodeFormat.QR_CODE, label: 'QR Code', group: '2D' },
  { value: BarcodeFormat.DATA_MATRIX, label: 'Data Matrix', group: '2D' },
  { value: BarcodeFormat.AZTEC, label: 'Aztec', group: '2D' },
  { value: BarcodeFormat.PDF_417, label: 'PDF417', group: '2D' },
  { value: BarcodeFormat.CODE_128, label: 'Code 128', group: '1D' },
  { value: BarcodeFormat.CODE_39, label: 'Code 39', group: '1D' },
  { value: BarcodeFormat.CODE_93, label: 'Code 93', group: '1D' },
  { value: BarcodeFormat.CODABAR, label: 'Codabar', group: '1D' },
  { value: BarcodeFormat.EAN_13, label: 'EAN-13', group: '1D' },
  { value: BarcodeFormat.EAN_8, label: 'EAN-8', group: '1D' },
  { value: BarcodeFormat.UPC_A, label: 'UPC-A', group: '1D' },
  { value: BarcodeFormat.UPC_E, label: 'UPC-E', group: '1D' },
  { value: BarcodeFormat.ITF, label: 'ITF', group: '1D' },
  { value: BarcodeFormat.RSS_14, label: 'RSS-14', group: '1D' }
]

export const DEFAULT_ACTIVE_FORMATS = BARCODE_FORMATS.map((f) => f.value)

export function formatLabel(formatValue) {
  const found = BARCODE_FORMATS.find((f) => f.value === formatValue)
  return found ? found.label : 'Unknown'
}
