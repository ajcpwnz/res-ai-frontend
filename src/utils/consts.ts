export enum RenovationScope {
  light = 'light',
  medium = 'medium',
  heavy =  'heavy'
}

export const renovationRates: Record<RenovationScope, number> = {
  [RenovationScope.light]: 7000,
  [RenovationScope.medium]: 12000,
  [RenovationScope.heavy]: 17000
}
