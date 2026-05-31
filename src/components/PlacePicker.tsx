import { useState } from 'react'
import type { Place } from '../types'
import styles from '../styles/PlacePicker.module.css'

interface Props {
  places: Place[]
  /** true なら単一選択（タップで即確定）。false なら複数チェック → 追加。 */
  single?: boolean
  onAdd: (selected: Place[]) => void
  onClose: () => void
}

export default function PlacePicker({ places, single = false, onAdd, onClose }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleAdd() {
    const selected = places.filter((p) => checked.has(p.id))
    if (selected.length > 0) onAdd(selected)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span>{single ? '出発地を選ぶ' : '保存済みの場所'}</span>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            閉じる
          </button>
        </div>
        {places.length === 0 ? (
          <p className={styles.empty}>保存済みの場所はありません。</p>
        ) : (
          <ul className={styles.list}>
            {places.map((p) => (
              <li key={p.id}>
                {single ? (
                  <button
                    type="button"
                    className={styles.item}
                    onClick={() => onAdd([p])}
                  >
                    <span className={styles.itemText}>
                      <span className={styles.label}>{p.label}</span>
                      <span className={styles.query}>{p.query}</span>
                    </span>
                  </button>
                ) : (
                  <label className={styles.item}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={checked.has(p.id)}
                      onChange={() => toggle(p.id)}
                    />
                    <span className={styles.itemText}>
                      <span className={styles.label}>{p.label}</span>
                      <span className={styles.query}>{p.query}</span>
                    </span>
                  </label>
                )}
              </li>
            ))}
          </ul>
        )}
        {!single && (
          <button
            type="button"
            className={styles.addBtn}
            onClick={handleAdd}
            disabled={checked.size === 0}
          >
            追加{checked.size > 0 ? `（${checked.size}件）` : ''}
          </button>
        )}
      </div>
    </div>
  )
}
