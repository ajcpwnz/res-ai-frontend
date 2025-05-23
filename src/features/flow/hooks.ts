import { __propertyForm, __propertyStates, __selectedProperty, __steps, AssesmentStatus } from 'features/flow/state.ts'
import { useAtom } from 'jotai'
import { useAtomValue } from 'jotai/index'
import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router'


const mockData = {
  address: '2813 W Clearfield St, Philadelphia, PA 19132',
  stage1: {
    lookupData: {
      property_type: "Single Family",
      bedrooms: 3,
      bathrooms: 1,
      square_footage: 1098,
      lot_size_sqft: 1120,
      year_built: 1925,
      assessed_value: 74600,
      annual_property_tax: 1044,
      zip_code: "19132",
      unit_count: 1,
    }
  },
  stage2: {
    marketData: {
      avg_rent: 1250,
      rent_low: 1050,
      rent_high: 1450,
    },
    fmr: 1690,
    avm: 99000,
    sale_comps: [
      {
        id: "3123-N-Judson-St,-Philadelphia,-PA-19132",
        formattedAddress: "3123 N Judson St, Philadelphia, PA 19132",
        addressLine1: "3123 N Judson St",
        addressLine2: null,
        city: "Philadelphia",
        state: "PA",
        zipCode: "19132",
        county: "Philadelphia",
        latitude: 40.002515,
        longitude: -75.168532,
        propertyType: "Single Family",
        bedrooms: 3,
        bathrooms: 1,
        squareFootage: 908,
        lotSize: 830,
        yearBuilt: 1925,
        price: 165000,
        listingType: "New Construction",
        listedDate: "2024-07-08T00:00:00.000Z",
        removedDate: "2024-11-17T00:00:00.000Z",
        lastSeenDate: "2024-11-16T13:30:15.629Z",
        daysOnMarket: 132,
        distance: 0.3997,
        daysOld: 179,
        correlation: 0.9678,
      }, {
        id: "3134-N-22nd-St,-Philadelphia,-PA-19132",
        formattedAddress: "3134 N 22nd St, Philadelphia, PA 19132",
        addressLine1: "3134 N 22nd St",
        addressLine2: null,
        city: "Philadelphia",
        state: "PA",
        zipCode: "19132",
        county: "Philadelphia",
        latitude: 40.002648,
        longitude: -75.166258,
        propertyType: "Single Family",
        bedrooms: 3,
        bathrooms: 1,
        squareFootage: 900,
        lotSize: 851,
        yearBuilt: 1915,
        price: 89900,
        listingType: "Standard",
        listedDate: "2025-02-11T00:00:00.000Z",
        removedDate: "2025-02-17T00:00:00.000Z",
        lastSeenDate: "2025-02-16T10:33:24.252Z",
        daysOnMarket: 6,
        distance: 0.5189,
        daysOld: 87,
        correlation: 0.9649,
      }, {
        id: "2858-N-26th-St,-Philadelphia,-PA-19132",
        formattedAddress: "2858 N 26th St, Philadelphia, PA 19132",
        addressLine1: "2858 N 26th St",
        addressLine2: null,
        city: "Philadelphia",
        state: "PA",
        zipCode: "19132",
        county: "Philadelphia",
        latitude: 39.999402,
        longitude: -75.173511,
        propertyType: "Single Family",
        bedrooms: 3,
        bathrooms: 2,
        squareFootage: 1444,
        lotSize: 896,
        yearBuilt: 1940,
        price: 95000,
        listingType: "Standard",
        listedDate: "2025-04-22T00:00:00.000Z",
        removedDate: null,
        lastSeenDate: "2025-05-13T12:50:19.630Z",
        daysOnMarket: 22,
        distance: 0.2921,
        daysOld: 1,
        correlation: 0.9053,
      }, {
        id: "2534-36-W-Harold-St,-Philadelphia,-PA-19132",
        formattedAddress: "2534-36 W Harold St, Philadelphia, PA 19132",
        addressLine1: "2534-36 W Harold St",
        addressLine2: null,
        city: "Philadelphia",
        state: "PA",
        zipCode: "19132",
        county: "Philadelphia",
        latitude: 39.995243,
        longitude: -75.173813,
        propertyType: "Single Family",
        bedrooms: 2,
        bathrooms: 1,
        squareFootage: 900,
        lotSize: 2160,
        yearBuilt: 1915,
        price: 104900,
        listingType: "Standard",
        listedDate: "2024-07-30T00:00:00.000Z",
        removedDate: "2025-01-09T00:00:00.000Z",
        lastSeenDate: "2025-01-08T12:05:29.851Z",
        daysOnMarket: 163,
        distance: 0.56,
        daysOld: 126,
        correlation: 0.8826,
      }, {
        id: "2927-N-Ringgold-St,-Philadelphia,-PA-19132",
        formattedAddress: "2927 N Ringgold St, Philadelphia, PA 19132",
        addressLine1: "2927 N Ringgold St",
        addressLine2: null,
        city: "Philadelphia",
        state: "PA",
        zipCode: "19132",
        county: "Philadelphia",
        latitude: 39.999777,
        longitude: -75.17035,
        propertyType: "Single Family",
        bedrooms: 2,
        bathrooms: 1,
        squareFootage: 840,
        lotSize: 574,
        yearBuilt: 1940,
        price: 30000,
        listingType: "Standard",
        listedDate: "2024-12-18T00:00:00.000Z",
        removedDate: "2025-01-29T00:00:00.000Z",
        lastSeenDate: "2025-01-28T11:16:49.402Z",
        daysOnMarket: 42,
        distance: 0.3811,
        daysOld: 106,
        correlation: 0.8783,
      }
    ]
  }
}

export const useForm = () => {
  const [form, setForm] = useAtom(__propertyForm);


  const updateField = (key: string, value?: any) => {
    setForm(old => ({
      ...old,
      [key]: value || mockData[key]
    }))
  }

  const updateForm = (data: Record<string, any>) => {
    setForm(old => ({
      ...old,
      ...(data || {})
    }))
  }

  return {
    form,
    updateForm,
    updateField
  }
}

const stagesToSteps = {
  '_default': 1,
  'stage_1': 1,
  'stage_2': 2,
  'stage_3': 3,
  'stage_4': 4,
  'stage_5': 5,
}

export const useSteps = () => {
  const [steps, setSteps] = useAtom(__steps);
  const selectedProperty = useAtomValue(__selectedProperty);

  const iterator = useMemo(() => (new Array(steps.total).fill(0)), [steps.total])
  const widthClass = useMemo(() => `w-1/${steps.total}`, [steps.total])

  useEffect(() => {
    if(!selectedProperty) {
      setSteps(old => ({
        ...old,
        current: 0
      }));

      return;
    }

    setSteps(old => ({
      ...old,
      current: stagesToSteps[selectedProperty.stage] || stagesToSteps._default
    }))
  }, [selectedProperty])

  const goToStep = (n: number) => {
    setSteps(old => ({
      ...old,
      current: n,
    }))
  }

  return {
    current: steps.current,
    iterator,
    widthClass,
    goToStep
  }
}

export const useCurrentPropertyState = () => {
  const {id} = useParams();

  const propertyStates = useAtomValue(__propertyStates);

  return propertyStates[id || ''] || {status: AssesmentStatus.idle};
}

export const usePropertyState = (id: string) => {
  const propertyStates = useAtomValue(__propertyStates);

  return propertyStates[id];
}
