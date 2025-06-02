import { Loader } from 'components/Loader.tsx'
import {  useForm, useSteps } from 'features/flow/hooks.ts'
import { useSelectedProperty } from 'features/flow/state.ts'
import { AddressDetails } from 'features/flow/steps/AddressDetails.tsx'
import { ExpenseRatio } from 'features/flow/steps/ExpenseRatio.tsx'
import { InvestmentSummary } from 'features/flow/steps/InvestmentSummary.tsx'
import { MarketSummary } from 'features/flow/steps/MarketSummary.tsx'
import { PropertyForm } from 'features/flow/steps/PropertyForm.tsx'
import { __modelData } from 'features/properties/state.ts'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getProperty, loadAssesment } from 'utils/api.ts'
import { FinancialProjection } from './flow/steps/FinancialProjection'

export const Flow = () => {
  const { current } = useSteps()
  const { updateForm } = useForm()
  const { setProperty } = useSelectedProperty()
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
