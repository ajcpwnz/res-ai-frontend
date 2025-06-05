import { useEffect } from 'react'
import { Button } from 'components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from 'components/ui/dropdown-menu.tsx'
import { MoreVertical, Edit, Trash } from 'lucide-react'
import { Link } from 'react-router'
import { useAtom, useAtomValue } from 'jotai/index'
import { __allProperties, __selectedProperty } from 'features/flow/state.ts'
import { getProperties, deleteProperty } from 'utils/api.ts'

const StageBadge = ({ stage }: { stage: string }) => {
  const done = stage === 'stage_5'
  return (
    <span className={`text-xs text-gray-700 p-1 rounded ${done ? 'bg-green-400' : 'bg-amber-200'}`}>{(done ? 'done' : stage.replace('_', ' ')).toLocaleUpperCase()}</span>
  )
}

export const PropertyList = () => {
  const selectedProperty = useAtomValue(__selectedProperty)
  const [, setSelectedProperty] = useAtom(__selectedProperty)
  const [propertiesDict, setProperties] = useAtom(__allProperties)

  useEffect(() => {
    getProperties().then(data => {
      const dict = data.properties.reduce<Record<string, any>>((acc, prop) => {
        acc[prop.id] = prop
        return acc
      }, {})
      setProperties(dict)
    })
  }, [])

  const handleDelete = async (id: string) => {
    await deleteProperty(id)

    setProperties(prev => {
      const { [id]: _, ...rest } = prev
      return rest
    })

    if (selectedProperty?.id === id) {
      setSelectedProperty(null)
    }
  }

  return (
    <div className="flex flex-col w-full overflow-y-auto border-r min-h-screen bg-white">
      {Object.values(propertiesDict).map((row) => (
        <a
          key={row.id}
          href={`/p/${row.id}`}
          className={`
      ${
            selectedProperty?.id === row.id
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'bg-white text-inherit'
          }
      hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
      flex flex-row items-start gap-2
      border-b p-4 text-sm leading-tight whitespace-nowrap
      last:border-b-0
    `}
        >
          <div className="flex flex-grow flex-col space-y-2">
            <div className="flex w-full items-center gap-2">
              <span className="text-sm">{row.type}</span>
              <div className="ml-auto">
                <StageBadge stage={row.stage}/>
              </div>
            </div>
            <span className="font-semibold">{row.address?.fullAddress}</span>
          </div>

        </a>
      ))}

    </div>
  )
}
