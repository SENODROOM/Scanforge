# ScanForge

A fast, private barcode and QR code scanner — built as a modular React app. Every
decode happens on-device via the [ZXing](https://github.com/zxing-js/library) engine;
nothing is ever uploaded to a server.

## Features

- **Live camera scanning** — point any connected camera at a barcode or QR code for
  instant continuous decoding, with device switching and torch/flash support where
  the hardware allows it.
- **Image upload scanning** — drag and drop or select an image to decode a barcode
  from a photo or screenshot.
- **14 supported symbologies** — QR, Data Matrix, Aztec, PDF417, Code 128/39/93,
  Codabar, EAN-13/8, UPC-A/E, ITF, RSS-14 — individually toggleable to improve
  detection speed and accuracy.
- **Scan log** — every read is saved locally (localStorage), searchable, exportable
  to CSV/JSON, and individually deletable.
- **Fully responsive**, keyboard-accessible, and respects `prefers-reduced-motion`.

## Tech stack

| Layer      | Choice                          |
| ---------- | -------------------------------- |
| Framework  | React 18 + Vite 5                |
| Routing    | react-router-dom v6              |
| Decoding   | @zxing/browser + @zxing/library  |
| Icons      | lucide-react                     |
| Styling    | Plain CSS with design tokens (no framework) |
| Storage    | Browser localStorage (no backend)|

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`) in your browser
and allow camera access when prompted.

To build for production:

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

### Camera access in production

Browsers only grant camera access (`getUserMedia`) on **`localhost` or HTTPS**.
When you deploy the `dist/` output, make sure it's served over HTTPS (Vercel,
Netlify, Cloudflare Pages, etc. all do this by default).

## Project structure

```
scanforge/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/            Button, Badge, Card, Toast — shared design-system atoms
│   │   ├── layout/         Navbar, Footer, page shell
│   │   ├── scanner/        Camera + upload scanning, format/device selectors, result panel
│   │   └── history/        Scan log table, toolbar, empty state
│   ├── context/             ScanHistoryContext (persisted log), ToastContext
│   ├── hooks/                useBarcodeScanner, useCameraDevices, useLocalStorage
│   ├── pages/                ScannerPage, HistoryPage, AboutPage
│   ├── utils/                barcodeFormats, exportData (CSV/JSON), formatTimestamp
│   ├── styles/                reset.css, variables.css (design tokens), global.css
│   ├── App.jsx                Routes + providers
│   └── main.jsx                Entry point
├── index.html
├── package.json
└── vite.config.js
```

The structure is intentionally modular: each feature area (scanner, history, ui,
layout) is self-contained with its own components and co-located CSS, and shared
logic lives in `hooks/` and `context/`. Adding a new page or scanning mode means
adding a folder, not touching existing files — this is what makes the app scalable
as it grows (e.g. a batch-scan mode, a browser extension build, or a PWA manifest
could all be added without restructuring anything).

## Extending it

- **Add a barcode format**: add an entry to `BARCODE_FORMATS` in
  `src/utils/barcodeFormats.js` — it automatically appears in the format selector
  and the About page's spec sheet.
- **Add a page**: create a component in `src/pages/`, add a `<Route>` in `App.jsx`,
  and a link in `src/components/layout/Navbar.jsx`.
- **Change the persistence layer**: swap `useLocalStorage` inside
  `ScanHistoryContext.jsx` for an API-backed hook — the rest of the app is unaware
  of where the log is stored.

## Notes

- Continuous camera scanning silently ignores back-to-back duplicate reads of the
  same value within a 3-second window, so holding a code steady in frame doesn't
  spam the log.
- The scan log keeps the most recent 500 entries.
