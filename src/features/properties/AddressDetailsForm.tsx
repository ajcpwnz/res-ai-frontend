import { Checkbox } from 'components/ui/checkbox.tsx'
import { Input } from 'components/ui/input.tsx'
import { Label } from 'components/ui/label.tsx'
import { UnitConfigurator } from 'components/UnitConfigurator.tsx'
import { useForm } from 'features/flow/hooks.ts'
import { useSelectedProperty } from 'features/flow/state.ts'
import { __unitConfigurator } from 'features/properties/state.ts'
import { useAtom } from 'jotai/index'
import { useEffect, useState } from 'react'

export const AddressDetailsForm = ({ data }: { data: any }) => {
  const { form, updateField } = useForm()
  const [unknownLastSold, setUnknownLastSold] = useState(false)

  const [units, setUnits] = useAtom(__unitConfigurator)

  const handleUnknownLastSoldChange = (checked: boolean) => {
    setUnknownLastSold(checked)
    if (checked) {
      updateField('last_sold_date', '')
      updateField('last_sold_price', '')
    }
  }


  useEffect(() => {
    if (data?.units) {
      setUnits(data.units)
    }
  }, [data])

  const { property } = useSelectedProperty()

  return <div className="flex flex-col space-y-2">
    <div className="mb-6">
      <UnitConfigurator mode={property.type} value={units} onChange={setUnits}/>
    </div>
    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="square_footage">
        Square Footage
      </Label>
      <Input type="number" name="square_footage" value={form.square_footage} onChange={(e) => updateField('square_footage', e.target.value)}/>
    </div>

    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="lot_size_sqft">
        Lot Size (sqft)
      </Label>
      <Input type="number" name="lot_size_sqft" value={form.lot_size_sqft} onChange={(e) => updateField('lot_size_sqft', e.target.value)}/>
    </div>

    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="year_built">
        Year Built
      </Label>
      <Input type="number" name="year_built" value={form.year_built} onChange={(e) => updateField('year_built', e.target.value)}/>
    </div>

    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="assessed_value">
        Assessed Value
      </Label>
      <Input type="number" name="assessed_value" value={form.assessed_value} onChange={(e) => updateField('assessed_value', e.target.value)}/>
    </div>

    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="annual_property_tax">
        Annual Property Tax
      </Label>
      <Input type="number" name="annual_property_tax" value={form.annual_property_tax} onChange={(e) => updateField('annual_property_tax', e.target.value)}/>
    </div>

    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="zip_code">
        ZIP Code
      </Label>
      <Input name="zip_code" value={form.zip_code} onChange={(e) => updateField('zip_code', e.target.value)}/>
    </div>

    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <div className="w-full flex flex-col space-y-2">
          <Label htmlFor="last_sold_date">Last sold date</Label>
          <Input
            id="last_sold_date"
            name="last_sold_date"
            type="date"
            value={
              unknownLastSold
                ? ""
                : form.last_sold_date
                  ? form.last_sold_date.split("T")[0]
                  : ""
            }
            disabled={unknownLastSold}
            onChange={e => updateField('last_sold_date', e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col space-y-2">
          <Label htmlFor="last_sold_price">Last sold price ($)</Label>
          <Input
            id="last_sold_price"
            name="last_sold_price"
            type="number"
            value={unknownLastSold ? '' : form.last_sold_price || ''}
            disabled={unknownLastSold}
            onChange={e => updateField('last_sold_price', e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="unknown_last_sold"
          checked={unknownLastSold}
          onCheckedChange={handleUnknownLastSoldChange}
        />
        <Label htmlFor="unknown_last_sold">Don't know last sold details</Label>
      </div>
    </div>

  </div>
}
