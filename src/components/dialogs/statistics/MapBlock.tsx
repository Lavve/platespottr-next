'use client'

import { Box, Typography } from '@mui/material'
import { MapContainer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import MapContent from '@/components/dialogs/statistics/MapContent'
import { useMapContext } from '@/providers/MapProvider'
import { useSettings } from '@/providers/settingsProvider'
import type { IUser } from '@/types/user'

const MapBlock = ({
  user,
  resetZoom,
  pendingZoom,
  onZoomComplete,
}: {
  user: IUser
  resetZoom: boolean
  pendingZoom: { lat: number; lng: number } | null
  onZoomComplete: () => void
}) => {
  const t = useTranslations()
  const { settings } = useSettings()
  const { resetMapZoom, setOriginalBounds, zoomToCoordinates } = useMapContext()
  const markers = user.numbers?.filter(number => number.lat && number.lng) || []
  const zoomTimer = useRef<NodeJS.Timeout | null>(null)
  const pendingZoomTimer = useRef<NodeJS.Timeout | null>(null)

  const bounds: [number, number][] = markers
    .map(marker => {
      if (!marker.lat || !marker.lng) return undefined
      const parts = [marker.lat, marker.lng].map(Number)
      if (parts.length !== 2 || parts.some(Number.isNaN)) return undefined
      return [parts[0], parts[1]] as [number, number]
    })
    .filter((coord): coord is [number, number] => Array.isArray(coord))

  useEffect(() => {
    setOriginalBounds(bounds)
  }, [bounds, setOriginalBounds])

  useEffect(() => {
    if (resetZoom) {
      zoomTimer.current = setTimeout(() => {
        resetMapZoom()
      }, 100)
    }
    return () => {
      if (zoomTimer.current) {
        clearTimeout(zoomTimer.current)
        zoomTimer.current = null
      }
    }
  }, [resetZoom, resetMapZoom])

  useEffect(() => {
    if (pendingZoom) {
      pendingZoomTimer.current = setTimeout(() => {
        zoomToCoordinates(pendingZoom.lat, pendingZoom.lng, 18)
        onZoomComplete?.()
      }, 200)
    }

    return () => {
      if (pendingZoomTimer.current) {
        clearTimeout(pendingZoomTimer.current)
        pendingZoomTimer.current = null
      }
    }
  }, [pendingZoom, onZoomComplete, zoomToCoordinates])

  if (markers.length === 0) {
    return (
      <Box>
        <Typography>{t('statistics.no_location_data_available')}</Typography>
      </Box>
    )
  }

  const getTileLayer = () => {
    const tileLayer = {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }
    if (settings.theme === 'dark') {
      return {
        ...tileLayer,
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      }
    } else {
      return {
        ...tileLayer,
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      }
    }
  }

  const tileLayer = getTileLayer()

  return (
    <Box sx={{ height: '60vh', width: '100%' }}>
      <MapContainer
        bounds={bounds}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={false}
        dragging={true}
        touchZoom={true}
        keyboard={false}
      >
        <MapContent
          markers={markers}
          tileLayer={tileLayer}
          theme={settings.theme === 'dark' ? 'dark' : 'light'}
          bounds={bounds}
        />
      </MapContainer>
    </Box>
  )
}

export default MapBlock
