'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useMapZoom } from '@/hooks/useMapZoom'
import { useMapContext } from '@/providers/MapProvider'
import type { IMapContentProps } from '@/types/map'
import type { IUserNumber } from '@/types/user'
import { relativeDays } from '@/utils/dates'
import { clusterMarkers } from '@/utils/mapClustering'
import MapControls from './MapControls'
import { ClusterMarkerIcon, MapMarkerIcon } from './MapMarkerIcon'

const MapContent = ({ markers, tileLayer, theme, bounds }: IMapContentProps) => {
  const t = useTranslations()
  const zoom = useMapZoom()
  const map = useMap()
  const { markerRefs, mapRef } = useMapContext()

  useEffect(() => {
    if (mapRef.current !== map) {
      mapRef.current = map
    }
  }, [map, mapRef])

  // Dynamic clustering distance based on zoom level
  const getClusterDistance = (zoomLevel: number): number => {
    if (zoomLevel >= 14) return 0.001 // Close zoom - light clustering (~50m)
    if (zoomLevel >= 12) return 0.03 // Medium zoom - moderate clustering (~100m)
    if (zoomLevel >= 10) return 0.08 // Far zoom - aggressive clustering (~200m)
    if (zoomLevel >= 8) return 0.2 // Very far zoom - very aggressive clustering (~500m)
    return 0.5 // Very far zoom - very aggressive clustering (~500m)
  }

  const sortDesc = (a: IUserNumber, b: IUserNumber) => {
    return new Date(b.found_at).getTime() - new Date(a.found_at).getTime()
  }

  const sortAsc = (a: IUserNumber, b: IUserNumber) => {
    return new Date(a.found_at).getTime() - new Date(b.found_at).getTime()
  }

  const clusters = clusterMarkers(markers.sort(sortAsc), getClusterDistance(zoom))

  return (
    <>
      <TileLayer url={tileLayer.url} attribution={tileLayer.attribution} />
      <MapControls bounds={bounds} />

      {clusters.map(cluster => {
        const position: [number, number] = [cluster.lat, cluster.lng]

        if (cluster.count === 1) {
          // Single marker
          const marker = cluster.markers[0]
          const markerId = `marker-${marker.index}`

          return (
            <Marker
              key={`single-${marker.found_at}`}
              position={position}
              icon={MapMarkerIcon((marker.index + 1).toString().padStart(3, '0'), theme)}
              ref={ref => {
                if (ref) {
                  markerRefs.current?.set(markerId, ref)
                } else {
                  markerRefs.current?.delete(markerId)
                }
              }}
            >
              <Popup>
                <strong>{(marker.index + 1).toString().padStart(3, '0')}:</strong>{' '}
                {relativeDays(new Date(marker.found_at), t)}
              </Popup>
            </Marker>
          )
        } else {
          // Cluster marker
          return (
            <Marker
              key={`cluster-${cluster.lat}-${cluster.lng}`}
              position={position}
              icon={ClusterMarkerIcon(cluster.count, theme)}
            >
              <Popup>
                <div>
                  <strong>{t('statistics.findings_at_locations', { count: cluster.count })}</strong>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '8px' }}>
                    {cluster.markers.sort(sortDesc).map(marker => (
                      <div
                        key={`marker-${marker.index}`}
                        style={{
                          padding: '2px 0',
                        }}
                      >
                        <strong>{(marker.index + 1).toString().padStart(3, '0')}</strong>:{' '}
                        {relativeDays(new Date(marker.found_at), t)}
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        }
      })}
    </>
  )
}

export default MapContent
