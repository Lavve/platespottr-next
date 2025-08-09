'use client'

import type L from 'leaflet'
import { createContext, useCallback, useContext, useMemo, useRef } from 'react'
import type { IMapContextType } from '@/types/map'

const MapContext = createContext<IMapContextType | null>(null)

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const markerRefs = useRef<Map<string, L.Marker>>(new Map())
  const mapRef = useRef<L.Map | null>(null)
  const originalBoundsRef = useRef<[number, number][] | null>(null)

  const openPopup = useCallback((markerId: string) => {
    const marker = markerRefs.current.get(markerId)
    if (marker) {
      marker.openPopup()
    }
  }, [])

  const zoomToMarker = useCallback((markerId: string, zoomLevel: number = 16) => {
    const marker = markerRefs.current.get(markerId)
    const map = mapRef.current

    if (marker && map) {
      const position = marker.getLatLng()

      map.setView(position, zoomLevel, {
        animate: true,
        duration: 0.5,
      })

      setTimeout(() => {
        marker.openPopup()
      }, 300)
    }
  }, [])

  const zoomToCoordinates = useCallback((lat: number, lng: number, zoomLevel: number = 16) => {
    const map = mapRef.current

    if (map) {
      map.setView([lat, lng], zoomLevel, {
        animate: true,
        duration: 0.5,
      })

      setTimeout(() => {
        markerRefs.current.forEach(marker => {
          const markerPos = marker.getLatLng()
          const distance = Math.sqrt((markerPos.lat - lat) ** 2 + (markerPos.lng - lng) ** 2)

          if (distance < 0.00001) {
            marker.openPopup()
          }
        })
      }, 300)
    }
  }, [])

  const resetMapZoom = useCallback(() => {
    const map = mapRef.current
    const bounds = originalBoundsRef.current

    if (map && bounds && bounds.length > 0) {
      map.fitBounds(bounds, {
        padding: [20, 20],
        animate: true,
        duration: 0.5,
      })
    }
  }, [])

  const setOriginalBounds = useCallback((bounds: [number, number][]) => {
    originalBoundsRef.current = bounds
  }, [])

  const value = useMemo(
    () => ({ markerRefs, mapRef, openPopup, zoomToMarker, zoomToCoordinates, resetMapZoom, setOriginalBounds }),
    [openPopup, zoomToMarker, zoomToCoordinates, resetMapZoom, setOriginalBounds]
  )

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

export const useMapContext = () => {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMapContext must be used within MapProvider')
  }
  return context
}
