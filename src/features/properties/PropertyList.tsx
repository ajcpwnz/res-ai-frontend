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
    <span className={`text-sm text-gray-700 p-1 rounded ${done ? 'bg-green-400' : 'bg-amber-200'}`}>{done ? 'done' : stage}</span>
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
    });

    if (selectedProperty?.id === id) {
      setSelectedProperty(null)
    }
  }

  return (
    <div className="flex flex-col space-y-2 w-full overflow-y-auto py-4 px-2">
      <a href="/p/new" className="w-full">
        <Button variant="outline" className="w-full">NEW PROPERTY</Button>
      </a>
      {Object.values(propertiesDict).map(row => (
        <div
          key={row.id}
          className={`${selectedProperty?.id === row.id ? 'bg-blue-200 hover:bg-blue-100' : 'bg-white hover:bg-gray-200'} flex items-center justify-between rounded-lg px-2 py-2 cursor-pointer`}
        >
          <a href={`/p/${row.id}`} className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{row.id}</span>
              <div className="flex space-x-2 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <a href={`/p/${row.id}`} className="flex items-center">
                      <Edit className="mr-2 h-4 w-4"/>
                      Edit
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleDelete(row.id)} className="flex items-center">
                    <Trash className="mr-2 h-4 w-4"/>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </div>
            <p className="font-bold">{row.address?.fullAddress}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm">{row.type}</span>
              <StageBadge stage={row.stage}/>
            </div>
          </a>
        </div>
      ))}
    </div>
  )
}
