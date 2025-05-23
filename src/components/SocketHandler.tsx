import { useForm } from 'features/flow/hooks.ts'
import {
  __error,
  __propertyStates,
  __selectedProperty,
  AssesmentStatus,
  usePropertyList,
  useSelectedProperty
} from 'features/flow/state.ts'
import { DataSource } from 'features/properties/DataChunk.tsx'
import { useUpdateModel } from 'features/properties/hooks.ts'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { socket } from 'utils/socket.ts'

export const SocketHandler = () => {
  const updateProperty = useUpdateModel();
  const setError = useSetAtom(__error);

  const { updateForm } = useForm()

  const setPropertyStates = useSetAtom(__propertyStates)
  const { setProperty } = useSelectedProperty()

  useEffect(() => {
    socket.onAny((evt, msg) => {
      switch (evt) {
        case 'start_assesment':
          setPropertyStates(old => ({
            ...old,
            [msg.id]: {
              id: msg.id,
              status: AssesmentStatus.processing,
              meta: {
                stage: msg.stage
              }
            }
          }))
          return

        case 'finish_assesment':
          setPropertyStates(old => ({
            ...old,
            [msg.property.id]: {
              id: msg.property.id,
              status: AssesmentStatus.idle,
              meta: {
                stage: msg.property.stage
              }
            }
          }))

          setProperty(msg.property)

          return

        case 'fail_assesment':
          setPropertyStates(old => ({
            ...old,
            [msg.id]: {
              id: msg.id,
              status: AssesmentStatus.error,
              meta: {
                stage: msg.stage
              }
            }
          }));

          if(msg.stage === 'stage_1') {
            updateProperty(msg.id, msg.stage, 'RentCastAddressLookup', {});
          }

          setError(msg.error);

          return

        case 'provider_data_received':
          handleProviderData(msg)
          return

        default:
          console.warn(evt, msg)
      }
    })

    return () => {
    }
  }, [])

  const handleProviderData = (data: { data: any, stage: string, dataSource: string, id: string }) => {
    updateProperty(data.id, data.stage, data.dataSource, data.data)

    switch (data.dataSource) {
      case 'RentCastAddressLookup':
        updateForm(data.data)
        return
      case 'DerivedResidentialExpenseRatio':
        updateForm(data.data)
        return

      default:
        break
    }
  }


  return <input type="hidden"/>
}
