'use client'

import { IconButton } from '@mui/material'
import { useVibration } from '@/hooks/useVibration'
import type { IVibrateIconButtonProps } from '@/types/common'

const VibrateIconButton = ({
  vibrationPattern = 5,
  disableVibration = false,
  children,
  ...buttonProps
}: IVibrateIconButtonProps) => {
  const { vibrate } = useVibration({
    pattern: vibrationPattern,
    enabled: !disableVibration,
  })

  const handleButtonClick = () => {
    vibrate()
  }

  return (
    <IconButton onClick={handleButtonClick} {...buttonProps}>
      {children}
    </IconButton>
  )
}

export default VibrateIconButton
