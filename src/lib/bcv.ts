// Official USD rate published by the BCV. The endpoint comes from VITE_BCV_API_URL (see .env.example);
// it must return JSON with the rate in `promedio`, and allow calls from the browser (CORS).
const ENDPOINT: string | undefined = import.meta.env.VITE_BCV_API_URL

export type BcvRate = { rate: number }

export async function fetchBcvRate(signal: AbortSignal): Promise<BcvRate> {
  if (!ENDPOINT) throw new Error('VITE_BCV_API_URL is not set')
  const res = await fetch(ENDPOINT, { signal })
  if (!res.ok) throw new Error(`BCV rate request failed: ${res.status}`)
  const data: { promedio?: unknown } = await res.json()
  const rate = Number(data.promedio)
  if (!Number.isFinite(rate) || rate <= 0) throw new Error('BCV rate response has no valid rate')
  return { rate }
}
