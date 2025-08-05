import { Box, TextField } from '@mui/material'
import { useCallback, useRef, useState } from 'react'

const PinField = ({ disabled, onChange }: { disabled: boolean; onChange: (pin: string) => void }) => {
  const [pinDigits, setPinDigits] = useState(['', '', '', ''])
  const pinRefs = useRef<(HTMLInputElement | null)[]>([])

  const handlePinKeyDown = useCallback(
    (index: number, event: React.KeyboardEvent) => {
      // Handle backspace to go to previous field
      if (event.key === 'Backspace' && !pinDigits[index] && index > 0) {
        pinRefs.current[index - 1]?.focus()
      }
    },
    [pinDigits]
  )

  const handlePinChange = useCallback(
    (index: number, value: string) => {
      // Only allow single digits
      if (value.length > 1) {
        value = value.slice(-1)
      }

      // Only allow numbers
      if (!/^\d*$/.test(value)) {
        return
      }

      const newPinDigits = [...pinDigits]
      newPinDigits[index] = value
      setPinDigits(newPinDigits)

      // Auto-advance to next field if a digit was entered
      if (value && index < 3) {
        pinRefs.current[index + 1]?.focus()
      } else if (!value && index > 0) {
        pinRefs.current[index - 1]?.focus()
      }

      if (newPinDigits.every(digit => digit !== '')) {
        onChange(newPinDigits.join(''))
      }
    },
    [pinDigits, onChange]
  )

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
      {pinDigits.map((digit, idx) => (
        <TextField
          key={`${idx}-${digit}`}
          inputRef={el => {
            pinRefs.current[idx] = el
          }}
          type='password'
          value={digit}
          onChange={e => handlePinChange(idx, e.target.value)}
          onKeyDown={e => handlePinKeyDown(idx, e)}
          disabled={disabled}
          slotProps={{
            htmlInput: {
              maxLength: 1,
              pattern: '[0-9]*',
              inputMode: 'numeric',
              autoComplete: 'off',
            },
          }}
          sx={{
            width: '60px',
            '& .MuiInputBase-input': {
              textAlign: 'center',
              fontSize: '1.5rem',
              lineHeight: '1',
              fontWeight: 'bold',
              padding: '0.75rem',
            },
          }}
        />
      ))}
    </Box>
  )
}

export default PinField
