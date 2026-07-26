import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScanHistoryProvider } from './context/ScanHistoryContext'
import { ToastProvider } from './context/ToastContext'
import Layout from './components/layout/Layout'
import ScannerPage from './pages/ScannerPage'
import GeneratePage from './pages/GeneratePage'
import HistoryPage from './pages/HistoryPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <ToastProvider>
      <ScanHistoryProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<ScannerPage />} />
              <Route path="generate" element={<GeneratePage />} />
              <Route path="log" element={<HistoryPage />} />
              <Route path="about" element={<AboutPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ScanHistoryProvider>
    </ToastProvider>
  )
}
