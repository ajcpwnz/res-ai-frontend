import { SidebarTrigger } from 'components/layout/SidebarTrigger.tsx'
import { UserActions } from 'components/layout/UserActions.tsx'
import { __authorizedUser } from 'features/auth/state.ts'
import { __selectedProperty } from 'features/flow/state.ts'
import { useAtomValue } from 'jotai/index'


export const Navbar = () => {
  const user = useAtomValue(__authorizedUser)
  const property = useAtomValue(__selectedProperty)

  return (
    <nav className="w-full h-[50px] bg-white border-b border-gray-200 flex items-center px-4 justify-start">
      <div className="w-[360px]">
        {user ? <SidebarTrigger/> : null }
      </div>
      <div className="flex-grow px-2">
        {property ? <h2 className="text-xl font-bold">{property.address?.fullAddress}</h2> : null}
      </div>

      <UserActions/>
    </nav>
  )
}
