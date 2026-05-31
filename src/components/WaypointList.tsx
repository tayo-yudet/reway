import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Waypoint } from '../types'
import WaypointRow from './WaypointRow'

interface Props {
  waypoints: Waypoint[]
  onReorder: (waypoints: Waypoint[]) => void
  onChange: (id: string, value: string) => void
  onClearLabel: (id: string) => void
  onRemove: (id: string) => void
  onPickPlace: (id: string) => void
}

function placeholderFor(index: number): string {
  if (index === 0) return '出発地（空欄なら現在地）'
  return `地点 ${index}`
}

export default function WaypointList({
  waypoints,
  onReorder,
  onChange,
  onClearLabel,
  onRemove,
  onPickPlace,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = waypoints.findIndex((w) => w.id === active.id)
    const newIndex = waypoints.findIndex((w) => w.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorder(arrayMove(waypoints, oldIndex, newIndex))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={waypoints.map((w) => w.id)} strategy={verticalListSortingStrategy}>
        {waypoints.map((w, index) => (
          <WaypointRow
            key={w.id}
            waypoint={w}
            placeholder={placeholderFor(index)}
            onChange={(value) => onChange(w.id, value)}
            onClearLabel={() => onClearLabel(w.id)}
            onRemove={() => onRemove(w.id)}
            onPickPlace={() => onPickPlace(w.id)}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}
