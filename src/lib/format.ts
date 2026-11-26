const number = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: 'always',
})

const rateNumber = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
  useGrouping: 'always',
})

export const formatNumber = (v: number) => number.format(v)
export const formatUsd = (v: number) => `$${number.format(v)}`
export const formatRef = (v: number) => `Ref. ${formatUsd(v)}`
export const formatBsNumber = (usd: number, rate: number) => number.format(usd * rate)
export const formatBs = (usd: number, rate: number) => `Bs ${formatBsNumber(usd, rate)}`
export const formatRate = (rate: number) => rateNumber.format(rate)

export function formatHours(h: number): string {
  const total = Math.round(h * 60)
  return `${Math.floor(total / 60)} h ${String(total % 60).padStart(2, '0')} min`
}
