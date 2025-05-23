import { Button } from 'components/ui/button.tsx'
import { FlowBlock } from 'features/flow/FlowBlock.tsx'
import { AssesmentStatus, useSelectedProperty } from 'features/flow/state.ts'
import { DataChunk } from 'features/properties/DataChunk.tsx'
import { useModel } from 'features/properties/hooks.ts'
import { useMemo, useRef } from 'react'
import { advanceAssesment, processAssesment, saveAddressDetails } from 'utils/api.ts'
import { useCurrentPropertyState, useForm } from '../hooks'

export const AddressDetails = () => {
  const { property, setProperty } = useSelectedProperty()
  const state = useCurrentPropertyState()
  const data = useModel(property.id)

  const { form } = useForm()

  const handleSubmit = async () => {
    if (!property) {
      return
    }

    await saveAddressDetails(property.id, {
      property_type: form.property_type,
      bedrooms: form.bedrooms,
      bathrooms: form.bathrooms,
      square_footage: form.square_footage,
      lot_size_sqft: form.lot_size_sqft,
      year_built: form.year_built,
      assessed_value: form.assessed_value,
      annual_property_tax: form.annual_property_tax,
      zip_code: form.zip_code
    })

    const advanced = await advanceAssesment(property.id)
    setProperty(advanced)

    await processAssesment(property.id)
  }

  const stageData = useMemo(() => data.stage_1 || {}, [data])

  const readyStages = Object.values(stageData).length

  const isLoading = useMemo(() => {
    if (state.status !== AssesmentStatus.processing) {
      return false
    }

    return !readyStages
  }, [state, stageData])

  return <>
    <FlowBlock loading={isLoading} className={`flex flex-col`}>
      {Object.keys(stageData).map((key) => <DataChunk chunk={key}/>)}
    </FlowBlock>
    {
      readyStages === 1 ? <FlowBlock>
          <Button onClick={handleSubmit}>Save and proceed</Button>

        </FlowBlock>
        : null
    }
  </>
}
