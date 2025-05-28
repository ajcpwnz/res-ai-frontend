import React, { useState, useEffect } from 'react'
import { Label } from 'components/ui/label'
import { Input } from 'components/ui/input'

type Unit = {
  bedrooms: number
  rent: number
}

interface UnitConfiguratorProps {
  value: Unit[]
  onChange: (units: Unit[]) => void
}

export const RentConfigurator: React.FC<UnitConfiguratorProps> = ({ value, onChange }) => {
  const [units, setUnits] = useState<Unit[]>([])

  useEffect(() => {
    if (value && value.length) {
      setUnits(value)
    }
  }, [value])

  const updateRent = (index: number, newRent: number) => {
    const updated = units.map((u, i) => i === index ? { ...u, rent_avm: newRent } : u)
    setUnits(updated)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <Label className="flex justify-between items-center">
        <span>Rent by Unit Type</span>
      </Label>

      <div className="flex flex-col space-y-2">
        {units.map((unit, idx) => (
          <div key={idx} className="flex items-center space-x-4">
            <Label className="whitespace-nowrap">
              {unit.bedrooms} bedrooms/{unit.bathrooms}
            </Label>
            <Input
              type="number"
              min={0}
              value={unit.rent_avm}
              onChange={e => updateRent(idx, parseInt(e.target.value, 10) || 0)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
