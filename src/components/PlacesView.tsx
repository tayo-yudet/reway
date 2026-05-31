import { useState } from 'react'
import type { Place } from '../types'
import styles from '../styles/PlacesView.module.css'

interface Props {
  places: Place[]
  onChange: (places: Place[]) => void
  onBack: () => void
}

export default function PlacesView({ places, onChange, onBack }: Props) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [query, setQuery] = useState('')

  function openAdd() {
    setEditingId(null)
    setLabel('')
    setQuery('')
    setFormOpen(true)
  }

  function openEdit(place: Place) {
    setEditingId(place.id)
    setLabel(place.label)
    setQuery(place.query)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
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
    closeForm()
  }

  function remove(id: string) {
    onChange(places.filter((p) => p.id !== id))
    if (editingId === id) closeForm()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button type="button" className={styles.iconBtn} onClick={onBack} aria-label="戻る">
          &lt;
        </button>
        <button type="button" className={styles.iconBtn} onClick={openAdd} aria-label="場所を追加">
          ＋
        </button>
      </div>

      <h1 className={styles.title}>保存済みの場所</h1>

      {places.length === 0 ? (
        <p className={styles.empty}>まだ保存された場所はありません。</p>
      ) : (
        <ul className={styles.list}>
          {places.map((p) => (
            <li key={p.id} className={styles.item}>
              <div className={styles.itemText} onClick={() => openEdit(p)}>
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

      {formOpen && (
        <div className={styles.overlay} onClick={closeForm}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span>{editingId ? '場所を編集' : '場所を追加'}</span>
              <button type="button" className={styles.closeBtn} onClick={closeForm}>
                閉じる
              </button>
            </div>
            <input
              className={styles.input}
              type="text"
              placeholder="表示名"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="住所・地名"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="button"
              className={styles.saveBtn}
              onClick={submit}
              disabled={!label.trim() || !query.trim()}
            >
              {editingId ? '更新' : '追加'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
