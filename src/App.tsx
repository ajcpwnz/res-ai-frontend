import { SigninPage } from '@/screens/signin.tsx'
import { __authorizedUser } from 'features/auth/state.ts'
import { DebugProvider } from 'features/DebugProvider.tsx'
import { useSetAtom } from 'jotai'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router'
import { getProfile } from 'utils/api.ts'
import { ClientPage } from './screens/client'
import { BaseLayout } from './components/layout/BaseLayout'
import { SocketHandler } from './components/SocketHandler'
import { SignupPage } from './screens/signup'


const App = () => {
  const [loading, setLoading] = useState(true);

  const setUser = useSetAtom(__authorizedUser)

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('jwt_token')
      if (!token) {
        setLoading(false);
        return
      }
      try {
        const res = await getProfile()
        setUser(res)
      } catch {
        localStorage.removeItem('jwt_token');
        setUser(null)
      } finally {
        setLoading(false);
      }
    })()
  }, [])


  return (
    <div>
      <div className={`fixed z-50 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'} bg-white w-full h-full top-0 left-0 flex items-center justify-center`}>
        <Loader2 className="size-20 text-blue-300 animate-spin" />
      </div>
      <DebugProvider>
        <SocketHandler/>
        <BrowserRouter>
          <Routes>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="/login" element={<SigninPage/>}/>
            <Route element={<BaseLayout/>}>
              <Route path="/" element={<span>select property from the list or <Link className="underline underline-offset-4" to="/p/new">create a new one</Link> to get started</span>}/>
              <Route path="/p/:id" element={<ClientPage/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </DebugProvider>
    </div>
  )
}

export default App
