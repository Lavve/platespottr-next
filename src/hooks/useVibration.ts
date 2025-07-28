'use client'

import { useCallback } from 'react'
import { VIBRATE_SUBTILE } from '@/constants/app'
import type { IVibrationOptions } from '@/types/common'
import { vibrate } from '@/utils/vibrate'

export const useVibration = (options: IVibrationOptions = {}) => {
  const { pattern = VIBRATE_SUBTILE, enabled = true } = options
  const hasVibrate =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    'vibrate' in navigator &&
    window.innerWidth <= 830

  const handleClick = useCallback(() => {
    if (enabled && hasVibrate) {
      vibrate(pattern)
    }
  }, [pattern, enabled, hasVibrate])

  return {
    handleClick,
    vibrate: (customPattern?: number | number[]) => {
      if (enabled) {
        vibrate(customPattern || pattern)
      }
    },
  }
}
