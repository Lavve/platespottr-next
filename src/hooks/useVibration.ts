'use client'

import { useCallback, useMemo } from 'react'
import { VIBRATE_MAX_MULTIPLYER, VIBRATE_SUBTILE } from '@/constants/app'
import { useSettings } from '@/providers/settingsProvider'
import type { IVibrationOptions } from '@/types/common'
import { vibrate } from '@/utils/vibrate'

export const useVibration = (options: IVibrationOptions = {}) => {
  const { settings } = useSettings()
  const { pattern = VIBRATE_SUBTILE } = options
  const hasVibrate =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'vibrate' in navigator &&
    window.innerWidth <= 830
  const enabled = settings.vibrate !== 'off' && hasVibrate

  const calculatePattern = useCallback(
    (inputPattern: number | number[]) => {
      if (settings.vibrate === 'off') {
        return 0
      }

      if (settings.vibrate === 'max') {
        return Array.isArray(inputPattern)
          ? inputPattern.map((p: number, index: number) => (index % 2 === 1 ? p * VIBRATE_MAX_MULTIPLYER : p))
          : inputPattern * VIBRATE_MAX_MULTIPLYER
      }

      return Array.isArray(inputPattern) ? inputPattern : [inputPattern]
    },
    [settings.vibrate]
  )

  const vibes = useMemo(() => {
    return calculatePattern(pattern)
  }, [calculatePattern, pattern])

  const handleClick = useCallback(() => {
    if (enabled) {
      vibrate(vibes)
    }
  }, [vibes, enabled])

  return {
    handleClick,
    vibrate: (customPattern?: number | number[]) => {
      if (enabled) {
        const processedPattern = calculatePattern(customPattern || pattern)
        vibrate(processedPattern)
      }
    },
  }
}
