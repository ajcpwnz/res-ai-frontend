import { Loader } from 'components/Loader.tsx'
import { Debug } from 'features/Debug.tsx'
import { useCurrentPropertyState, useForm, useSteps } from 'features/flow/hooks.ts'
import { __propertyStates, __selectedProperty, AssesmentStatus, useSelectedProperty } from 'features/flow/state.ts'
import { AddressDetails } from 'features/flow/steps/AddressDetails.tsx'
import { ExpenseRatio } from 'features/flow/steps/ExpenseRatio.tsx'
import { InvestmentSummary } from 'features/flow/steps/InvestmentSummary.tsx'
import { MarketSummary } from 'features/flow/steps/MarketSummary.tsx'
import { PropertyForm } from 'features/flow/steps/PropertyForm.tsx'
import { MarketData } from 'features/properties/MarketData.tsx'
import { __modelData } from 'features/properties/state.ts'
import { useSetAtom } from 'jotai'
import { useAtom, useAtomValue } from 'jotai/index'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getProperty, loadAssesment } from 'utils/api.ts'
import { Stepper } from './flow/Stepper'
import { FinancialProjection } from './flow/steps/FinancialProjection'

function formatMoney(value: unknown): string {
  const amount = typeof value === 'string' && value.trim() !== ''
    ? Number(value)
    : value

  if (typeof amount !== 'number' || !isFinite(amount)) {
    return 'N/A'
  }

  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return `$${formatted}`
}


const delays = {
  1: 1100,
  2: 900,
}

const wait = async (ms: number) => (new Promise(resolve => setTimeout(resolve, ms)))

export const Flow = () => {
  const { current } = useSteps()
  const { updateForm } = useForm()
  const { setProperty } = useSelectedProperty()
  const states = useAtomValue(__propertyStates)
  const setModelData = useSetAtom(__modelData)
  const [loading, setLoading] = useState(false);

  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id === 'new') {
      setProperty(null)
      return
    }

    setLoading(true)
    getProperty(id).then(data => {
      setProperty(data.property)
      updateForm(data.property.meta)
    })

    loadAssesment(id).then(data => {
      setModelData(old => ({
        ...old,
        [id]: data
      }));
      setLoading(false)
    })

  }, [id])

  const renderCurrentStep = () => {
    switch (current) {
      case 1:
        return <AddressDetails/>
      case 2:
        return <MarketSummary/>
      case 3:
        return <ExpenseRatio/>
      case 4:
        return <FinancialProjection/>
      case 5:
        return <InvestmentSummary/>
      default:
        return <PropertyForm/>
    }
  }

  if(loading) {
    return <Loader />
  }

  return <div className="min-h-[500px] overflow-x-visible flex flex-col items-start justify-start w-full">
    {renderCurrentStep()}
  </div>
}
