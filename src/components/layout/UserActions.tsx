import { Avatar, AvatarFallback } from 'components/ui/avatar.tsx'
import { Button } from 'components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'components/ui/dropdown-menu.tsx'
import { useLogin } from 'features/auth/hooks.ts'
import { __authorizedUser } from 'features/auth/state.ts'
import { useAtomValue } from 'jotai/index'
import { EllipsisVertical, LogOut, Sparkles } from 'lucide-react'
import { Link } from 'react-router'

function extractInitials(name?: string | null): string {
  if (!name) {
    return '×'
  }

  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return '×'
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[1].charAt(0).toUpperCase()
  )
}

export const UserActions = () => {
  const user = useAtomValue(__authorizedUser)

  const { logoutUser } = useLogin()

  return user ?    <div className="flex space-x-2">   <a href="/p/new" className="w-full">
    <Button variant="outline" className="w-full">NEW PROPERTY</Button>
  </a> <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        className="
              inline-flex items-center justify-between
              px-3
              rounded-md
              focus:outline-none space-x-2
            "
      >
        <Avatar>
          <AvatarFallback>{extractInitials(user.username)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-start overflow-hidden">
              <span className="font-medium text-sm text-gray-800 truncate">
                {user.username}
              </span>
          <span className="text-xs text-gray-500 truncate">
                {user.email}
              </span>
        </div>
        <EllipsisVertical className="ml-2 w-4 h-4 text-gray-500"/>
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      className="
            w-[var(--radix-dropdown-menu-trigger-width)]
            min-w-[14rem]                   /* roughly Tailwind’s `56` */
            bg-white
            border border-gray-200
            rounded-md shadow-md
            p-1
          "
      align="end"
      sideOffset={4}
    >
      <DropdownMenuItem
        className="
              flex items-center gap-2
              px-3 py-2
              rounded hover:bg-gray-100
            "
      >
        <Sparkles className="w-4 h-4 text-gray-600"/>
        <span className="text-sm text-gray-800">Upgrade to Pro</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator className="my-1 border-gray-200"/>


      <DropdownMenuItem
        onClick={logoutUser}
        className="
              flex items-center gap-2
              px-3 py-2
              rounded hover:bg-gray-100
            "
      >
        <LogOut className="w-4 h-4 text-gray-600"/>
        <span className="text-sm text-gray-800">Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu></div> : <div className="flex space-x-2">
    <Link to="/login"><Button variant="secondary">Log In</Button></Link>
    <Link to="/signup"><Button>Sign Up</Button></Link>
  </div>
}
