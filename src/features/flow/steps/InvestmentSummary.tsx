import { Loader } from 'components/Loader.tsx'
import { Button } from 'components/ui/button.tsx'
import { FlowBlock } from 'features/flow/FlowBlock.tsx'
import { __selectedProperty, AssesmentStatus, useSelectedProperty } from 'features/flow/state.ts'
import { DataChunk, DataSource } from 'features/properties/DataChunk.tsx'
import { useModel } from 'features/properties/hooks.ts'
import { useAtom, useAtomValue } from 'jotai/index'
import { useEffect, useMemo } from 'react'
import { advanceAssesment, processAssesment } from 'utils/api.ts'
import { useCurrentPropertyState, useSteps } from '../hooks'

export const InvestmentSummary = () => {
  const {property} = useSelectedProperty()
  const state = useCurrentPropertyState()
  const data = useModel(property.id)


  const stageData = useMemo(() => data.stage_5 || {}, [data])
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
    <FlowBlock wide loading={isLoading} className={`flex flex-col space-y-2`}>
      {Object.keys(stageData).map((key) => <DataChunk chunk={key} />)}
    </FlowBlock>
  </>
}
