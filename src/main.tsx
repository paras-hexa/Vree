import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StoreContext } from './stores/StoreContext.ts'
import ConfiguratorStore from './stores/ConfiguratorStore.ts'
import './index.css'
import App from './App.tsx'

const store = new ConfiguratorStore();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
    <App />
    </StoreContext.Provider>
  </StrictMode>,
)
