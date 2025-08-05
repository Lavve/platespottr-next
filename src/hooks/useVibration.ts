'use client'

import { useCallback, useMemo } from 'react'
import { VIBRATE_MAX_MULTIPLYER, VIBRATE_SUBTILE } from '@/constants/app'
import { useSettings } from '@/providers/settingsProvider'
import type { IVibrationOptions } from '@/types/common'
import { vibrate } from '@/utils/vibrate'

export const useVibration = (options: IVibrationOptions = {}) => {
  const { settings } = useSettings()
  const { pattern = VIBRATE_SUBTILE, enabled = settings.vibrate !== 'off' } = options
  const hasVibrate =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'vibrate' in navigator &&
    window.innerWidth <= 830

  const vibes = useMemo(() => {
    if (settings.vibrate === 'max') {
      return Array.isArray(pattern)
        ? pattern.map((p: number, index: number) => (index % 2 === 1 ? p * VIBRATE_MAX_MULTIPLYER : p))
        : pattern * VIBRATE_MAX_MULTIPLYER
    }
    return Array.isArray(pattern) ? pattern : [pattern]
  }, [settings.vibrate, pattern])

  const handleClick = useCallback(() => {
    if (enabled && hasVibrate) {
      vibrate(vibes)
    }
  }, [vibes, enabled, hasVibrate])

  return {
    handleClick,
    vibrate: (customPattern?: number | number[]) => {
      if (enabled) {
        vibrate(customPattern || pattern)
      }
    },
  }
}
