export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m`
  return `${s}s`
}

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10)
}

export function daysBetween(aKey: string, bKey: string): number {
  const a = new Date(aKey + 'T00:00:00Z').getTime()
  const b = new Date(bKey + 'T00:00:00Z').getTime()
  return Math.round((b - a) / (24 * 60 * 60 * 1000))
}

export function pct(n: number): string {
  return `${Math.round(n)}%`
}

export function pluralize(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}
