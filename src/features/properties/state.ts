import { Unit } from 'features/flow/steps/PropertyForm.tsx'
import { atom } from 'jotai'

export const __modelData = atom<Record<string, Record<string, any>>>({})

export const __unitConfigurator = atom<Unit[]>([])
