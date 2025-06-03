import { Title } from 'components/Title.tsx'
import { Button } from 'components/ui/button.tsx'
import { Input } from 'components/ui/input.tsx'
import { Label } from 'components/ui/label.tsx'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'components/ui/select.tsx'
import { UnitConfigurator } from 'components/UnitConfigurator.tsx'
import { FlowBlock } from 'features/flow/FlowBlock.tsx'
import { useCurrentPropertyState, useForm, useSteps } from 'features/flow/hooks.ts'
import { AssesmentStatus, useSelectedProperty } from 'features/flow/state.ts'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { processAssesment, createProperty, uploadPropertyFile } from 'utils/api.ts'

export type Unit = { bedrooms: number; bathrooms: number; quantity: number }

const defaultUnits: Unit[] = [
  { bedrooms: 1, bathrooms: 1, quantity: 1 },
]

export const PropertyForm = () => {
  const [loading, setLoading] = useState(false)
  const [units, setUnits] = useState<Unit[]>(defaultUnits)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadingFile, setUploadingFile] = useState(false)
  const navigate = useNavigate()

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


  const handleUploadFile = async () => {
    if (!selectedFile) return

    setUploadingFile(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const response = await uploadPropertyFile(formData)

      return response
    } catch (err) {
      console.error('Error uploading file:', err)
    } finally {
      setUploadingFile(false)
    }
  }

  const handleSubmitProperty = async () => {
    setLoading(true)
    try {
      if(selectedFile) {
        const { property } = await handleUploadFile()
        setProperty(property)
        navigate(`/p/${property.id}`, { replace: true })

      } else {
        const payload: Record<string, any> = {
          type: form.type,
          address: form.address,
          last_sold_date: form.last_sold_date,
          last_sold_price: form.last_sold_price,
          units,
        }

        const { property } = await createProperty(payload)

        setProperty(property)
        navigate(`/p/${property.id}`, { replace: true })

        goToStep(1)
        await processAssesment(property.id)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <FlowBlock loading={state.status === AssesmentStatus.processing} className="flex flex-col space-y-4">
      <Title className="font-bold">Start</Title>

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

      <div className="flex space-x-2">
        <div className="w-full flex flex-col space-y-2">
          <Label htmlFor="type">Property type</Label>
          <Select name="type" value={form.type} onValueChange={v => updateField('type', v)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SingleFamily">Single Family House</SelectItem>
              <SelectItem value="Residential">Multifamily (2-4 units)</SelectItem>
              <SelectItem value="MultiFamily">Multifamily (5+ units)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {
        !form.type || form.type === 'SingleFamily'
          ? null
          : <div className="my-6">
            <UnitConfigurator mode={form.type} value={units} onChange={setUnits} />
          </div>
      }

      <p className="my-6 text-center">or upload a file</p>

      <div className="flex items-center space-x-2">
        <Input
          name="file"
          type="file"
          onChange={e => {
            const file = e.target.files?.[0] || null
            setSelectedFile(file)
          }}
        />
      </div>

      <Button
        loading={loading}
        disabled={!((form.address && form.type) || selectedFile)}
        onClick={handleSubmitProperty}
      >
        Start
      </Button>
    </FlowBlock>
  )
}
