import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Waypoint } from '../types'
import styles from '../styles/WaypointRow.module.css'

interface Props {
  waypoint: Waypoint
  placeholder: string
  disableRemove: boolean
  onRemove: () => void
  onPickPlace: () => void
}

export default function WaypointRow({
  waypoint,
  placeholder,
  disableRemove,
  onRemove,
  onPickPlace,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: waypoint.id,
  })

  // 横方向の移動を無効化し、上下方向のみ動かす。
  const style = {
    transform: CSS.Transform.toString(transform ? { ...transform, x: 0 } : null),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  const display = waypoint.label ?? waypoint.value

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
      <button
        type="button"
        className={styles.pick}
        onClick={onPickPlace}
        aria-label="保存済みの場所から選ぶ"
      >
        {display ? (
          <span className={styles.value}>{display}</span>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
      </button>
      <button
        type="button"
        className={styles.removeBtn}
        onClick={onRemove}
        disabled={disableRemove}
        aria-label="この地点を削除またはクリア"
      >
        ×
      </button>
    </div>
  )
}
