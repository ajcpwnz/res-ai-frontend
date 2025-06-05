import { Stepper } from "@/features/flow/Stepper"
import { __selectedProperty } from 'features/flow/state.ts'
import { DownloadReportButton } from 'features/properties/DownloadReportButton.tsx'
import { useAtom, useAtomValue } from 'jotai/index'

export const LayoutHeader = () => {


  return <div className="w-full bg-gray-50 z-10 sticky top-0 pt-4 pb-2 flex flex-col">
    <div className="flex items-center justify-between">
      <Stepper />
      <DownloadReportButton />
    </div>
  </div>
}
