import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Subtitle } from 'components/Subtitle.tsx'

interface FinancialProjectionData {
  financial_projection: {
    pricePerFoot: number | null
    marketNOI: {
      EGI: number
      expenses: number
      NOI: number
    }
    fmrNOI: {
      EGI: number
      expenses: number
      NOI: number
    }
    ARV: number | null
    offer_price: number | null
  }
}

export const ResidentialFinancialProjections = ({ data }: { data: FinancialProjectionData }) => {
  const proj = data.financial_projection

  const formatCurrency = (value: number | null) =>
    value !== null ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '—'
  console.warn(proj, 'dsads')
  return proj ? (
    <div className="flex flex-col space-y-4">
      <div>
        <Subtitle>Financial Projection</Subtitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Price Per Foot (based on comps)</TableCell>
              <TableCell>{formatCurrency(proj.pricePerFoot)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ARV ($ per foor × footage)</TableCell>
              <TableCell>{formatCurrency(proj.ARV)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Offer Price ((ARV × 75%) - renovation rate)</TableCell>
              <TableCell><b>{formatCurrency(proj.offer_price)}</b></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <Subtitle>NOI values</Subtitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Market Value</TableHead>
              <TableHead>FMR Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>EGI (rent price × vacancy)</TableCell>
              <TableCell>{formatCurrency(proj.marketNOI.EGI)}</TableCell>
              <TableCell>{formatCurrency(proj.fmrNOI.EGI)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Expenses (EGI × expense rate)</TableCell>
              <TableCell>{formatCurrency(proj.marketNOI.expenses)}</TableCell>
              <TableCell>{formatCurrency(proj.fmrNOI.expenses)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>NOI (EGI − expenses)</TableCell>
              <TableCell>{formatCurrency(proj.marketNOI.NOI)}</TableCell>
              <TableCell>{formatCurrency(proj.fmrNOI.NOI)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  ) : null
}
