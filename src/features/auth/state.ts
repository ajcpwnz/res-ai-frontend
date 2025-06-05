import { atom } from 'jotai'

export interface User {
  username: string
  email: string
}

export const __authorizedUser = atom<User | null>(null)

