import { useEffect } from 'react'
import { useDebug } from './DebugProvider'

export const Debug = ({ data, kei }: { data: any, kei: string }) => {
  const { addEntry } = useDebug()

  useEffect(() => {
    addEntry(kei, data)
  }, [data, kei])

  return null
}
