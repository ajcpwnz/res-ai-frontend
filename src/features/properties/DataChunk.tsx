import { __selectedProperty } from 'features/flow/state.ts'
import { AddressDetails } from 'features/flow/steps/AddressDetails.tsx'
import { AddressDetailsForm } from 'features/properties/AddressDetailsForm.tsx'
import { DemographicsData } from 'features/properties/DemographicsData.tsx'
import { FloodZoneData } from 'features/properties/FloodZone.tsx'
import { FMRData } from 'features/properties/FMR.tsx'
import { LocalData } from 'features/properties/LocalData.tsx'
import { MarketData } from 'features/properties/MarketData.tsx'
import { MarketSalesData } from 'features/properties/MarketSalesData.tsx'
import { MultifamilyExpenseRatio } from 'features/properties/MultifamilyExpenseRatio.tsx'
import { MultifamilyFinancialProjections } from 'features/properties/MultifamilyFinancialProjections.tsx'
import { RelatedPlaces } from 'features/properties/RelatedPlaces.tsx'
import { ResidentialExpenseRatio } from 'features/properties/ResidentialExpenseRatio.tsx'
import { ResidentialFinancialProjections } from 'features/properties/ResidentialFinancialProjections.tsx'
import { useModel } from 'features/properties/hooks.ts'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

export enum DataSource {
  RentCastAddressLookup = 'RentCastAddressLookup',
  RentCastMarketData = 'RentCastMarketData',
  RentCastSalesComp = 'RentCastSalesComp',
  FloodData = 'FloodData',
  HUDFmr = 'HUDFmr',
  CensusDemographicsReport = 'CensusDemographicsReport',
  GooglePlacesList = 'GooglePlacesList',
  PerplexityLocalData = 'PerplexityLocalData',
  DerivedResidentialExpenseRatio = 'DerivedResidentialExpenseRatio',
  DerivedMultifamilyExpenseRatio = 'DerivedMultifamilyExpenseRatio',
  DerivedResidentialFinancialProjections = 'DerivedResidentialFinancialProjections',
  DerivedMultifamilyFinancialProjections = 'DerivedMultifamilyFinancialProjections',
  DerivedResidentialInvestmentSummary = 'DerivedResidentialInvestmentSummary',
  DerivedMultifamilyInvestmentSummary = 'DerivedMultifamilyInvestmentSummary',
}

type ComponentEntry = {
  key: DataSource
  stage: string
  component: React.ComponentType<any>
}

type ConfigEntry = {
  key: DataSource
  stage: string
  component?: React.ComponentType<any>
  components?: ComponentEntry[]
}

const residentialConfig = {
  [DataSource.RentCastAddressLookup]: { key: DataSource.RentCastAddressLookup, stage: 'stage_1', component: AddressDetailsForm },
  [DataSource.RentCastMarketData]: { key: DataSource.RentCastMarketData, stage: 'stage_2', component: MarketData },
  [DataSource.RentCastSalesComp]: { key: DataSource.RentCastSalesComp, stage: 'stage_2', component: MarketSalesData },
  [DataSource.FloodData]: { key: DataSource.FloodData, stage: 'stage_2', component: FloodZoneData },
  [DataSource.CensusDemographicsReport]: { key: DataSource.CensusDemographicsReport, stage: 'stage_2', component: DemographicsData },
  [DataSource.GooglePlacesList]: { key: DataSource.GooglePlacesList, stage: 'stage_2', component: RelatedPlaces },
  [DataSource.PerplexityLocalData]: { key: DataSource.PerplexityLocalData, stage: 'stage_2', component: LocalData },
  [DataSource.DerivedResidentialExpenseRatio]: { key: DataSource.DerivedResidentialExpenseRatio, stage: 'stage_3', component: ResidentialExpenseRatio },
  [DataSource.DerivedResidentialFinancialProjections]: { key: DataSource.DerivedResidentialFinancialProjections, stage: 'stage_4', component: ResidentialFinancialProjections },
  [DataSource.DerivedResidentialInvestmentSummary]: {
    key: DataSource.DerivedResidentialInvestmentSummary,
    stage: 'stage_5',
    components: [
      { key: DataSource.RentCastMarketData, stage: 'stage_2', component: MarketData },
      { key: DataSource.RentCastSalesComp, stage: 'stage_2', component: MarketSalesData },
      { key: DataSource.FloodData, stage: 'stage_2', component: FloodZoneData },
      { key: DataSource.CensusDemographicsReport, stage: 'stage_2', component: DemographicsData },
      { key: DataSource.GooglePlacesList, stage: 'stage_2', component: RelatedPlaces },
      { key: DataSource.PerplexityLocalData, stage: 'stage_2', component: LocalData },
      { key: DataSource.DerivedResidentialFinancialProjections, stage: 'stage_4', component: ResidentialFinancialProjections },
    ],
  },
};

