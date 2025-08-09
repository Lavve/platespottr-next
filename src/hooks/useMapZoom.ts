import { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'

export const useMapZoom = () => {
  const map = useMap()
  const [zoom, setZoom] = useState(map.getZoom())

  useEffect(() => {
    const handleZoom = () => {
      setZoom(map.getZoom())
    }

    map.on('zoomend', handleZoom)
    return () => {
      map.off('zoomend', handleZoom)
    }
  }, [map])

  return zoom
}
