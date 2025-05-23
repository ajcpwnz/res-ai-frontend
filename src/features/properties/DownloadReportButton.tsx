import { Button } from 'components/ui/button.tsx'
import { useSteps } from 'features/flow/hooks.ts'
import { __selectedProperty } from 'features/flow/state.ts'
import { useAtom, useAtomValue } from 'jotai/index'
import { useState } from 'react'
import { downloadReport } from 'utils/api.ts'

export const DownloadReportButton = () => {
  const { current } = useSteps();
  const property = useAtomValue(__selectedProperty);
  const [loading, setLoading] = useState(false);


  const handleDownload = async () => {
    if (!property) return
    setLoading(true)
    try {

      const blob = await downloadReport(property.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Assessment - ${property.address.fullAddress}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }


  if(!property || current !== 5)  return null;

  return <Button loading={loading} onClick={handleDownload}>Download report</Button>
}
