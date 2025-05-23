import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Subtitle } from 'components/Subtitle.tsx'

interface ProjectionData {
  financial_projection: {
    projections: Array<{ year: number; EGI: number; expenses: number; NOI: number }>;
    exit_scenarios: Array<{
      rate: string
      year: number
      exitValue: number
      netProceeds: number
      equity: number
      ARR: number
    }>;
    offer_price: number
  }
}

export const MultifamilyFinancialProjections = ({ data }: { data: ProjectionData }) => {
  const { projections, exit_scenarios, offer_price } = data.financial_projection

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  const formatPercent = (value: number) =>
    `${(value * 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <Subtitle>5-Year NOI Projection</Subtitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Year</TableHead>
              <TableHead>EGI <br/>(rent price × vacancy)</TableHead>
              <TableHead>Expenses <br/>(prior year’s expenses × expense_growth)</TableHead>
              <TableHead>NOI <br/>(prior year’s NOI × income_growth)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projections.map(({ year, EGI, expenses, NOI }) => (
              <TableRow key={year}>
                <TableCell>{year}</TableCell>
                <TableCell>{formatCurrency(EGI)}</TableCell>
                <TableCell>{formatCurrency(expenses)}</TableCell>
                <TableCell>{formatCurrency(NOI)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <Subtitle>Exit Scenarios</Subtitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scenario</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Exit Value (NOI ÷ cap rate)</TableHead>
              <TableHead>Net Proceeds (Exit Value − loan payoff)</TableHead>
              <TableHead>ARR (total gain ÷ equity ÷ year)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exit_scenarios.map(({ rate, year, exitValue, netProceeds, ARR }) => (
              <TableRow key={`${rate}-${year}`}>
                <TableCell>{rate}</TableCell>
                <TableCell>{year}</TableCell>
                <TableCell>{formatCurrency(exitValue)}</TableCell>
                <TableCell>{formatCurrency(netProceeds)}</TableCell>
                <TableCell>{formatPercent(ARR)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <Subtitle>Offer Price</Subtitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                Offer Price ((assessed value × 75%) − (renovation cost × unit count))
              </TableCell>
              <TableCell>
                <strong>{formatCurrency(offer_price)}</strong>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
