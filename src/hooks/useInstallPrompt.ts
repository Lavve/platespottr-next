import { useEffect, useState } from 'react'
import type { IBeforeInstallPromptEvent } from '@/types/common'

export default function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<IBeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches

    if (isAppInstalled) return

    const handler = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault()
      setPromptEvent(e)
    }

    window.addEventListener('beforeinstallprompt', handler as EventListener)

    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener)
  }, [])

  return promptEvent
}
