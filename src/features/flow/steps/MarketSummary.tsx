import { Loader } from 'components/Loader.tsx'
import { Button } from 'components/ui/button.tsx'
import { FlowBlock } from 'features/flow/FlowBlock.tsx'
import { AssesmentStatus, useSelectedProperty } from 'features/flow/state.ts'
import { DataChunk, } from 'features/properties/DataChunk.tsx'
import { useModel } from 'features/properties/hooks.ts'
import { useEffect, useMemo } from 'react'
import { advanceAssesment, processAssesment } from 'utils/api.ts'
import { useCurrentPropertyState, useSteps } from '../hooks'

export const MarketSummary = () => {
  const { property, setProperty } = useSelectedProperty()
  const state = useCurrentPropertyState()
  const data = useModel(property.id)


  const proceed = async () => {
    if (!property) {
      return
    }
    const advanced = await advanceAssesment(property.id)
    setProperty(advanced)

    await processAssesment(property.id)
  }

  const stageData = useMemo(() => data.stage_2 || {}, [data])

  const readyStages = Object.values(stageData).filter(entry => Object.values(entry || {}).length).length

  const isLoading = useMemo(() => {
    if (state.status !== AssesmentStatus.processing) {
      return false
    }

    return !readyStages
  }, [state, stageData])

  useEffect(() => {
    const el = document.getElementById('middle-column')
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [readyStages])

  console.warn(property,'ddd')

  return <>
    <FlowBlock wide loading={isLoading} className={`flex flex-col space-y-2`}>
      {Object.keys(stageData).map((key) => <DataChunk chunk={key}/>)}
    </FlowBlock>
    {
      property.stageCompleted ? <FlowBlock>
          <Button onClick={proceed}>Proceed</Button>
        </FlowBlock>
        : <Loader />
    }
  </>
}
