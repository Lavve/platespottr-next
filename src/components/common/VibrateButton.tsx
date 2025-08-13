'use client'

import { Button } from '@mui/material'
import { useVibration } from '@/hooks/useVibration'
import type { IVibrateButtonProps } from '@/types/common'

const VibrateButton = ({ vibrationPattern = 5, disableVibration = false, ...buttonProps }: IVibrateButtonProps) => {
  const { vibrate } = useVibration({
    pattern: vibrationPattern,
    enabled: !disableVibration,
  })

  const handleButtonClick = () => {
    vibrate()
  }

  return <Button onClick={handleButtonClick} {...buttonProps} />
}

export default VibrateButton
