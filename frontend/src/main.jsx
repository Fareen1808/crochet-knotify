import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { store } from './store/store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fffdf7',
              color: '#4a3728',
              borderRadius: '12px',
              border: '1px solid #fbd5d5',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
