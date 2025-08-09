import L from 'leaflet'
import theme, { darkTheme } from '@/style/theme'

export const MapMarkerIcon = (number: string, themeChoice: 'light' | 'dark') => {
  const currentTheme = themeChoice === 'dark' ? darkTheme : theme

  return L.divIcon({
    className: 'logo-marker',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      ">
         <div style="
          width: 32px;
          height: 32px;
          background: ${currentTheme.palette.background.paper};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          border: 2px solid ${currentTheme.palette.primary.main};
        ">
          <img src="/icons/logo.svg" width="20" height="20" alt="marker" />
        </div>
        <div style="
          background: ${currentTheme.palette.background.paper};
          color: ${currentTheme.palette.text.primary};
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          margin-top: 2px;
          white-space: nowrap;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        ">
          ${number}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

export const ClusterMarkerIcon = (count: number, themeChoice: 'light' | 'dark') => {
  const currentTheme = themeChoice === 'dark' ? darkTheme : theme

  return L.divIcon({
    className: 'cluster-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: ${currentTheme.palette.primary.main};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        border: 3px solid ${currentTheme.palette.background.paper};
        color: ${currentTheme.palette.primary.contrastText};
        font-weight: bold;
        font-size: 14px;
      ">
        ${count}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  })
}
