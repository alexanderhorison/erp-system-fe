import { Card, Typography, IconButton, Tooltip, Avatar, Divider, Chip } from '@mui/material'
import LiveClock from '../common/LiveClock'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { UseAuth } from 'src/hooks/useAuth'
import swal from 'src/pages/sweetalert'

export default function DetailUserPos({ user, warehouse, setOpenSetting }) {
  const auth = UseAuth()

  const handleLogoutClick = async () => {
    try {
      const result = await swal.fire({
        title: 'Konfirmasi Logout',
        text: 'Apakah Anda yakin ingin keluar dari sistem Point of Sale? Semua data yang belum disimpan akan hilang.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Logout',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        confirmButtonColor: '#6F4E37'
      })

      if (result.isConfirmed) {
        // Show loading/success message
        swal.fire({
          title: 'Logging out...',
          text: 'Mohon tunggu sebentar',
          icon: 'info',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          confirmButtonColor: '#6F4E37'
        })

        // Perform logout after a short delay
        setTimeout(() => {
          auth.logout()
        }, 1000)
      }
    } catch (error) {
      console.error('Error during logout confirmation:', error)
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

  return (
    <Card
      sx={{
        p: { xs: 1.5, md: 2.5 },
        height: { xs: 'auto', md: '6rem' },
        minHeight: { xs: '4rem', md: '6rem' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Section: User Info and Logout */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* User Profile Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          <Avatar
            sx={{
              width: { xs: 24, md: 28 },
              height: { xs: 24, md: 28 },
              bgcolor: 'white',
              color: 'text.primary',
              fontSize: { xs: '0.65rem', md: '0.75rem' },
              fontWeight: 600,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {getUserInitials(user?.name)}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant='subtitle2'
              sx={{
                fontWeight: 600,
                fontSize: '0.8rem',
                lineHeight: 1.2,
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user?.name || 'Unknown User'}
            </Typography>
            <Chip
              label='Cashier'
              size='small'
              sx={{
                height: 14,
                fontSize: '0.6rem',
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                '& .MuiChip-label': { px: 0.8 },
                mt: 0.3
              }}
            />
          </Box>
        </Box>

        {/* Logout Button */}
        <Tooltip title='Logout' placement='left'>
          <IconButton
            onClick={handleLogoutClick}
            sx={{
              color: 'text.secondary',
              bgcolor: 'grey.100',
              width: 28,
              height: 28,
              ml: 1,
              '&:hover': {
                bgcolor: 'error.main',
                color: 'white',
                transform: 'scale(1.1)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
            size='small'
          >
            <Icon icon='tabler:logout' fontSize='0.9rem' />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Middle Section: Warehouse Info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          py: 0.5,
          px: 1,
          borderRadius: 1,
          transition: 'all 0.2s ease'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
          <Icon
            icon={warehouse?.warehouseName ? 'tabler:building-store' : 'tabler:alert-circle'}
            fontSize='0.9rem'
            color={warehouse?.warehouseName ? 'primary' : 'error'}
          />
          <Typography
            variant='body2'
            sx={{
              fontWeight: 500,
              fontSize: '0.7rem',
              color: warehouse?.warehouseName ? 'text.primary' : 'error.main',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {warehouse?.warehouseName || 'Select warehouse'}
          </Typography>
        </Box>
      </Box>

      {/* Bottom Section: Clock */}
      <Box sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left', gap: 1, pl: 1 }}>
        <Icon icon='tabler:clock' fontSize='0.8rem' sx={{ color: 'text.secondary', opacity: 0.8 }} />
        <Typography
          variant='caption'
          sx={{
            fontSize: '0.7rem',
            color: 'text.secondary',
            fontWeight: 500,
            textAlign: 'left'
          }}
        >
          <LiveClock utcOffset={7} />
        </Typography>
      </Box>
    </Card>
  )
}
