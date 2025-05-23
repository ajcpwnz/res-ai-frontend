import { LayoutHeader } from 'components/layout/Header.tsx'
import { __error } from 'features/flow/state.ts'
import { PropertyList } from 'features/properties/PropertyList.tsx'
import { useAtom } from 'jotai/index'
import { Outlet } from 'react-router'

export const BaseLayout = () => {
  const [error, setError] = useAtom(__error);

 return <div className="w-screen h-screen overflow-y-auto grid grid-cols-[360px_1fr_400px] bg-gray-50 scrollbar-modest">
    <PropertyList />
    <div className="px-8 pb-8 overflow-y-auto overscroll-none" id="middle-column">
      <LayoutHeader />
      <Outlet />
    </div>
    <div className="overflow-y-auto h-screen">
      {/*<DebugPanel />*/}
    </div>
   {error ? <div className="fixed p-2 w-full bottom-0 left-0 flex items-center justify-between bg-red-100 text-red-700">{error} <b className="cursor-pointer" onClick={() => setError('')}>close</b></div> : null }
  </div>
}
