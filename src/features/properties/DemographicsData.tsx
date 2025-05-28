import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Subtitle } from 'components/Subtitle.tsx'
import { formatMoney, formatPercents } from 'utils/number.ts'

interface DemographicsDataProps {
  data: {
    demographics_data: {
      totalPopulation: number
      whitePopulation: number
      latinoPopulation: number
      blackPopulation: number
      medianIncome: number
      housingUnits: number | null
      renterUnits: number
    }
  }
}

export const DemographicsData = ({ data: { demographics_data: data } }: DemographicsDataProps) => {
  return data ? (
    <div className="flex flex-col space-y-4">
      <Subtitle>Demographics</Subtitle>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Total Population</TableCell>
            <TableCell>{data.totalPopulation}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>White Population</TableCell>
            <TableCell>{formatPercents(data.whitePopulation, data.totalPopulation)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Latino Population</TableCell>
            <TableCell>{formatPercents(data.latinoPopulation, data.totalPopulation)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Black Population</TableCell>
            <TableCell>{formatPercents(data.blackPopulation, data.totalPopulation)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Median Income</TableCell>
            <TableCell>{formatMoney(data.medianIncome)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Housing Units</TableCell>
            <TableCell>{data.housingUnits ?? '—'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Renter Units</TableCell>
            <TableCell>{data.renterUnits}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ) : null
}
