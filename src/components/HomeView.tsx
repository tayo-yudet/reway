import { useState } from 'react'
import type { Place, Waypoint } from '../types'
import { CURRENT_LOCATION } from '../types'
import { buildGoogleMapsUrl, MAX_WAYPOINTS } from '../lib/mapsUrl'
import WaypointList from './WaypointList'
import PlacePicker from './PlacePicker'
import styles from '../styles/HomeView.module.css'

// 地点の最大数（出発 + 中継 + 目的地）。waypoints 上限 9 = 中継9。
const MAX_POINTS = MAX_WAYPOINTS + 2

// 'bulk' = 複数チェックして末尾に追加。{ row: id } = その行に1件反映。
type Picker = 'bulk' | { row: string } | null

interface Props {
  places: Place[]
  onOpenPlaces: () => void
}

export default function HomeView({ places, onOpenPlaces }: Props) {
  // 出発地のデフォルトは「現在地」（query 空 → origin 省略）。
  const [waypoints, setWaypoints] = useState<Waypoint[]>(() => [
    { id: crypto.randomUUID(), value: CURRENT_LOCATION.query, label: CURRENT_LOCATION.label },
  ])
  const [picker, setPicker] = useState<Picker>(null)

  const url = buildGoogleMapsUrl(waypoints.map((w) => w.value))
  const canAdd = waypoints.length < MAX_POINTS

  // 2地点以上ならその行を削除。1地点以下なら現在地に戻す。
  function removeWaypoint(id: string) {
    setWaypoints((prev) =>
      prev.length > 1
        ? prev.filter((w) => w.id !== id)
        : prev.map((w) =>
            w.id === id
              ? { ...w, value: CURRENT_LOCATION.query, label: CURRENT_LOCATION.label }
              : w,
          ),
    )
  }

  // 指定した行に保存済み場所を1件だけ反映する。表示名は label を使う。
  function handlePickRow(id: string, selected: Place[]) {
    const place = selected[0]
    if (place)
      setWaypoints((prev) =>
        prev.map((w) => (w.id === id ? { ...w, value: place.query, label: place.label } : w)),
      )
    setPicker(null)
  }

  // チェックした保存済み場所を地点として追加する。
  // 先頭（出発地）以外の空欄を左から埋め、残りは末尾に新規地点として追加する。
  // 出発地が空でも埋めず、現在地起点のまま新規地点を追加する。
  function handleAddPlaces(selected: Place[]) {
    setWaypoints((prev) => {
      const next = [...prev]
      const queue = [...selected]

      // 1) 先頭以外の空欄を左から埋める。
      for (let i = 1; i < next.length && queue.length > 0; i++) {
        if (next[i].value.trim() === '') {
          const p = queue.shift()!
          next[i] = { ...next[i], value: p.query, label: p.label }
        }
      }

      // 2) 残りは末尾に追加（上限を超えない範囲で）。
      while (queue.length > 0 && next.length < MAX_POINTS) {
        const p = queue.shift()!
        next.push({ id: crypto.randomUUID(), value: p.query, label: p.label })
      }

      return next
    })
    setPicker(null)
  }

  function openInGoogleMaps() {
    if (!url) return
    window.location.href = url
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>経路をつくる</h1>

      <WaypointList
        waypoints={waypoints}
        onReorder={setWaypoints}
        onRemove={removeWaypoint}
        onPickPlace={(id) => setPicker({ row: id })}
      />

      <button
        type="button"
        className={styles.addBtn}
        onClick={() => setPicker('bulk')}
        disabled={!canAdd}
      >
        ＋ 追加
      </button>
      {!canAdd && <p className={styles.note}>地点は最大 {MAX_POINTS} 件までです。</p>}

      <button type="button" className={styles.openBtn} onClick={openInGoogleMaps} disabled={!url}>
        Google Mapsで開く
      </button>

      <button type="button" className={styles.placesLink} onClick={onOpenPlaces}>
        <span>保存済みの場所</span>
        <span>&gt;</span>
      </button>

      {picker && typeof picker === 'object' && (
        <PlacePicker
          places={places}
          single
          onAdd={(sel) => handlePickRow(picker.row, sel)}
          onClose={() => setPicker(null)}
        />
      )}
      {picker === 'bulk' && (
        <PlacePicker places={places} onAdd={handleAddPlaces} onClose={() => setPicker(null)} />
      )}
    </div>
  )
}
