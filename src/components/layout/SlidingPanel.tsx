import { __sidebarOpen } from 'components/layout/state.ts'
import { PropertyList } from 'features/properties/PropertyList.tsx'
import { useAtomValue } from 'jotai/index'
import path from 'path'
import { useLocation } from 'react-router'

export const SlidingPanel = () => {
  const sidebarOpen = useAtomValue(__sidebarOpen)
  const { pathname } = useLocation()

  const showSidebar = sidebarOpen || pathname === '/'

  return (
    <div
      className={`
        fixed left-0 top-[50px] w-[360px] max-h-screen overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <PropertyList/>
    </div>
  )
}
