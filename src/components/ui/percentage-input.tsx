import * as React from 'react'
import { Input } from 'components/ui/input.tsx'
import { cn } from '@/lib/utils'

export interface PercentageInputProps extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'step'> {
  value?: number | string
  onChange: (decimalValue: number) => void
  step?: number
}

export const PercentageInput: React.FC<PercentageInputProps> = ({
  value,
  onChange,
  step = 0.01,
  className,
  ...props
}) => {
  // Format decimal (0–1) as percent string (0–100) with up to 2 decimal places
  const formatDisplay = (num: number) => {
    const s = (num * 100).toFixed(2)
    // strip unnecessary .00 or trailing zeros
    return s.replace(/\.?0+$/, '')
  }

  const displayValue =
    value == null || value === ''
      ? ''
      : formatDisplay(parseFloat(String(value)))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value)
    if (isNaN(parsed)) {
      onChange(0)
    } else {
      onChange(parsed / 100)
    }
  }

  return (
    <Input
      {...props}
      type="number"
      step={step}
      value={displayValue}
      onChange={handleChange}
      className={cn(className)}
    />
  )
}
