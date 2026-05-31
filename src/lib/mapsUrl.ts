/**
 * 地点テキストの配列から Google Maps の経路 URL（dir/?api=1 形式）を生成する。
 *
 * 役割は「位置」で決まる:
 * - 先頭の欄 = origin（出発地）。空なら省略 = 現在地起点。
 * - 末尾の非空の欄 = destination（目的地）。
 * - その間の非空の欄 = waypoints（中継地点。空欄はスキップ、`|` 区切り）。
 * 各値は encodeURIComponent。有効な地点が無ければ null。
 */
export const MAX_WAYPOINTS = 9

const BASE = 'https://www.google.com/maps/dir/?api=1'

export function buildGoogleMapsUrl(points: string[]): string | null {
  const trimmed = points.map((p) => p.trim())

  // 目的地 = 末尾側にある最後の非空の地点。
  let lastIdx = -1
  for (let i = trimmed.length - 1; i >= 0; i--) {
    if (trimmed[i].length > 0) {
      lastIdx = i
      break
    }
  }
  if (lastIdx === -1) return null

  // 非空が先頭欄のみ（または1件のみ） → 目的地だけ。
  if (lastIdx === 0) {
    return `${BASE}&destination=${encodeURIComponent(trimmed[0])}`
  }

  const origin = trimmed[0] // 先頭欄。空なら現在地起点として省略。
  const destination = trimmed[lastIdx]
  const waypoints = trimmed.slice(1, lastIdx).filter((p) => p.length > 0)

  const params: string[] = []
  if (origin.length > 0) params.push(`origin=${encodeURIComponent(origin)}`)
  params.push(`destination=${encodeURIComponent(destination)}`)
  if (waypoints.length > 0) {
    params.push(`waypoints=${waypoints.map((w) => encodeURIComponent(w)).join('|')}`)
  }

  return `${BASE}&${params.join('&')}`
}
