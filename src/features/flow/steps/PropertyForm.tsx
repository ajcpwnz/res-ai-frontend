import { Title } from 'components/Title.tsx'
import { Button } from 'components/ui/button.tsx'
import { Input } from 'components/ui/input.tsx'
import { Label } from 'components/ui/label.tsx'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from 'components/ui/select.tsx'
import { FlowBlock } from 'features/flow/FlowBlock.tsx'
import { useCurrentPropertyState, useForm, useSteps } from 'features/flow/hooks.ts'
import { AssesmentStatus, usePropertyList, useSelectedProperty } from 'features/flow/state.ts'
import { useState } from 'react'
import { processAssesment, createProperty } from 'utils/api.ts'

export const PropertyForm = () => {
  const [loading, setLoading] = useState(false)
  const [unitMode, setUnitMode] = useState<'total' | 'byType'>('total')
  const state = useCurrentPropertyState()
  const {setProperty} = useSelectedProperty()
  const { goToStep } = useSteps()
  const { form, updateField } = useForm()

  const handleSubmitProperty = async () => {
    setLoading(true)
    try {
      const payload: Record<string, any> = {
        type: form.type,
        address: form.address,
      }

      if (form.type === 'MultiFamily') {
        payload.unit_count = form.totalUnits || ((form.units1br || 0) + (form.units2br || 0) + (form.units3br || 0))
      }

      const { property } = await createProperty(payload)
      setProperty(property)
      goToStep(1);

      await processAssesment(property.id)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <FlowBlock loading={state.status === AssesmentStatus.processing} className="flex flex-col space-y-4">
      <Title>Add new property</Title>

      <div className="w-full flex flex-col space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" value={form.address} onChange={e => updateField('address', e.target.value)}/>
      </div>

      <div className="w-full flex flex-col space-y-2">
        <Label htmlFor="type">Property type</Label>
        <Select name="type" value={form.type} onValueChange={v => updateField('type', v)}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Type"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Residential">Residential</SelectItem>
            <SelectItem value="MultiFamily">Multifamily</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {form.type === 'MultiFamily' && (
        <div className="flex flex-col space-y-2">
          <Label>Number of units</Label>
          <div className="flex space-x-2 mb-4">
            <Button size="sm" variant={unitMode === 'total' ? 'default' : 'outline'} onClick={() => setUnitMode('total')}>Total</Button>
            <Button size="sm" variant={unitMode === 'byType' ? 'default' : 'outline'} onClick={() => setUnitMode('byType')}>By
              bedrooms</Button>
          </div>

          {unitMode === 'total' ? (
            <div className="w-full flex flex-col space-y-2">
              <Label htmlFor="totalUnits">Total units</Label>
              <Input id="totalUnits" type="number" min={0} value={form.totalUnits ?? ''} onChange={e => updateField('totalUnits', parseInt(e.target.value) || 0)}/>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="units1br">1 BR</Label>
                  <Input id="units1br" type="number" min={0} value={form.units1br ?? ''} onChange={e => updateField('units1br', parseInt(e.target.value) || 0)}/>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="units2br">2 BR</Label>
                  <Input id="units2br" type="number" min={0} value={form.units2br ?? ''} onChange={e => updateField('units2br', parseInt(e.target.value) || 0)}/>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="units3br">3 BR</Label>
                  <Input id="units3br" type="number" min={0} value={form.units3br ?? ''} onChange={e => updateField('units3br', parseInt(e.target.value) || 0)}/>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="my-6 text-center">or upload a file</p>
      <Input name="file" type="file" onChange={e => updateField('file', e.target.files?.[0])}/>

      <Button loading={loading} disabled={!((form.address && form.type) || form.file)} onClick={handleSubmitProperty}>Start</Button>
    </FlowBlock>
  )
}
