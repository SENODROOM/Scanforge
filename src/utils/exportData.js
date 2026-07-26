function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportAsJson(history) {
  download('scanforge-log.json', JSON.stringify(history, null, 2), 'application/json')
}

export function exportAsCsv(history) {
  const header = ['value', 'format', 'source', 'timestamp']
  const rows = history.map((item) => [
    `"${item.text.replace(/"/g, '""')}"`,
    item.formatLabel,
    item.source,
    new Date(item.timestamp).toISOString()
  ])
  const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n')
  download('scanforge-log.csv', csv, 'text/csv')
}
