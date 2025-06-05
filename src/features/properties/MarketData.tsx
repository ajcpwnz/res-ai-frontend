import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Subtitle } from 'components/Subtitle.tsx'
import { formatMoney } from 'utils/number.ts'

interface MarketDataItem {
  id: string
  propertyId: string
  bedrooms: number
  bathrooms: number
  quantity: number
  rent_low: number
  rent_avm: number
  rent_high: number
}

interface Comparable {
  formattedAddress: string
  price: number | string
  bedrooms: number
  bathrooms: number
  squareFootage?: number
  removedDate?: string
  distance?: number
}

interface MarketDataChunk {
  marketData: MarketDataItem[]
  comparables: Comparable[]
}

export const MarketData = ({ data }: { data: MarketDataChunk }) => {
  const { marketData, comparables } = (data || {})

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col items-start">
        <Subtitle>Rent data</Subtitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bedrooms</TableHead>
              <TableHead>Rent (low)</TableHead>
              <TableHead>Rent (AVM)</TableHead>
              <TableHead>Rent (high)</TableHead>
              <TableHead>HUD FMR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {marketData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.bedrooms}</TableCell>
                <TableCell>{formatMoney(item.rent_low)}</TableCell>
                <TableCell>{formatMoney(item.rent_avm)}</TableCell>
                <TableCell>{formatMoney(item.rent_high)}</TableCell>
                <TableCell>{formatMoney(item.fmr)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            {comparables.map((comp, i) => (
              <TableRow key={i}>
                <TableCell>{comp.formattedAddress}</TableCell>
                <TableCell>
                  {typeof comp.price === 'number' ? formatMoney(comp.price) : comp.price}
                </TableCell>
                <TableCell>{comp.bedrooms}</TableCell>
                <TableCell>{comp.bathrooms}</TableCell>
                <TableCell>{comp.squareFootage ?? '—'}</TableCell>
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
