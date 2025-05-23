import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Subtitle } from 'components/Subtitle.tsx'
import { formatMoney } from 'utils/number.ts'

interface MarketDataChunk {
  marketData: {
    avg_rent: string
    rent_low: string
    rent_high: string
  }
  comparables: {
    json: string
  }[]
}

export const MarketData = ({ data }: { data: MarketDataChunk }) => {
  const market = data.marketData
  const comps = data.comparables

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col items-start">
        <Subtitle>Rent data</Subtitle>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rent (low)</TableHead>
                <TableHead>Rent (AVM)</TableHead>
                <TableHead>Rent (high)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{formatMoney(market.avg_rent)}</TableCell>
                <TableCell>{formatMoney(market.rent_low)}</TableCell>
                <TableCell>{formatMoney(market.rent_high)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <Subtitle>Rent comparables</Subtitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Beds</TableHead>
              <TableHead>Baths</TableHead>
              <TableHead>Sq Ft</TableHead>
              <TableHead>Sold Date</TableHead>
              <TableHead>Distance (mi)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comps.map((comp, i) => (
              <TableRow key={i}>
                <TableCell>{comp.formattedAddress}</TableCell>
                <TableCell>${comp.price}</TableCell>
                <TableCell>{comp.bedrooms}</TableCell>
                <TableCell>{comp.bathrooms}</TableCell>
                <TableCell>{comp.squareFootage || '—'}</TableCell>
                <TableCell>{comp.removedDate?.slice(0, 10)}</TableCell>
                <TableCell>{comp.distance?.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
