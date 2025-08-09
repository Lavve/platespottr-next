export const getUserCoordinates = async (on: boolean): Promise<string | null> => {
  if (typeof navigator === 'undefined' || !navigator.geolocation || !on) {
    return null
  }

  try {
    return new Promise<string | null>(resolve => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latlng = `${position.coords.latitude},${position.coords.longitude}`
          resolve(latlng)
        },
        () => {
          resolve(null)
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 60000,
        }
      )
    })
  } catch {
    return null
  }
}
