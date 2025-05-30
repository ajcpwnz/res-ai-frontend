import { atom, useSetAtom } from 'jotai'
import { useAtom } from 'jotai/index'

export enum PropertyType {
  residential = 'Residential',
  multifamily = 'MultiFamily'
}

export interface Property {
  address: string;
  type: PropertyType
}

interface IProperty {
  'id': string,
  'type': PropertyType,
  stage: string,
  stageComplete: boolean,
  'address': {
    'id': string,
    'propertyId': string,
    'fullAddress': string
  }
}

export const __selectedProperty = atom<IProperty | null>(null)


export const useSelectedProperty = () => {
  const [property, _setProperty] = useAtom(__selectedProperty)
  const { updateList } = usePropertyList()

  const setProperty = (property: IProperty | null) => {
    if (property) {
      updateList(property)
    }


    _setProperty(property)
  }

  return { property, setProperty }
}

export const __steps = atom({
  current: 0,
  total: 5,
})


export const __propertyForm = atom<Record<string, any>>({})

export enum AssesmentStatus {
  idle = 'idle',
  processing = 'processing',
  error = 'error',
}

export const __allProperties = atom<Record<string, any>>({})

export const usePropertyList = () => {
  const setProperties = useSetAtom(__allProperties)

  const updateList = (property: any) => {
    setProperties(old => ({
      ...old,
      [property.id]: property
    }))
  }

  return { updateList }
}


export const __propertyStates = atom<Record<string, {
  id: string,
  status: AssesmentStatus,
  meta: Record<string, any>
}>>({})

export const __error = atom('')
