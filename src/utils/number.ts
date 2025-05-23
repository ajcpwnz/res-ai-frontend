export const formatPercents = (n?: number, from: number = 1) => {
  if(!(n && from)){
    return 'N/A';
  }

  return `${((n / from) * 100).toFixed(2)}%`;
}

export  function formatMoney(value: unknown): string {
  const amount = typeof value === 'string' && value.trim() !== ''
    ? Number(value)
    : value;

  if (typeof amount !== 'number' || !isFinite(amount)) {
    return 'N/A'
  }

  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return `$${formatted}`
}
