import { useState } from 'react'
import type { Place } from '../types'
import styles from '../styles/PlacesView.module.css'

interface Props {
  places: Place[]
  onChange: (places: Place[]) => void
  onBack: () => void
}

export default function PlacesView({ places, onChange, onBack }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [query, setQuery] = useState('')

  function resetForm() {
    setEditingId(null)
    setLabel('')
    setQuery('')
  }

  function startEdit(place: Place) {
    setEditingId(place.id)
    setLabel(place.label)
    setQuery(place.query)
  }

  function submit() {
    const l = label.trim()
    const q = query.trim()
    if (!l || !q) return

    if (editingId) {
      onChange(places.map((p) => (p.id === editingId ? { ...p, label: l, query: q } : p)))
    } else {
      onChange([...places, { id: crypto.randomUUID(), label: l, query: q }])
    }
    resetForm()
  }

  function remove(id: string) {
    onChange(places.filter((p) => p.id !== id))
    if (editingId === id) resetForm()
  }

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          &lt; 戻る
        </button>
        <h1 className={styles.title}>保存された場所</h1>
      </div>

      <div className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="愛称（例: 会社）"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="住所・地名（例: 東京都千代田区丸の内1-1）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={submit}
            disabled={!label.trim() || !query.trim()}
          >
            {editingId ? '更新' : '追加'}
          </button>
          {editingId && (
            <button type="button" className={styles.cancelBtn} onClick={resetForm}>
              キャンセル
            </button>
          )}
        </div>
      </div>

      {places.length === 0 ? (
        <p className={styles.empty}>まだ保存された場所はありません。</p>
      ) : (
        <ul className={styles.list}>
          {places.map((p) => (
            <li key={p.id} className={styles.item}>
              <div className={styles.itemText} onClick={() => startEdit(p)}>
                <span className={styles.label}>{p.label}</span>
                <span className={styles.query}>{p.query}</span>
              </div>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => remove(p.id)}
                aria-label="削除"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
