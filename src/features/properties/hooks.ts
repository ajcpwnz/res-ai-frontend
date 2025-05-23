import { __modelData } from 'features/properties/state.ts'
import { useSetAtom } from 'jotai'
import { useAtom, useAtomValue } from 'jotai/index'
import { useCallback } from 'react'

export const useUpdateModel = () => {
  const setModelData = useSetAtom(__modelData);

  return useCallback((id: string, stage: string, key: string, data: any) => {
    setModelData(old => ({
      ...old,
      [id]: {
        ...(old[id] || {}),
        [stage]: {
          ...(old[id]?.[stage] || {}),
          [key]: data
        }
      }
    }))
  }, [setModelData]);
}

export const useModel = (id?: string) => {
  const modelData = useAtomValue(__modelData);

  return id ? modelData[id] || {} : {}
}
