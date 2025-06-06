import { Loader } from 'components/Loader.tsx'
import { Button } from 'components/ui/button.tsx'
import { FlowBlock } from 'features/flow/FlowBlock.tsx'
import { __selectedProperty, AssesmentStatus, useSelectedProperty } from 'features/flow/state.ts'
import { DataChunk, DataSource } from 'features/properties/DataChunk.tsx'
import { useModel } from 'features/properties/hooks.ts'
import { __unitConfigurator } from 'features/properties/state.ts'
import { useAtom, useAtomValue } from 'jotai/index'
import { useEffect, useMemo } from 'react'
import { advanceAssesment, processAssesment, saveAddressDetails } from 'utils/api.ts'
import { useCurrentPropertyState, useForm, useSteps } from '../hooks'

export const ExpenseRatio = () => {
  const {property, setProperty} = useSelectedProperty()
  const state = useCurrentPropertyState()
  const data = useModel(property.id)
  const units = useAtomValue(__unitConfigurator)

  const { form } = useForm();

  const handleSubmit = async () => {
    if (!property) return;

    await saveAddressDetails(property.id, {
      ...form,
      update_units: units
    });

    const advanced = await advanceAssesment(property.id);
    setProperty(advanced);

    await processAssesment(property.id);
  };


  const stageData = useMemo(() => data.stage_3 || {}, [data])

  const readyStages = Object.values(stageData).length;


  const isLoading = useMemo(() => {
    if (state.status !== AssesmentStatus.processing) {
      return false
    }

    return !readyStages
  }, [state, stageData])

  useEffect(() => {
    const el = document.getElementById('middle-column');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [readyStages])

  return <>
    <FlowBlock loading={isLoading} className={`flex flex-col space-y-2`}>
      {Object.keys(stageData).map((key) => <DataChunk chunk={key} />)}
    </FlowBlock>
    <FlowBlock loading={readyStages !== 1}>
      <Button onClick={handleSubmit}>Save and proceed</Button>
    </FlowBlock>
  </>
}
