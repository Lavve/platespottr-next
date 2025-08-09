import type L from 'leaflet'
import type { RefObject } from 'react'
import type { IUserNumber } from './user'

export interface IMapContextType {
  markerRefs: RefObject<Map<string, L.Marker>>
  mapRef: RefObject<L.Map | null>
  openPopup: (markerId: string) => void
  zoomToMarker: (markerId: string, zoomLevel?: number) => void
  zoomToCoordinates: (lat: number, lng: number, zoomLevel?: number) => void
  resetMapZoom: () => void
  setOriginalBounds: (bounds: [number, number][]) => void
}

export interface IMapContentProps {
  markers: IUserNumber[]
  tileLayer: {
    url: string
    attribution: string
  }
  theme: 'dark' | 'light'
  bounds: [number, number][]
}
