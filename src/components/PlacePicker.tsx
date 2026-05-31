import { useState } from "react";
import type { Place } from "../types";
import { CURRENT_LOCATION } from "../types";
import styles from "../styles/PlacePicker.module.css";

interface Props {
  places: Place[];
  /** true なら単一選択（タップで即確定）。false なら複数チェック → 追加。 */
  single?: boolean;
  onAdd: (selected: Place[]) => void;
  onClose: () => void;
}

export default function PlacePicker({
  places,
  single = false,
  onAdd,
  onClose,
}: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // 先頭に「現在地」を出す。
  const options = [CURRENT_LOCATION, ...places];

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAdd() {
    const selected = options.filter((p) => checked.has(p.id));
    if (selected.length > 0) onAdd(selected);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span>{"保存済みの場所"}</span>
          {!single && (
            <button
              type="button"
              className={styles.headerAddBtn}
              onClick={handleAdd}
              disabled={checked.size === 0}
            >
              {checked.size > 0 ? `${checked.size}件 追加` : "追加"}
            </button>
          )}
        </div>
        {options.length === 0 ? (
          <p className={styles.empty}>保存済みの場所はありません。</p>
        ) : (
          <ul className={styles.list}>
            {options.map((p) => (
              <li key={p.id}>
                {single ? (
                  <button
                    type="button"
                    className={styles.item}
                    onClick={() => onAdd([p])}
                  >
                    <span className={styles.itemText}>
                      <span className={styles.label}>{p.label}</span>
                      {p.query && (
                        <span className={styles.query}>{p.query}</span>
                      )}
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
                      {p.query && (
                        <span className={styles.query}>{p.query}</span>
                      )}
                    </span>
                  </label>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
