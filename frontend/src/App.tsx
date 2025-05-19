import { HelmetProvider } from 'react-helmet-async'
import { Route, Routes } from 'react-router-dom'
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
        <div className="h-screen flex flex-col">
          <main className="flex-1 w-full mx-auto">
            <Routes>
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/" element={<ScreensPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
