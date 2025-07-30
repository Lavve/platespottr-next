import { Box, Typography } from '@mui/material'
import localFont from 'next/font/local'
import { useEffect, useState } from 'react'

const fontTratex = localFont({
  src: [
    {
      path: '../../assets/fonts/Tratex.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
})
const fontSize = 'clamp(3rem, calc((100vw - 3rem) / 6.5), 5.5rem)'

const AnimatedDigit = ({ digit }: { digit: string }) => {
  const [prevDigit, setPrevDigit] = useState(digit)
  const [nextDigit, setNextDigit] = useState<string | null>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (digit !== prevDigit) {
      console.log('animate1')
      setNextDigit(digit)
      setAnimate(false)

      requestAnimationFrame(() => {
        console.log('animate2')
        setAnimate(true)
      })
    }
  }, [digit, prevDigit])

  const handleTransitionEnd = () => {
    if (nextDigit !== null) {
      console.log('animate3')
      setPrevDigit(nextDigit)
      setNextDigit(null)
      setAnimate(false)
    }
  }

  return (
    <Box
      id={`digit-${digit}-${prevDigit}-${nextDigit}`}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: fontSize,
        minWidth: { xs: '2rem', sm: '2.25rem' },
        display: 'inline-block',
        textAlign: 'center',
      }}
    >
      {/* Sliding container */}
      <Box
        id='sliding-container'
        onTransitionEnd={handleTransitionEnd}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transition: 'transform 3s ease-in-out',
          transform: animate ? `translateY(50%)` : 'translateY(0%)',
        }}
      >
        {/* Next digit */}
        {nextDigit && (
          <Typography
            sx={{
              fontSize,
              fontFamily: fontTratex.style.fontFamily,
              lineHeight: 1,
              color: 'regplate.contrastText',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(255, 255, 255, 1)',
            }}
          >
            {nextDigit || prevDigit}
          </Typography>
        )}

        {/* Current digit */}
        <Typography
          sx={{
            fontSize,
            fontFamily: fontTratex.style.fontFamily,
            lineHeight: 1,
            color: 'regplate.contrastText',
            textAlign: 'center',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(255, 255, 255, 1)',
          }}
        >
          {prevDigit}
        </Typography>
      </Box>
    </Box>
  )
}

export default AnimatedDigit
