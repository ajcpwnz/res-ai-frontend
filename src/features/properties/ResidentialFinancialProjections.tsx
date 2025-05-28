import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Subtitle } from '@/components/Subtitle.tsx'

interface UnitNOI {
  EGI: number
  expenses: number
  NOI: number
}

interface UnitEntry {
  unit: {
    quantity: number
    bedrooms: number
    bathrooms: number
  }
  marketNOI: UnitNOI
  fmrNOI: UnitNOI
}

interface FinancialProjectionData {
  financial_projection: {
    pricePerFoot: number | null
    rentData: UnitEntry[]
    ARV: number | null
    offer_price: number | null
  }
}

export const ResidentialFinancialProjections: React.FC<{ data: FinancialProjectionData }> = ({ data }) => {
  const proj = data.financial_projection

  const formatCurrency = (value: number | null) =>
    value !== null ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '—'

  if (!proj) return null

  return (
    <div className="flex flex-col space-y-6">
      {/* Summary section */}
      <div>
        <Subtitle>Financial Projection Summary</Subtitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Price Per Foot (comps)</TableCell>
              <TableCell>{formatCurrency(proj.pricePerFoot)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ARV</TableCell>
              <TableCell>{formatCurrency(proj.ARV)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Offer Price</TableCell>
              <TableCell><strong>{formatCurrency(proj.offer_price)}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Per-unit NOI details */}
      <div>
        <Subtitle>NOI Details per Unit Type</Subtitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unit Type</TableHead>
              <TableHead>Market EGI</TableHead>
              <TableHead>Market Expenses</TableHead>
              <TableHead>Market NOI</TableHead>
              <TableHead>HUD EGI</TableHead>
              <TableHead>HUD Expenses</TableHead>
              <TableHead>HUD NOI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proj.rentData.map((entry, idx) => {
              const { unit, marketNOI, fmrNOI } = entry
              const label = `${unit.bedrooms}BR, ${unit.bathrooms}BA`
              return (
                <TableRow key={idx}>
                  <TableCell>{label}</TableCell>
                  <TableCell>{formatCurrency(marketNOI.EGI)}</TableCell>
                  <TableCell>{formatCurrency(marketNOI.expenses)}</TableCell>
                  <TableCell>{formatCurrency(marketNOI.NOI)}</TableCell>
                  <TableCell>{formatCurrency(fmrNOI.EGI)}</TableCell>
                  <TableCell>{formatCurrency(fmrNOI.expenses)}</TableCell>
                  <TableCell>{formatCurrency(fmrNOI.NOI)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
