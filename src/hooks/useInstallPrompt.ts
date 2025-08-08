import { useEffect, useState } from 'react'
import type { IBeforeInstallPromptEvent } from '@/types/common'

export interface InstallPromptState {
  type: 'pwa' | 'google-play' | 'pwa-to-play' | null
  promptEvent?: IBeforeInstallPromptEvent | null
}

const useInstallPrompt = (): InstallPromptState => {
  const [promptEvent, setPromptEvent] = useState<IBeforeInstallPromptEvent | null>(null)
  const [installType, setInstallType] = useState<'pwa' | 'google-play' | 'pwa-to-play' | null>(null)

  useEffect(() => {
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches
    const isAndroid = /Android/i.test(navigator.userAgent)

    const determineInstallType = () => {
      if (isAppInstalled && isAndroid) {
        setInstallType('pwa-to-play')
      } else if (isAndroid && !isAppInstalled) {
        setInstallType('google-play')
      } else if (!isAppInstalled) {
        setInstallType('pwa')
      }
    }

    determineInstallType()

    const handler = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault()
      setPromptEvent(e)
      setInstallType('pwa')
    }

    window.addEventListener('beforeinstallprompt', handler as EventListener)

    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
  }, [])

  return {
    type: installType,
    promptEvent: promptEvent,
  }
}

export default useInstallPrompt