const chunkConfig: Record<string, Record<DataSource, ConfigEntry>> = {
  SingleFamily: residentialConfig,
  Residential: residentialConfig,
  MultiFamily: {
    [DataSource.RentCastAddressLookup]: { key: DataSource.RentCastAddressLookup, stage: 'stage_1', component: AddressDetailsForm },
    [DataSource.RentCastMarketData]: { key: DataSource.RentCastMarketData, stage: 'stage_2', component: MarketData },
    [DataSource.FloodData]: { key: DataSource.FloodData, stage: 'stage_2', component: FloodZoneData },
    [DataSource.CensusDemographicsReport]: { key: DataSource.CensusDemographicsReport, stage: 'stage_2', component: DemographicsData },
    [DataSource.GooglePlacesList]: { key: DataSource.GooglePlacesList, stage: 'stage_2', component: RelatedPlaces },
    [DataSource.PerplexityLocalData]: { key: DataSource.PerplexityLocalData, stage: 'stage_2', component: LocalData },
    [DataSource.DerivedMultifamilyExpenseRatio]: { key: DataSource.DerivedMultifamilyExpenseRatio, stage: 'stage_3', component: MultifamilyExpenseRatio },
    [DataSource.DerivedMultifamilyFinancialProjections]: { key: DataSource.DerivedMultifamilyFinancialProjections, stage: 'stage_4', component: MultifamilyFinancialProjections },
    [DataSource.DerivedMultifamilyInvestmentSummary]: {
      key: DataSource.DerivedMultifamilyInvestmentSummary,
      stage: 'stage_5',
      components: [
        { key: DataSource.RentCastMarketData, stage: 'stage_2', component: MarketData },
        { key: DataSource.FloodData, stage: 'stage_2', component: FloodZoneData },
        { key: DataSource.CensusDemographicsReport, stage: 'stage_2', component: DemographicsData },
        { key: DataSource.GooglePlacesList, stage: 'stage_2', component: RelatedPlaces },
        { key: DataSource.PerplexityLocalData, stage: 'stage_2', component: LocalData },
        { key: DataSource.DerivedMultifamilyFinancialProjections, stage: 'stage_4', component: MultifamilyFinancialProjections },
      ],
    },
  },
}

export const DataChunk = ({ chunk }: { chunk: DataSource }) => {

  const property = useAtomValue(__selectedProperty)
  const data = useModel(property?.id)
  const config = useMemo(() => chunkConfig[property.type]?.[chunk], [property, chunk])
  if (!config) return null

  if (config.components) {
    return config.components.map(({ key, stage, component: C }) => (
      <div className="my-4"><C data={data?.[stage]?.[key]} key={`${stage}-${key}`} /></div>
    ))
  }
  if (config.component) {
    const C = config.component
    return <div className="my-4"><C data={data?.[config.stage]?.[config.key]} /></div>
  }
  return <div className="my-4">{JSON.stringify(data?.[config.stage]?.[config.key])}</div>
}
