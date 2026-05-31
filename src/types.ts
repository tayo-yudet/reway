export interface Place {
  id: string
  /** 表示用の愛称（例「会社」） */
  label: string
  /** Google Maps に渡す実テキスト（例「東京都千代田区丸の内1-1」） */
  query: string
}

/** ホームで編集中の1地点。保存はされず使い捨て。 */
export interface Waypoint {
  /** D&D 用の安定したキー */
  id: string
  /** 地点テキスト（Google Maps に渡す query） */
  value: string
  /** 保存済み場所から追加した場合の表示名。手入力すると解除される。 */
  label?: string
}
