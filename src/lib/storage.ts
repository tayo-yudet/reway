import type { Place } from '../types'

const STORAGE_KEY = 'saved-places'

export function loadPlaces(): Place[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (p): p is Place =>
        p && typeof p.id === 'string' && typeof p.label === 'string' && typeof p.query === 'string',
    )
  } catch {
    return []
  }
}

export function savePlaces(places: Place[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(places))
}
