import React, { useState, useEffect } from 'react'
import { Label } from 'components/ui/label'
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button'
import { Trash2 } from 'lucide-react'

type Unit = { bedrooms: number; bathrooms: number; quantity: number }

interface UnitConfiguratorProps {
  value: Unit[]
  onChange: (units: Unit[]) => void
}

export const UnitConfigurator: React.FC<UnitConfiguratorProps> = ({ value, onChange }) => {
  const [units, setUnits] = useState<Unit[]>([])

  useEffect(() => {
    if (value && value.length) {
      setUnits(value)
    } else {
      setUnits([
        { bedrooms: 1, bathrooms: 1, quantity: 0 },
        { bedrooms: 2, bathrooms: 1, quantity: 0 },
        { bedrooms: 3, bathrooms: 1, quantity: 0 },
      ])
    }
  }, [value])

  const updateUnit = (index: number, key: keyof Unit, newVal: number) => {
    const updated = units.map((u, i) => i === index ? { ...u, [key]: newVal } : u)
    setUnits(updated)
    onChange(updated)
  }

  const addType = () => {
    const updated = [...units, { bedrooms: 0, bathrooms: 0, quantity: 0 }]
    setUnits(updated)
    onChange(updated)
  }

  const deleteType = (index: number) => {
    const updated = units.filter((_, i) => i !== index)
    setUnits(updated)
    onChange(updated)
  }

  const total = units.reduce((sum, u) => sum + u.quantity, 0)

  return (
    <div className="space-y-4">
        <Label className="flex justify-between items-center">
          <span>Unit Breakdown</span>
          <span>Total units: <b>{total}</b></span>
        </Label>

      <div className="flex flex-col space-y-2">

        <div className="grid grid-cols-[1fr_1fr_1fr_36px] gap-2 items-end">
          <Label>Bedrooms</Label>
          <Label>Bathrooms</Label>
          <Label>Qty</Label>
          <div/>

          {units.map((unit, idx) => (
            <React.Fragment key={idx}>
              <Input
                type="number"
                min={0}
                value={unit.bedrooms}
                onChange={e => updateUnit(idx, 'bedrooms', parseInt(e.target.value) || 0)}
              />
              <Input
                type="number"
                min={0}
                value={unit.bathrooms}
                onChange={e => updateUnit(idx, 'bathrooms', parseInt(e.target.value) || 0)}
              />
              <Input
                type="number"
                min={0}
                value={unit.quantity}
                onChange={e => updateUnit(idx, 'quantity', parseInt(e.target.value) || 0)}
              />
              <Button size="icon" variant="ghost" onClick={() => deleteType(idx)}>
                <Trash2 className="h-4 w-4"/>
              </Button>
            </React.Fragment>
          ))}
        </div>
        <Button size="sm" variant="outline" onClick={addType}>
          Add New Type
        </Button>
      </div>
    </div>
  )
}
