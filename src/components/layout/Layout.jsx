import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ToastContainer from '../ui/ToastContainer'

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-shell__main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  )
}
