import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

interface FloodZoneDataChunk {
  fmr: string
}

export const FMRData = ({ data }: { data: FloodZoneDataChunk }) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col items-start">
        <div>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>HUD FMR</TableCell>
                <TableCell><b>${data.fmr}</b></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
