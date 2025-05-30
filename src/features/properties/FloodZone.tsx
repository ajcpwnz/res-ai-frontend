import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Subtitle } from 'components/Subtitle.tsx'

interface FloodZoneDataChunk {
  flood_zone: string
}

export const FloodZoneData = ({ data }: { data: FloodZoneDataChunk }) => {
  return data ? (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col items-start">
        <div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Flood zone</TableCell>
                <TableCell><b>{data.flood_zone}</b></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  ) : null
}
