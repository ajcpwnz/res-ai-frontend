import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Subtitle } from 'components/Subtitle.tsx'

interface LocalDataItem {
  universityStudentCount: string
  hospitalEmployeeCount: string
  mallVisitorCount: string
  economicDevelopment: string
}

interface VacancyData {
  vacancy: string
  localData: LocalDataItem
}

export const LocalData = ({ data }: { data: VacancyData }) => {
  const { vacancy, localData } = data

  return  localData ? (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col items-start">
        <Subtitle>Vacancy Rate</Subtitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Vacancy</TableCell>
              <TableCell>{(parseFloat(vacancy) * 100).toFixed(2)}%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <Subtitle>Local Data Details</Subtitle>

        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-semibold">University Student Count</TableCell>
              <TableCell>{localData.universityStudentCount || 'No data available'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold">Economic Development</TableCell>
              <TableCell style={{ whiteSpace: 'pre-wrap' }}>{localData.economicDevelopment || 'No data available'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  ) : null
}
