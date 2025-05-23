import { DebugProvider } from 'features/DebugProvider.tsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import { ClientPage } from './screens/client'
import { BaseLayout } from './components/layout/BaseLayout'
import { SocketHandler } from './components/SocketHandler'




const App = () => {
  return (
    <div>
      <DebugProvider>
        <SocketHandler />
        <BrowserRouter>
          <Routes>
            <Route element={<BaseLayout />}>
              <Route path="/" element={<span>select property from the list to get started</span>}/>
              <Route path="/p/:id" element={<ClientPage /> }/>
            </Route>
          </Routes>
        </BrowserRouter>
      </DebugProvider>
    </div>
  )
}

export default App
