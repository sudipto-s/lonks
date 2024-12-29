import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './css/index.css'
import { AppProvider } from "./context/AppContext"
import { BrowserRouter as Router } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
   <StrictMode>
      <AppProvider>
         <Router>
            <App />
         </Router>
      </AppProvider>
   </StrictMode>,
)
