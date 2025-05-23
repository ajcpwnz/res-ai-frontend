import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Subtitle } from 'components/Subtitle.tsx'

interface SalesDataChunk {
  avm: {
    avm_value: string
  }
  comparables: {
    json: string
  }[]
}

export const MarketSalesData = ({ data }: { data: SalesDataChunk }) => {
  const avmValue = data.avm?.avm_value
  const comps = data.comparables

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col items-start">
        <Subtitle>Estimated Value</Subtitle>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>AVM Estimate</TableCell>
                <TableCell>${avmValue}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <Subtitle>Sales Comparables</Subtitle>
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
                <TableCell>{comp.bedrooms ?? '—'}</TableCell>
                <TableCell>{comp.bathrooms ?? '—'}</TableCell>
                <TableCell>{comp.squareFootage ?? '—'}</TableCell>
                <TableCell>{comp.removedDate?.slice(0, 10) ?? '—'}</TableCell>
                <TableCell>{comp.distance?.toFixed(2) ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
