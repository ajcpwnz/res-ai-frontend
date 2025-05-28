import { Input } from 'components/ui/input.tsx'
import { Label } from 'components/ui/label.tsx'
import { UnitConfigurator } from 'components/UnitConfigurator.tsx'
import { useForm } from 'features/flow/hooks.ts'
import { useSelectedProperty } from 'features/flow/state.ts'
import { __unitConfigurator } from 'features/properties/state.ts'
import { useAtom } from 'jotai/index'
import { useEffect } from 'react'

export const AddressDetailsForm = ({ data }: { data: any }) => {
  const { form, updateField } = useForm()

  const [units, setUnits] = useAtom(__unitConfigurator)

  useEffect(() => {
    if (data.units) {
      setUnits(data.units)
    }
  }, [data])

  const { property } = useSelectedProperty()

  return <div className="flex flex-col space-y-2">
    {property.type === 'MultiFamily' ? (
      <div className="mb-6">
        <UnitConfigurator value={units} onChange={setUnits}/>
      </div>
    ) : property.type === 'Residential' ? (
      <div className="flex space-x-2">
        <div className="w-1/3 flex flex-col space-y-2">
          <Label htmlFor="bedrooms">
            Bedrooms
          </Label>
          <Input name="bedrooms" type="number" value={form.bedrooms} onChange={(e) => updateField('bedrooms', e.target.value)}/>
        </div>
        <div className="w-1/3 flex flex-col space-y-2">
          <Label htmlFor="bathrooms">
            Bathrooms
          </Label>
          <Input name="bathrooms" type="number" value={form.bathrooms} onChange={(e) => updateField('bathrooms', e.target.value)}/>
        </div>
        <div className="w-1/3 flex flex-col space-y-2">
          <Label htmlFor="Unit count">
            Unit count
          </Label>
          <Input name="unit_count" type="number" value={form.unit_count} onChange={(e) => updateField('unit_count', e.target.value)}/>
        </div>
      </div>
    ) : <div className="flex space-x-2">
      <div className="w-1/2 flex flex-col space-y-2">
        <Label htmlFor="bedrooms">
          Bedrooms
        </Label>
        <Input name="bedrooms" type="number" value={form.bedrooms} onChange={(e) => updateField('bedrooms', e.target.value)}/>
      </div>
      <div className="w-1/2 flex flex-col space-y-2">
        <Label htmlFor="bathrooms">
          Bathrooms
        </Label>
        <Input name="bathrooms" type="number" value={form.bathrooms} onChange={(e) => updateField('bathrooms', e.target.value)}/>
      </div>
    </div>


    }
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


  </div>
}
