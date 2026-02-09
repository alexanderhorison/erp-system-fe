import React, { useEffect, useState } from 'react'
import { Box, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import Icon from 'src/@core/components/icon'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

const ShiftTimer = ({ currentShift, onEndShift, showOnlyDuration = false }) => {
  const [elapsedTime, setElapsedTime] = useState('')
  const [showReminder, setShowReminder] = useState(false)
  const [reminderShown, setReminderShown] = useState(false)

  useEffect(() => {
    dayjs.extend(duration)
    if (!currentShift) return

    const updateTimer = () => {
      const startTime = dayjs(currentShift.createdAt)
      const now = dayjs()
      const diff = dayjs.duration(now.diff(startTime))

      const hours = Math.floor(diff.asHours())
      const minutes = diff.minutes()
      const seconds = diff.seconds()

      setElapsedTime(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      )

      // Check if we need to show reminder (10 minutes before shift ends)
      if (!reminderShown && currentShift.Master_Shift) {
        const shiftEndTime = currentShift.Master_Shift.endShift // HH:mm:ss format
        const todayWithShiftEnd = dayjs().format('YYYY-MM-DD') + ' ' + shiftEndTime
        const endMoment = dayjs(todayWithShiftEnd, 'YYYY-MM-DD HH:mm:ss')
        const minutesUntilEnd = endMoment.diff(now, 'minutes')

        if (minutesUntilEnd <= 10 && minutesUntilEnd > 0) {
          setShowReminder(true)
          setReminderShown(true)
        }
      }
    }

    // Update immediately
    updateTimer()

    // Update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [currentShift, reminderShown])

  const handleCloseReminder = () => {
    setShowReminder(false)
  }

  if (!currentShift) return null

  const formatTime = time => {
    if (!time) return ''
    return time.substring(0, 5)
  }

  return (
    <>
      {showOnlyDuration ? (
        <>{elapsedTime}</>
      ) : (
        <Box display='flex' alignItems='center' gap={2}>
          <Chip
            icon={<Icon icon='mdi:clock-time-four-outline' fontSize={20} />}
            label={currentShift.Master_Shift?.name || 'Shift'}
            color='primary'
            variant='outlined'
          />
          <Box>
            <Typography variant='caption' color='text.secondary' display='block'>
              Waktu Shift: {formatTime(currentShift.Master_Shift?.startShift)} -{' '}
              {formatTime(currentShift.Master_Shift?.endShift)}
            </Typography>
            <Typography variant='body2' fontWeight={600}>
              Durasi: {elapsedTime}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Reminder Modal */}
      <Dialog open={showReminder} onClose={handleCloseReminder} maxWidth='sm' fullWidth>
        <DialogTitle>
          <Box display='flex' alignItems='center' gap={2}>
            <Icon icon='mdi:alarm' fontSize={32} color='warning' />
            <Typography variant='h5'>Pengingat Shift</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Shift Anda akan berakhir dalam waktu kurang dari 10 menit. Silakan persiapkan untuk mengakhiri shift.
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
            Shift: {currentShift.Master_Shift?.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Berakhir: {formatTime(currentShift.Master_Shift?.endShift)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReminder} variant='outlined'>
            Mengerti
          </Button>
          <Button onClick={onEndShift} variant='contained' color='primary'>
            Akhiri Shift Sekarang
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ShiftTimer
