import { useEffect, useRef, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Waypoint } from '../types'
import styles from '../styles/WaypointRow.module.css'

interface Props {
  waypoint: Waypoint
  placeholder: string
  onChange: (value: string) => void
  onClearLabel: () => void
  onRemove: () => void
  onPickPlace: () => void
}

export default function WaypointRow({
  waypoint,
  placeholder,
  onChange,
  onClearLabel,
  onRemove,
  onPickPlace,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: waypoint.id,
  })

  const [focused, setFocused] = useState(false)
  // フォーカス開始時点の value / label。blur 時の変更判定に使う。
  const originalValue = useRef('')
  const originalLabel = useRef<string | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement>(null)
  // label 表示から query 表示へ切り替えた直後に全選択するためのフラグ。
  const selectOnSwitch = useRef(false)

  // 未フォーカス時は表示名（label）を、フォーカス中は実際の query を表示・編集する。
  const displayValue = focused ? waypoint.value : waypoint.label ?? waypoint.value

  // label 付きの欄を編集開始したとき、query へ切り替わった後に全選択し
  // カーソルを末尾に置く（selectionDirection を forward にする）。
  useEffect(() => {
    if (!selectOnSwitch.current) return
    selectOnSwitch.current = false
    const el = inputRef.current
    if (el) el.setSelectionRange(0, el.value.length, 'forward')
  }, [displayValue])

  function handleFocus() {
    originalValue.current = waypoint.value
    originalLabel.current = waypoint.label
    if (waypoint.label != null) selectOnSwitch.current = true
    setFocused(true)
  }

  function handleBlur() {
    setFocused(false)
    // label を保ったまま query だけ手編集された場合に表示名を解除する。
    // ピッカーで別の場所に差し替えた場合（label が変わる）は解除しない。
    if (waypoint.value !== originalValue.current && waypoint.label === originalLabel.current) {
      onClearLabel()
    }
  }

  // 横方向の移動を無効化し、上下方向のみ動かす。
  const style = {
    transform: CSS.Transform.toString(transform ? { ...transform, x: 0 } : null),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={styles.row}>
      <button
        type="button"
        className={styles.handle}
        aria-label="ドラッグして並べ替え"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        value={displayValue}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => onChange(e.target.value)}
      />
      {focused && (
        <button
          type="button"
          className={styles.pickBtn}
          // pointerdown でフォーカスが外れて消える前に確実に押せるようにする。
          onPointerDown={(e) => e.preventDefault()}
          // ピッカーを開く前にキーボードを閉じる。
          onClick={() => {
            inputRef.current?.blur()
            onPickPlace()
          }}
          aria-label="保存済みの場所から選ぶ"
        >
          ★
        </button>
      )}
      <button
        type="button"
        className={styles.removeBtn}
        onClick={onRemove}
        aria-label="この地点を削除またはクリア"
      >
        ×
      </button>
    </div>
  )
}
