import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Subtitle } from 'components/Subtitle.tsx'
import { Fragment } from 'react'

interface RelatedPlace {
  name: { text: string; languageCode: string }
  formattedAddress: string
  type: string
  distance: number
  size: number | string
  info: string
}

export const RelatedPlaces = ({ data }: { data: { related_places: RelatedPlace[] } }) => {
  const places = data.related_places

  return (
    <div className="flex flex-col space-y-4 ">
        <Subtitle>Nearby Places</Subtitle>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="!w-[100px]">Address</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Distance (mi)</TableHead>
              <TableHead>Size / Traffic</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {places.map((place, i) => (
              <Fragment key={i}>
                <TableRow>
                  <TableCell><b>{place.name.text}</b></TableCell>
                  <TableCell>{place.formattedAddress}</TableCell>
                  <TableCell>{place.type?.replace('_', ' ')}</TableCell>
                  <TableCell>{place.distance.toFixed(2)}</TableCell>
                  <TableCell className="whitespace-normal">{place.size || '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5} className="whitespace-normal">
                    <div className="w-[900px]">{place.info}</div>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
    </div>
  )
}
