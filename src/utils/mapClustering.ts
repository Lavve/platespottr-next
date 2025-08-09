import type { IUserNumber } from '@/types/user'

interface MarkerData {
  lat: string
  lng: string
  found_at: string
  index: number
}

interface Cluster {
  lat: number
  lng: number
  markers: MarkerData[]
  count: number
}

export const clusterMarkers = (markers: IUserNumber[], maxDistance = 0.001): Cluster[] => {
  const clusters: Cluster[] = []
  const processed = new Set<number>()

  markers.forEach((marker, index) => {
    if (processed.has(index)) return

    const lat = Number(marker.lat)
    const lng = Number(marker.lng)

    const cluster: Cluster = {
      lat,
      lng,
      markers: [{ ...marker, index, lat: marker.lat || '', lng: marker.lng || '' }],
      count: 1,
    }

    // Find nearby markers
    markers.forEach((otherMarker, otherIndex) => {
      if (index === otherIndex || processed.has(otherIndex)) return

      const otherLat = Number(otherMarker.lat)
      const otherLng = Number(otherMarker.lng)

      // Simple distance calculation (roughly 100m when maxDistance = 0.001)
      const distance = Math.sqrt((lat - otherLat) ** 2 + (lng - otherLng) ** 2)

      if (distance <= maxDistance) {
        cluster.markers.push({
          ...otherMarker,
          index: otherIndex,
          lat: otherMarker.lat || '',
          lng: otherMarker.lng || '',
        })
        cluster.count++
        processed.add(otherIndex)
      }
    })

    processed.add(index)
    clusters.push(cluster)
  })

  return clusters
}
