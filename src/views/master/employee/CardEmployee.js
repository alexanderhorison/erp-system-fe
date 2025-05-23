import { Grid, Typography, Button } from '@mui/material'
import { Box } from '@mui/system'
import { styled } from '@mui/material/styles'
import CustomChip from 'src/@core/components/mui/chip'
import { useTheme } from '@emotion/react'
import Icon from 'src/@core/components/icon'

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease-in-out',
  alignSelf: 'center',
  '&:hover': {
    transform: 'scale(1.05)'
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4),
    alignSelf: 'center'
  }
}))

export default function CardEmployee({ data, handleEdit }) {
  const theme = useTheme()

  const getRoleColor = role => {
    switch (role) {
      case 'Manager':
        return theme.palette.error.main
      case 'Supervisor':
        return theme.palette.warning.main
      case 'Admin':
        return theme.palette.primary.main
      case 'Kasir':
        return theme.palette.info.main
      case 'Driver':
        return theme.palette.success.main
      default:
        return theme.palette.secondary.main
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        p: 3,
        boxShadow: theme.shadows[2],
        // display: 'flex',
        // flexDirection: 'column',
        // height: '100%',
        [theme.breakpoints.down('md')]: {
          alignItems: 'center',
          textAlign: 'center'
        }
      }}
    >
      <ProfilePicture
        src={
          data?.sex === 'Perempuan'
            ? 'https://cdn-icons-png.flaticon.com/512/201/201634.png'
            : 'https://cdn-icons-png.flaticon.com/512/236/236832.png'
        }
        alt='profile-picture'
      />
      <Typography variant='h5' sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
        {data.nama}
      </Typography>
      <Typography
        variant='body2'
        sx={{
          color: data.role ? getRoleColor(data.role) : theme.palette.text.secondary,
          fontWeight: 500,
          mb: 3
        }}
      >
        {data.role || '-'}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          mt: 4,
          mb: 2
        }}
      >
        <Box
          sx={{
            textAlign: 'center'
          }}
        >
          <Typography variant='caption' sx={{ display: 'block', mb: 1 }}>
            Status Karyawan
          </Typography>
          <CustomChip
            rounded
            size='small'
            skin='light'
            color={data.is_active ? 'success' : 'error'}
            label={data.is_active ? data.status || 'Aktif' : 'Tidak Aktif'}
            sx={{ fontWeight: 500 }}
          />
        </Box>
      </Box>

      <Button
        onClick={handleEdit}
        variant='contained'
        fullWidth
        sx={{
          mt: 4,
          '& svg': { mr: 1 },
          transition: 'all 0.3s',
          '&:hover': { transform: 'translateY(-2px)' }
        }}
      >
        <Icon icon='tabler:edit' fontSize='1.125rem' />
        Edit Karyawan
      </Button>
    </Box>
  )
}
