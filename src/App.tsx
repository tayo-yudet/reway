import { useEffect, useLayoutEffect, useState } from 'react'
import type { Place } from './types'
import { loadPlaces, savePlaces } from './lib/storage'
import HomeView from './components/HomeView'
import PlacesView from './components/PlacesView'

type View = 'home' | 'places'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [places, setPlaces] = useState<Place[]>(() => loadPlaces())

  useEffect(() => {
    savePlaces(places)
  }, [places])

  // 画面遷移時にページ最上部へ戻す。描画前(useLayoutEffect)に加え、
  // 描画後(rAF)にもリセットして iOS でのスクロール位置の持ち越しを防ぐ。
  useLayoutEffect(() => {
    const reset = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
    reset()
    const id = requestAnimationFrame(reset)
    return () => cancelAnimationFrame(id)
  }, [view])

  if (view === 'places') {
    return <PlacesView places={places} onChange={setPlaces} onBack={() => setView('home')} />
  }

  return <HomeView places={places} onOpenPlaces={() => setView('places')} />
}
