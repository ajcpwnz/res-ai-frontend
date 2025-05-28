import { Title } from 'components/Title.tsx'
import { Button } from 'components/ui/button.tsx'
import { Input } from 'components/ui/input.tsx'
import { Label } from 'components/ui/label.tsx'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'components/ui/select.tsx'
import { Checkbox } from 'components/ui/checkbox.tsx'
import { UnitConfigurator } from 'components/UnitConfigurator.tsx'
import { FlowBlock } from 'features/flow/FlowBlock.tsx'
import { useCurrentPropertyState, useForm, useSteps } from 'features/flow/hooks.ts'
import { AssesmentStatus, useSelectedProperty } from 'features/flow/state.ts'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { processAssesment, createProperty } from 'utils/api.ts'

export type Unit = { bedrooms: number; bathrooms: number; quantity: number }

const defaultUnits: Unit[] = [
  { bedrooms: 1, bathrooms: 1, quantity: 3 },
  { bedrooms: 2, bathrooms: 1, quantity: 1 },
  { bedrooms: 3, bathrooms: 1, quantity: 1 },
]

export const PropertyForm = () => {
  const [loading, setLoading] = useState(false)
  const [units, setUnits] = useState<Unit[]>(defaultUnits)
  const [unknownLastSold, setUnknownLastSold] = useState(false)
  const navigate = useNavigate();

  const state = useCurrentPropertyState()
  const { setProperty } = useSelectedProperty()
  const { goToStep } = useSteps()
  const { form, updateField } = useForm()
  const addressRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loadScript = () => {
      if (!window.google || !window.google.maps) {
        const script = document.createElement('script')
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCxTUnzmSfemPdBHEIwgLNE9DedNsaEmXU&libraries=places'
        script.async = true
        script.defer = true
        script.onload = initAutocomplete
        document.head.appendChild(script)
      } else {
        initAutocomplete()
      }
    }

    const initAutocomplete = () => {
      if (addressRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
          types: ['geocode'],
        })
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (place.formatted_address) {
            updateField('address', place.formatted_address)
          }
        })
      }
    }

    loadScript()
  }, [updateField])


  const handleUnknownLastSoldChange = (checked: boolean) => {
    setUnknownLastSold(checked)
    if (checked) {
      updateField('last_sold_date', '')
      updateField('last_sold_price', '')
    }
  }

  const handleSubmitProperty = async () => {
    setLoading(true)
    try {
      const payload: Record<string, any> = {
        type: form.type,
        address: form.address,
        last_sold_date: form.last_sold_date,
        last_sold_price: form.last_sold_price,
        unit_count: form.unit_count,
        units
      }

      const { property } = await createProperty(payload)

      setProperty(property)
      navigate(`/p/${property.id}`, { replace: true })

      goToStep(1)
      await processAssesment(property.id)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <FlowBlock loading={state.status === AssesmentStatus.processing} className="flex flex-col space-y-4">
      <Title className="font-bold">Start</Title>

      {/* Address field */}
      <div className="w-full flex flex-col space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={form.address}
          onChange={e => updateField('address', e.target.value)}
          ref={addressRef}
        />
      </div>

      {/* Property type select */}
      <div className="flex space-x-2">
        <div className="w-full flex flex-col space-y-2">
          <Label htmlFor="type">Property type</Label>
          <Select name="type" value={form.type} onValueChange={v => updateField('type', v)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SingleFamily">Single Family House</SelectItem>
              <SelectItem value="Residential">Multifamily (2-4 units)</SelectItem>
              <SelectItem value="MultiFamily">Multifamily (5+ units)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {
          form.type === 'Residential' && (
            <div className="w-1/3 flex flex-col space-y-2">
            <Label htmlFor="address">Unit count</Label>
            <Input
              id="unit_count"
              name="unit_count"
              value={form.unit_count}
              type="number"
              min="2"
              max="4"
              step="1"
              onChange={e => updateField('unit_count', e.target.value)}
            />
          </div>)
        }
      </div>

      {form.type === 'MultiFamily' && (
        <div className="my-6">
          <UnitConfigurator value={units} onChange={setUnits} />
        </div>
      )}

      {/* Last sold block with unknown toggle */}
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <div className="w-full flex flex-col space-y-2">
            <Label htmlFor="last_sold_date">Last sold date</Label>
            <Input
              id="last_sold_date"
              name="last_sold_date"
              type="date"
              value={unknownLastSold ? '' : form.last_sold_date || ''}
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

      {/* File upload */}
      <p className="my-6 text-center">or upload a file</p>
      <Input
        name="file"
        type="file"
        onChange={e => updateField('file', e.target.files?.[0])}
      />

      <Button
        loading={loading}
        disabled={!((form.address && form.type) || form.file)}
        onClick={handleSubmitProperty}
      >
        Start
      </Button>
    </FlowBlock>
  )
}
