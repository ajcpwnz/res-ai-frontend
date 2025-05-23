import { Stepper } from "@/features/flow/Stepper"
import { __selectedProperty } from 'features/flow/state.ts'
import { DownloadReportButton } from 'features/properties/DownloadReportButton.tsx'
import { useAtom, useAtomValue } from 'jotai/index'

export const LayoutHeader = () => {
  const property = useAtomValue(__selectedProperty)

  return <div className="w-full bg-gray-50 z-10 sticky top-0 pt-4 pb-2 flex flex-col">
    {property ? <h2 className="text-xl font-bold mb-2">{property.address?.fullAddress}</h2> : null}
    <div className="flex items-center justify-between">
      <Stepper />
      <DownloadReportButton />
    </div>
  </div>
}
