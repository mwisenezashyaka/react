import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import{browserrouter} from'reactrouter'

createRoot(document.getElementById('root')).render(
 <browserrouter>
 <app/>
 </browserrouter>
)
