'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export const useScreenWakeLock = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    setIsSupported('wakeLock' in navigator)
  }, [])

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) return false

    try {
      const wakeLock = await navigator.wakeLock.request('screen')
      wakeLockRef.current = wakeLock
      setIsActive(true)
      return true
    } catch (error) {
      console.warn('Failed to request wake lock:', error)
      return false
    }
  }, [isSupported])

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release()
        wakeLockRef.current = null
        setIsActive(false)
        return true
      } catch (error) {
        console.warn('Failed to release wake lock:', error)
        return false
      }
    }
    return false
  }, [])

  useEffect(() => {
    return () => {
      if (isActive) {
        releaseWakeLock()
      }
    }
  }, [isActive, releaseWakeLock])

  return {
    isSupported,
    isActive,
    requestWakeLock,
    releaseWakeLock,
  }
}
