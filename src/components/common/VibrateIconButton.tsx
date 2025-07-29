'use client'

import { IconButton } from '@mui/material'
import { useVibration } from '@/hooks/useVibration'
import type { IVibrateIconButtonProps } from '@/types/common'

const VibrateIconButton = ({
  vibrationPattern = 5,
  disableVibration = false,
  children,
  onClick,
  ...buttonProps
}: IVibrateIconButtonProps) => {
  const { handleClick } = useVibration({
    pattern: vibrationPattern,
    enabled: !disableVibration,
  })

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleClick()
    onClick?.(event)
  }

  return (
    <IconButton onClick={handleButtonClick} {...buttonProps}>
      {children}
    </IconButton>
  )
}

export default VibrateIconButton
