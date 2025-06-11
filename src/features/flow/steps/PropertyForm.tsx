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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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
    setLoading(true);
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      const response = await uploadPropertyFile(formData)

      return response
    } catch (err) {
      console.error('Error uploading file:', err)
    } finally {
      setLoading(false)
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
          address: form.address,
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
    <div className="flex w-full items-center justify-center">
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
        <p className="mt-4 mb-6 text-center">or upload a file</p>

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
          disabled={!(form.address || selectedFile)}
          onClick={handleSubmitProperty}
        >
          Start
        </Button>
      </FlowBlock>
    </div>
  )
}
