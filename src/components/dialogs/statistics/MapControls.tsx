'use client'

import L from 'leaflet'
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface MapControlsProps {
  bounds: [number, number][]
}

const MapControls = ({ bounds }: MapControlsProps) => {
  const map = useMap()

  useEffect(() => {
    // Create custom control
    const customControl = L.Control.extend({
      options: {
        position: 'topright',
      },

      onAdd: () => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')

        // Reset bounds button
        const resetButton = L.DomUtil.create('a', 'leaflet-control-button', container)
        resetButton.innerHTML = `
          <div style="
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: 'white';
            color: '#333';
            border: none;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
          " title="Reset zoom to show all markers">
            ↻
          </div>
        `
        resetButton.href = '#'
        resetButton.role = 'button'
        resetButton.setAttribute('aria-label', 'Reset zoom')

        L.DomEvent.on(resetButton, 'click', e => {
          L.DomEvent.preventDefault(e)
          L.DomEvent.stopPropagation(e)
          if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [20, 20] })
          }
        })

        return container
      },
    })

    const control = new customControl()
    map.addControl(control)

    return () => {
      map.removeControl(control)
    }
  }, [map, bounds])

  return null
}

export default MapControls
