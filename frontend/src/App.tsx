import { HelmetProvider } from 'react-helmet-async'
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/toaster'
import './i18n/config'
import FaqPage from './pages/FaqPage'
import NotFound from './pages/NotFound'
import { ScreensPage } from './pages/ScreensPage'
import TermsPage from './pages/TermsPage'

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="dark" storageKey="rgscreens-theme">
        <div className="min-h-screen flex flex-col">
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <Routes>
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/" element={<ScreensPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
