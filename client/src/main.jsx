import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './css/index.css'
import "./utils/disableDevTools"

createRoot(document.getElementById('root')).render(
   <StrictMode>
      <App />
   </StrictMode>,
)
