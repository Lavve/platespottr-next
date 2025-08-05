import { Box } from '@mui/material'
import localFont from 'next/font/local'
import { memo, useMemo } from 'react'
import { alphabet } from '@/constants/regplate'
import type { IRegPlateCharacterProps } from '@/types/common'

const fontTratex = localFont({
  src: [
    {
      path: '../assets/fonts/Tratex.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
})

const RegPlateCharacter = memo(({ char, type }: IRegPlateCharacterProps) => {
  const charPos = type === 'number' ? Number(char) * 100 : alphabet.indexOf(String(char)) * 100
  const charArray = useMemo(() => {
    if (type === 'number') {
      return Array.from({ length: 10 }, (_, idx) => idx)
    }
    return Array.from({ length: alphabet.length }, (_, idx) => alphabet[idx])
  }, [type])

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: 'clamp(3rem, calc((100vw - 3rem) / 6.5), 5.5rem)',
        fontFamily: fontTratex.style.fontFamily,
        width: '100%',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          left: 0,
          top: `-${charPos}%`,
          transition: 'top 0.23s ease-in-out',
        }}
      >
        {charArray.map((num, idx) => (
          <Box
            key={`${idx}-${num}`}
            sx={{
              fontSize: 'clamp(3rem, calc((100vw - 3rem) / 6.5), 5.5rem)',
              lineHeight: 1,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {num}
          </Box>
        ))}
      </Box>
    </Box>
  )
})

RegPlateCharacter.displayName = 'RegPlateCharacter'

export default RegPlateCharacter
