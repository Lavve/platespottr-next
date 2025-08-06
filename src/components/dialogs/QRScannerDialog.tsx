'use client'

import { CameraAlt } from '@mui/icons-material'
import { Alert, Box, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import jsQR from 'jsqr'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import VibrateButton from '@/components/common/VibrateButton'
import DialogHeader from '@/components/dialogs/DialogHeader'
import { useVibration } from '@/hooks/useVibration'
import { useFriends } from '@/providers/friendsProvider'
import theme from '@/style/theme'

const QRScannerDialog = () => {
  const t = useTranslations()
  const { addFriend } = useFriends()
  const { handleClick } = useVibration()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedName, setScannedName] = useState<string | null>(null)
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const frameIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!dialogOpen) return

    setScannedName(null)
    setScannedCode(null)
    setError(null)

    const startCamera = async () => {
      try {
        setIsScanning(true)

        // Check if dialog is still open before proceeding
        if (!dialogOpen) return

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })

        // Check again after permission is granted
        if (!dialogOpen) {
          stream.getTracks().forEach(track => track.stop())
          return
        }

        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            // Check if dialog is still open before playing
            if (dialogOpen && videoRef.current) {
              videoRef.current.play()
            }
          }
        }

        const scan = () => {
          // Check if dialog is still open
          if (!dialogOpen) return

          const video = videoRef.current
          const canvas = canvasRef.current
          if (!video || !canvas) return

          // Check if video has valid dimensions
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            frameIdRef.current = requestAnimationFrame(scan)
            return
          }

          const context = canvas.getContext('2d')
          if (!context) return

          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          context.drawImage(video, 0, 0, canvas.width, canvas.height)
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

          const qrCode = jsQR(imageData.data, imageData.width, imageData.height)

          if (qrCode) {
            const text = qrCode.data

            try {
              const url = new URL(text)
              const code = url.searchParams.get('add-friend')
              const name = url.searchParams.get('name')

              if (code) {
                setScannedCode(code)
                setScannedName(name)
                if (frameIdRef.current) {
                  cancelAnimationFrame(frameIdRef.current)
                  frameIdRef.current = null
                }
                if (streamRef.current) {
                  streamRef.current.getTracks().forEach(t => t.stop())
                  streamRef.current = null
                }
                setIsScanning(false)
                return
              }
            } catch {
              setError('friends.not_valid_qr_code')
            }
          }

          frameIdRef.current = requestAnimationFrame(scan)
        }

        frameIdRef.current = requestAnimationFrame(scan)
      } catch (err) {
        setError('friends.error_finding_camera')
        console.error('Could not open camera:', err)
        setIsScanning(false)
      }
    }

    startCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
        frameIdRef.current = null
      }
      setIsScanning(false)
    }
  }, [dialogOpen])

  const handleCloseDialog = () => {
    handleClick()
    setIsScanning(false)
    setScannedName(null)
    setScannedCode(null)
    setError(null)
    setDialogOpen(false)
  }

  const handleAddFriend = () => {
    addFriend(scannedCode || '')
    setDialogOpen(false)
  }

  return (
    <>
      <VibrateButton
        variant='contained'
        color='primary'
        size='large'
        fullWidth
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          border: `2px solid ${theme.palette.roadsign.contrastText}`,
        }}
        disabled={isScanning}
        onClick={() => setDialogOpen(true)}
      >
        <CameraAlt />
        {t('friends.scan_qr_code')}
      </VibrateButton>

      {dialogOpen && (
        <Dialog fullWidth maxWidth='sm' open={dialogOpen} onClose={handleCloseDialog}>
          <DialogHeader title={t('friends.scan_qr_code_title')} />
          <DialogContent>
            {error ? (
              <Alert severity='warning'>{t(error)}</Alert>
            ) : (
              <Typography variant='body1'>{t('friends.scan_qr_code_description')}</Typography>
            )}
            {!scannedCode ? (
              <>
                <Box sx={{ width: '100%', aspectRatio: '1', position: 'relative', overflow: 'hidden' }}>
                  <video
                    ref={videoRef}
                    style={{ width: '100%', borderRadius: '8px', aspectRatio: '1', objectFit: 'cover' }}
                    muted
                    playsInline
                    autoPlay
                  />
                  <Image
                    src='/images/lens.svg'
                    width={100}
                    height={100}
                    alt='QR Scanner'
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
                  />
                </Box>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </>
            ) : (
              <>
                <Typography variant='body1' textAlign='center' sx={{ mt: 2 }}>
                  {t.rich('friends.send_friend_request_description', {
                    friendName: scannedName || scannedCode || '',
                    strong: chunks => <strong>{chunks}</strong>,
                  })}
                </Typography>
                <Typography variant='h6' textAlign='center' sx={{ mt: 2 }}>
                  {scannedCode}
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <VibrateButton variant='outlined' color='primary' onClick={handleCloseDialog}>
              {t('common.cancel')}
            </VibrateButton>
            <VibrateButton variant='contained' color='primary' disabled={!scannedCode} onClick={handleAddFriend}>
              {t('friends.send_friend_request')}
            </VibrateButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default QRScannerDialog
