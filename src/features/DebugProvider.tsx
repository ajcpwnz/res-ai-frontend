import React, { createContext, useContext, useState, ReactNode } from 'react'

type DebugEntry = {
  id: string
  data: any
}

type DebugContextType = {
  addEntry: (id: string, data: any) => void
  entries: DebugEntry[]
}

const DebugContext = createContext<DebugContextType | undefined>(undefined)

export const DebugProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<DebugEntry[]>([])

  const addEntry = (id: string, data: any) => {
    setEntries((prev) => {
      const existing = prev.find((e) => e.id === id)
      if (existing) {
        return prev.map((e) => (e.id === id ? { id, data } : e))
      }
      return [...prev, { id, data }]
    })
  }

  return (
    <DebugContext.Provider value={{ addEntry, entries }}>
      {children}
    </DebugContext.Provider>
  )
}

export const useDebug = () => {
  const ctx = useContext(DebugContext)
  if (!ctx) throw new Error("useDebug must be used within DebugProvider")
  return ctx
}
