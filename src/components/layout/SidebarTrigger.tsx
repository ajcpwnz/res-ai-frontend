import { __sidebarOpen } from 'components/layout/state.ts'
import { Button } from 'components/ui/button.tsx'
import { useAtom } from 'jotai/index'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export const SidebarTrigger = () => {
  const [open, setOpen] = useAtom(__sidebarOpen)

  const toggleSidebar = () => {
    setOpen(old => !old)
  }

  return <Button variant="ghost" onClick={toggleSidebar}>
    {open ? <PanelLeftClose className="size-4"/> : <PanelLeftOpen className="size-4"/>}
  </Button>
}
