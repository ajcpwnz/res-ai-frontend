import React, { useState, useEffect, useMemo } from 'react'
import { Label } from 'components/ui/label'
import { Input } from 'components/ui/input'
import { Button } from 'components/ui/button'
import { Trash2 } from 'lucide-react'

type Unit = { bedrooms: number; bathrooms: number; quantity: number }

interface UnitConfiguratorProps {
  value: Unit[]
  onChange: (units: Unit[]) => void
  mode: 'MultiFamily' | 'Residential' | 'SingleFamily'
}

export const UnitConfigurator: React.FC<UnitConfiguratorProps> = ({
  value,
  onChange,
  mode,
}) => {
  const [units, setUnits] = useState<Unit[]>([])

  const computeTotal = (arr: Unit[]) =>
    arr.reduce((sum, u) => sum + u.quantity, 0)

  const unitsEqual = (a: Unit[] | undefined, b: Unit[]) => {
    if (!Array.isArray(a)) return false
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (
        a[i].bedrooms !== b[i].bedrooms ||
        a[i].bathrooms !== b[i].bathrooms ||
        a[i].quantity !== b[i].quantity
      ) {
        return false
      }
    }
    return true
  }

  const clampResidentialQuantity = (otherSum: number, desired: number) => {
    const minAllowed = Math.max(0, 2 - otherSum)
    const maxAllowed = 4 - otherSum
    if (desired < minAllowed) return minAllowed
    if (desired > maxAllowed) return maxAllowed
    return desired
  }

  useEffect(() => {
    let newUnits: Unit[] = []

    if (mode === 'SingleFamily') {
      // Exactly one unit, quantity locked at 1.
      // If `value[0]` exists, pull bedrooms/bathrooms from it; otherwise default to 1/1.
      const base = value && value.length > 0
        ? value[0]
        : { bedrooms: 1, bathrooms: 1, quantity: 1 }

      const single: Unit = {
        bedrooms: base.bedrooms,
        bathrooms: base.bathrooms,
        quantity: 1,
      }
      newUnits = [single]
    }
    else if (mode === 'Residential') {
      if (value && value.length > 0) {
        const total = computeTotal(value)
        if (total < 2 || total > 4) {
          const adjusted = value.map(u => ({ ...u }))
          if (total < 2) {
            const delta = 2 - total
            adjusted[0].quantity = adjusted[0].quantity + delta
          }
          if (total > 4) {
            let excess = total - 4
            for (let i = adjusted.length - 1; i >= 0 && excess > 0; i--) {
              const take = Math.min(adjusted[i].quantity, excess)
              adjusted[i].quantity = adjusted[i].quantity - take
              excess -= take
            }
          }

          newUnits = adjusted
        } else {
          newUnits = value
        }
      } else {
        newUnits = [
          { bedrooms: 1, bathrooms: 1, quantity: 1 },
          { bedrooms: 2, bathrooms: 1, quantity: 1 },
        ]
      }
    }
    else {
      if (value && value.length > 0) {
        newUnits = value
      } else {
        newUnits = [
          { bedrooms: 1, bathrooms: 1, quantity: 0 },
          { bedrooms: 2, bathrooms: 1, quantity: 0 },
          { bedrooms: 3, bathrooms: 1, quantity: 0 },
        ]
      }
    }

    if (!unitsEqual(value, newUnits)) {
      onChange(newUnits)
    }

    setUnits(newUnits)
  }, [value, mode])

  const updateUnit = (index: number, key: keyof Unit, rawVal: number) => {
    if (mode === 'SingleFamily' && key === 'quantity') {
      return
    }

    const updated = units.map((u, i) => ({
      ...u,
      ...(i === index ? { [key]: rawVal } : {}),
    }))

    if (mode === 'Residential' && key === 'quantity') {
      const otherSum = units.reduce(
        (sum, u, i) => (i === index ? sum : sum + u.quantity),
        0
      )
      updated[index].quantity = clampResidentialQuantity(otherSum, rawVal)
    }

    setUnits(updated)
    onChange(updated)
  }

  const addType = () => {
    if (mode === 'SingleFamily') return;

    const updated = [...units, { bedrooms: 0, bathrooms: 0, quantity: 1 }]
    setUnits(updated)
    onChange(updated)
  }

  const deleteType = (index: number) => {
    if (mode === 'SingleFamily') {
      return
    }
    const updated = units.filter((_, i) => i !== index)

    if (mode === 'Residential') {
      // After removing, ensure total ≥ 2
      const totalAfter = computeTotal(updated)
      if (totalAfter < 2) {
        // Bump first row’s quantity
        updated[0] = {
          ...updated[0],
          quantity: updated[0].quantity + (2 - totalAfter),
        }
      }
    }

    setUnits(updated)
    onChange(updated)
  }

  const total = computeTotal(units)

  const showAddNew = useMemo(() => {
    if(mode ===  'SingleFamily') return false;
    if(mode === 'MultiFamily') return true;
    return total < 4;

  }, [mode, total])


  return (
    <div className="space-y-4">
      <Label className="flex justify-between items-center">
        <span>Unit Breakdown</span>
        {mode !== 'SingleFamily' && (
          <span>
            Total units: <b>{total}</b>
          </span>
        )}
      </Label>

      <div className="flex flex-col space-y-2">
        <div className="grid grid-cols-[1fr_1fr_1fr_36px] gap-2 items-end">
          <Label>Bedrooms</Label>
          <Label>Bathrooms</Label>
          <Label>Qty</Label>
          <div />

          {units.map((unit, idx) => (
            <React.Fragment key={idx}>
              <Input
                type="number"
                min={1}
                value={unit.bedrooms}
                onChange={(e) =>
                  updateUnit(idx, 'bedrooms', parseInt(e.target.value, 10) || 0)
                }
              />
              <Input
                type="number"
                min={1}
                value={unit.bathrooms}
                onChange={(e) =>
                  updateUnit(idx, 'bathrooms', parseInt(e.target.value, 10) || 0)
                }
              />
              <Input
                type="number"
                min={1}
                value={unit.quantity}
                onChange={(e) =>
                  updateUnit(idx, 'quantity', parseInt(e.target.value, 10) || 0)
                }
                disabled={mode === 'SingleFamily'}
              />
              {mode !== 'SingleFamily' && (
                <Button size="icon" variant="ghost" onClick={() => deleteType(idx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>

        {showAddNew  && (
          <Button size="sm" variant="outline" onClick={addType}>
            Add New Type
          </Button>
        )}
      </div>
    </div>
  )
}
