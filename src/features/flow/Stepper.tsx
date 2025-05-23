import { Button } from '@/components/ui/button'
import { Title } from 'components/Title.tsx'
import { FlowBlock } from 'features/flow/FlowBlock.tsx'
import { useSteps } from 'features/flow/hooks.ts'
import { useSelectedProperty } from 'features/flow/state.ts'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { rewindAssesment } from 'utils/api.ts'

export const Stepper = () => {
  const [loading, setLoading] = useState(false);
  const {property, setProperty} = useSelectedProperty();

  const { current, iterator, widthClass } = useSteps()

  const handleRewind = async () => {
    if(!property) return;

    setLoading(true);
      try {
        const updated = await rewindAssesment(property.id);
        setProperty(updated);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
  }

  return current === 0 ? null : <FlowBlock className="flex flex-col mb-4">
    <div className="flex items-center space-x-2 mb-2">
      {
        current !== 1 ? <Button variant="ghost" onClick={handleRewind} loading={loading}>
          <ArrowLeft/>
        </Button> : null
      }

      <Title><b>Stage {current}</b> of 5</Title>
    </div>
    <div className="flex w-full justify-between space-x-1">
      {iterator.map((_, idx) => {
        return <div className={`w-1/5 h-2 rounded border ${idx < current ? 'bg-blue-300' : 'bg-white'}`}></div>
      })}
    </div>
  </FlowBlock>
}
