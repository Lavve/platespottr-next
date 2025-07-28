'use client'

import { Button } from '@mui/material'
import { useVibration } from '@/hooks/useVibration'
import type { IVibrateButtonProps } from '@/types/common'

const VibrateButton = ({
  vibrationPattern = 5,
  disableVibration = false,
  onClick,
  ...buttonProps
}: IVibrateButtonProps) => {
  const { handleClick } = useVibration({
    pattern: vibrationPattern,
    enabled: !disableVibration,
  })

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleClick()
    onClick?.(event)
  }

  return <Button onClick={handleButtonClick} {...buttonProps} />
}

export default VibrateButton
