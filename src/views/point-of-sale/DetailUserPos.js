import { useEffect, useState } from 'react'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

import Icon from 'src/@core/components/icon'
import { UseAuth } from 'src/hooks/useAuth'
import { confirm } from 'src/helpers/confirm'
import { notifyInfo } from 'src/helpers/notify'
import ShiftTimer from './shift/ShiftTimer'
import EndShiftModal from './shift/EndShiftModal'

// ** Design Tokens
import { colors, shadows, status as statusTokens, stone } from 'src/configs/designTokens'

// ** Time over date, as in the header: "11:20" with "Rabu, 12 Sep 2026" under it.
export function PosClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <Box sx={{ textAlign: 'right', lineHeight: 1.2 }}>
      <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: colors.foreground }}>
        {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')}
      </Typography>
      <Typography sx={{ fontSize: '0.6875rem', color: colors.mutedForeground, whiteSpace: 'nowrap' }}>
        {now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
      </Typography>
    </Box>
  )
}

export default function DetailUserPos({ user, warehouse, setOpenSetting, currentShift, onShiftEnded }) {
  const auth = UseAuth()
  const [showEndShiftModal, setShowEndShiftModal] = useState(false)

  const handleLogoutClick = async () => {
    try {
      const confirmed = await confirm({
        title: 'Konfirmasi Logout',
        description: 'Apakah Anda yakin ingin keluar dari sistem Point of Sale? Semua data yang belum disimpan akan hilang.',
        confirmLabel: 'Ya, Logout',
        cancelLabel: 'Batal',
        confirmIcon: 'tabler:logout'
      })

      if (confirmed) {
        // Show loading/success message
        notifyInfo('Logging out...')

        // Perform logout after a short delay
        setTimeout(() => {
          auth.logout()
        }, 1000)
      }
    } catch (error) {
      console.error('Error during logout confirmation:', error)
    }
  }

  const handleEndShiftClick = () => {
    setShowEndShiftModal(true)
  }

  const handleShiftEnded = () => {
    setShowEndShiftModal(false)
    if (onShiftEnded) {
      onShiftEnded()
    }
  }

  // Get user initials for avatar
  const getUserInitials = name => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const shiftMaster = currentShift?.Master_Shift

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
        {/* Clock */}
        <PosClock />

        {/* Shift (or warehouse, when no shift is active) */}
        {currentShift ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              pl: 4,
              pr: 1,
              height: 40,
              borderRadius: 9999,
              border: `1px solid ${colors.border3}`,
              backgroundColor: colors.background,
              boxShadow: shadows.xs
            }}
          >
            <Box sx={{ lineHeight: 1.2, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.foreground, whiteSpace: 'nowrap' }}>
                {shiftMaster?.name || 'Shift'} ({shiftMaster?.startShift?.substring(0, 5)}-
                {shiftMaster?.endShift?.substring(0, 5)})
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: colors.mutedForeground }}>
                <ShiftTimer currentShift={currentShift} onEndShift={handleEndShiftClick} showOnlyDuration />
              </Typography>
            </Box>
            <Button
              onClick={handleEndShiftClick}
              variant='outlined'
              color='secondary'
              startIcon={<Icon icon='tabler:alarm-off' fontSize='0.875rem' />}
              sx={{
                height: 28,
                minWidth: 0,
                px: 3,
                fontSize: '0.75rem',
                fontWeight: 500,
                lineHeight: 1,
                whiteSpace: 'nowrap',
                color: colors.foreground,
                borderColor: colors.border3,
                backgroundColor: stone[100],
                '&:hover': { borderColor: colors.border3, backgroundColor: stone[200] },
                '& .MuiButton-startIcon': { mr: 1.5, ml: 0 }
              }}
            >
              End Shift
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 4,
              height: 40,
              borderRadius: 9999,
              border: `1px solid ${colors.border3}`,
              color: warehouse?.warehouseName ? colors.foreground : colors.destructive
            }}
          >
            <Icon icon={warehouse?.warehouseName ? 'tabler:building-store' : 'tabler:alert-circle'} fontSize='1rem' />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'inherit', whiteSpace: 'nowrap' }}>
              {warehouse?.warehouseName || 'Select warehouse'}
            </Typography>
          </Box>
        )}

        {/* User */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pl: 1,
            pr: 4,
            height: 40,
            borderRadius: 9999,
            border: `1px solid ${colors.border3}`,
            backgroundColor: stone[50],
            boxShadow: shadows.xs
          }}
        >
          <Avatar
            sx={{
              width: 28,
              height: 28,
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: 'primary.contrastText',
              backgroundColor: 'primary.main'
            }}
          >
            {getUserInitials(user?.name)}
          </Avatar>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.foreground, whiteSpace: 'nowrap' }}>
            {user?.name || 'Unknown User'}{' '}
            <Box component='span' sx={{ fontWeight: 400, color: colors.mutedForeground }}>
              Cashier
            </Box>
          </Typography>
        </Box>

        {/* Logout */}
        <Tooltip title='Logout'>
          <IconButton
            onClick={handleLogoutClick}
            size='small'
            aria-label='Logout'
            sx={{
              width: 40,
              height: 40,
              color: colors.destructive,
              border: `1px solid ${colors.destructive}`,
              '&:hover': { backgroundColor: statusTokens.danger.bg }
            }}
          >
            <Icon icon='tabler:logout' fontSize='1.125rem' />
          </IconButton>
        </Tooltip>
      </Box>

      {/* End Shift Modal */}
      <EndShiftModal
        open={showEndShiftModal}
        onClose={() => setShowEndShiftModal(false)}
        onShiftEnded={handleShiftEnded}
      />
    </>
  )
}
