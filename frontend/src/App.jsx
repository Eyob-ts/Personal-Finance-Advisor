
import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from './features/Auth/AuthContext'
import { AppRoutes } from './routes'
import { Toaster } from 'react-hot-toast'
import DarkModeToggle from './components/DarkModeToggle'

function App() {

  return (
    <AuthProvider>
    <AppRoutes />
    <Toaster position="top-center" reverseOrder={false} />
    <DarkModeToggle />
  </AuthProvider>
  )
}

export default App
