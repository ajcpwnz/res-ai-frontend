import { RentConfigurator } from 'components/RentConfigurator.tsx'
import { Input } from 'components/ui/input.tsx'
import { Label } from 'components/ui/label.tsx'
import { PercentageInput } from 'components/ui/percentage-input.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select.tsx'
import { FlowBlock } from 'features/flow/FlowBlock.tsx'
import { useCurrentPropertyState, useForm } from 'features/flow/hooks.ts'
import { AssesmentStatus } from 'features/flow/state.ts'
import { __unitConfigurator } from 'features/properties/state.ts'
import { useAtom, useAtomValue } from 'jotai/index'
import { useEffect } from 'react'
import { renovationRates, RenovationScope } from 'utils/consts.ts'

export const MultifamilyExpenseRatio = ({data}: {data: any}) => {
  const state = useCurrentPropertyState()
  const [units, setUnits] = useAtom(__unitConfigurator)

  useEffect(() => {
    if (data.units) {
      setUnits(data.units)
    }
  }, [data])

  const { form, updateField } = useForm()

  return (
    <FlowBlock loading={state.status === AssesmentStatus.processing} className="flex flex-col space-y-4">
      <div className="w-full flex flex-col space-y-2">
        <Label htmlFor="expense_rate">Expense Rate (%)</Label>
        <PercentageInput
          name="expense_rate"
          type="number"
          step={0.01}
          value={form.expense_rate}
          onChange={(v) => updateField('expense_rate', v)}
        />
      </div>

      <div className="w-full flex flex-col space-y-2">
        <Label htmlFor="expense_rate_type">Expense Rate Type</Label>
        <Input
          name="expense_rate_type"
          value={form.expense_rate_type}
          onChange={(e) => updateField('expense_rate_type', e.target.value)}
        />
      </div>

      <div className="w-full flex flex-col space-y-2">
        <RentConfigurator value={units} onChange={v => setUnits(v)}/>
      </div>

      <div className="w-full flex flex-col space-y-2">
        <Label htmlFor="vacancy">Vacancy Rate (%)</Label>
        <PercentageInput
          name="vacancy"
          type="number"
          step={0.01}
          value={form.vacancy}
          onChange={(v) => updateField('vacancy', v)}
        />
      </div>

      <div className="w-full flex flex-col space-y-2">
        <Label htmlFor="income_growth">Income Growth (%)</Label>
        <PercentageInput
          name="income_growth"
          type="number"
          step={0.01}
          value={form.income_growth}
          onChange={(v) => updateField('income_growth', v)}
        />
      </div>

      <div className="w-full flex flex-col space-y-2">
        <Label htmlFor="expense_growth">Expense Growth (%)</Label>
        <PercentageInput
          name="expense_growth"
          type="number"
          step={0.01}
          value={form.expense_growth}
          onChange={(v) => updateField('expense_growth', v)}
        />
      </div>

      <div className="w-full flex flex-col space-y-2">
        <Label htmlFor="renovation_scope">Renovation Scope</Label>
        <Select
          name="renovation_scope"
          value={form.renovation_scope}
          onValueChange={(v: RenovationScope) => {
            updateField('renovation_scope', v)
            if (renovationRates[v]) updateField('renovation_cost', renovationRates[v])
          }}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select scope"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={RenovationScope.light}>Light</SelectItem>
            <SelectItem value={RenovationScope.medium}>Medium</SelectItem>
            <SelectItem value={RenovationScope.heavy}>Heavy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full flex flex-col space-y-2">
        <Label htmlFor="renovation_cost">Renovation Cost ($)</Label>
        <Input
          name="renovation_cost"
          type="number"
          value={form.renovation_cost}
          onChange={(e) => updateField('renovation_cost', e.target.value)}
        />
      </div>

      <div className="w-full flex flex-col space-y-2">
        <Label htmlFor="renovation_units_per_month">Renovation Units per Month</Label>
        <Input
          name="renovation_units_per_month"
          type="number"
          value={form.renovation_units_per_month}
          onChange={(e) => updateField('renovation_units_per_month', e.target.value)}
        />
      </div>
    </FlowBlock>
  )
}
