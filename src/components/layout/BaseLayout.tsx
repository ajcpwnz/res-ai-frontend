import { LayoutHeader } from 'components/layout/Header.tsx'
import { SlidingPanel } from 'components/layout/SlidingPanel.tsx'
import { __authorizedUser } from 'features/auth/state.ts'
import { __error } from 'features/flow/state.ts'
import { useAtom, useAtomValue } from 'jotai/index'
import { Outlet } from 'react-router'
import { Navbar } from './Navbar'

export const BaseLayout = () => {
  const [error, setError] = useAtom(__error)
  const user = useAtomValue(__authorizedUser)


  return <div className="w-screen h-screen overflow-y-hidden grid grid-rows-[50px_1fr] grid-cols-[360px_1fr_400px] bg-gray-50 scrollbar-modest overscroll-none">
    <div className="col-span-3">
      <Navbar/>
    </div>
    {
      user ?
        <>
          <div/>
          <div className="px-4 pb-8 overflow-y-auto flex justify-start items-start flex-col" id="middle-column">
            <LayoutHeader/>
            <Outlet/>
          </div>
          <div className="overflow-y-auto h-screen"/>
          <SlidingPanel />
        </>
        : <div className="w-full col-span-3 flex items-center justify-center"><p>Placeholder for unauthorized users</p>
        </div>
    }
    {error ?
      <div className="fixed p-2 w-full bottom-0 left-0 flex items-center justify-between bg-red-100 text-red-700">{error}
        <b className="cursor-pointer" onClick={() => setError('')}>close</b></div> : null}
  </div>
}
