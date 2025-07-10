import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './context/Admin.context.jsx'
import DoctorContextProvider from './context/Doctor.context.jsx'
import AppContextProvider from './context/App.context.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <DoctorContextProvider>
        <AdminContextProvider>
          <App />
        </AdminContextProvider>
      </DoctorContextProvider>
    </AppContextProvider>
  </BrowserRouter>,
)
