import { Input } from 'components/ui/input.tsx'
import { Label } from 'components/ui/label.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select.tsx'
import { useCurrentPropertyState, useForm } from 'features/flow/hooks.ts'
import { useRef } from 'react'

export const AddressDetailsForm = () => {
  const state = useCurrentPropertyState();
  const { form, updateField } = useForm()
  const rcPropertyType = useRef(form.property_type)

  return <div className="flex flex-col space-y-2">
    <div className="w-full flex-col space-y-2">
      <Label htmlFor="property_type">
        Property type
      </Label>

      <div className="flex items-center space-x-2">
        <div className="w-full">
          <Select
            name="property_type"
            value={form.property_type}
            onValueChange={v => updateField('property_type', v)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single Family">Single Family</SelectItem>
              <SelectItem value="MultiFamily">Multifamily</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {rcPropertyType.current ? <div className="flex flex-col w-2/5">
          <span className="text-xs text-gray-700">rentcast: </span>
          <p className="text-sm">{rcPropertyType.current}</p>
        </div> : null }
      </div>
    </div>

    <div className="flex space-x-2">
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
