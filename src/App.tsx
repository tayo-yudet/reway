import { useEffect, useState } from 'react'
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

  if (view === 'places') {
    return <PlacesView places={places} onChange={setPlaces} onBack={() => setView('home')} />
  }

  return <HomeView places={places} onOpenPlaces={() => setView('places')} />
}
