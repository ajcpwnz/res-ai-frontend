import { Property, PropertyType } from 'features/flow/state.ts'
import { http } from 'utils/http.ts'

interface CreatePropertyPayload extends Record<string, any> {

}

export const getProperties = async () => {
  const { data } = await http.get('/properties');

  return data;
}

export const deleteProperty = async (id: string) => {
  const { data } = await http.delete(`/properties/${id}`);

  return data;
}

export const getProperty = async (id: string) => {
  const { data } = await http.get(`/properties/${id}`);

  return data;
}

export const createProperty = async (payload: CreatePropertyPayload) => {
  const { data } = await http.post('/properties', payload);

  return data;
}

export const processAssesment = async (id: string) => {
  const { data } = await http.post(`/properties/${id}/process`);

  return data;
}

export const loadAssesment = async (id: string) => {
  const { data } = await http.post(`/properties/${id}/assesment`);

  return data;
}


export const advanceAssesment = async (id: string) => {
  const { data } = await http.post(`/properties/${id}/advance`);

  return data;
}

export const rewindAssesment = async (id: string) => {
  const { data } = await http.post(`/properties/${id}/rewind`);

  return data;
}

export const downloadReport = async (id: string) => {
  const { data } = await http.get(`/properties/${id}/report`, {responseType: 'blob'});

  return data;
}

export const uploadPropertyFile = async (formData: FormData) => {
  const {data}  = await http.post('/properties/parse', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}


export interface UpdateAddressDetailsPayload {
  property_type: PropertyType,
  bedrooms: number
  bathrooms: number
  square_footage: number
  lot_size_sqft: number
  year_built: number
  assessed_value: number
  annual_property_tax: number
  zip_code: string
}

export const saveAddressDetails = async (id: string, payload: UpdateAddressDetailsPayload) => {
  const { data } = await http.put(`/properties/${id}`, payload);

  return data;
}
