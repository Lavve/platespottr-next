'use client'

import { useEffect } from 'react'

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(async registration => {
          console.info('Service Worker registered with scope:', registration.scope)
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  return null
}

export default ServiceWorkerRegistration
