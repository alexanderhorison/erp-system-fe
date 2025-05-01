import { Button, Card, CardContent, Divider, Grid, Skeleton, Typography, Chip, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import ModalAddMasterEmployee from './ModalAddMasterEmployee'
import { useSelector } from 'react-redux'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { format } from 'date-fns'
import CustomChip from 'src/@core/components/mui/chip'

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

const InfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  '& svg': {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(2),
    fontSize: '1.25rem'
  }
}))

export default function DetailEmployee({ data, loading }) {
  const [openModal, setOpenModal] = useState(false)
  const theme = useTheme()

  const handleEdit = () => {
    setOpenModal(true)
  }

  const formatDate = dateString => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy')
    } catch (error) {
      return '-'
    }
  }

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

  if (loading) {
    return <Skeleton variant='rectangular' sx={{ borderRadius: 1, height: { xs: 300, md: 400 } }} />
  }

  return (
    <Card
      sx={{
        padding: 4,
        transition: 'all 0.3s ease',
        '&:hover': { boxShadow: theme.shadows[10] }
      }}
    >
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                p: 3,
                boxShadow: theme.shadows[2],
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
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
          </Grid>

          <Grid item xs={12} md={8}>
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                p: 3,
                boxShadow: theme.shadows[2],
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Typography variant='h5' sx={{ mb: 2, fontWeight: 600 }}>
                Informasi Karyawan
              </Typography>
              <Divider sx={{ mb: 4 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InfoBox>
                    <Icon icon='tabler:phone' />
                    <Box>
                      <Typography variant='caption' color='text.secondary'>
                        Nomor Telepon
                      </Typography>
                      <Typography variant='body1'>{data.phone || '-'}</Typography>
                    </Box>
                  </InfoBox>
                </Grid>

                <Grid item xs={12}>
                  <InfoBox>
                    <Icon icon='tabler:map-pin' />
                    <Box>
                      <Typography variant='caption' color='text.secondary'>
                        Alamat
                      </Typography>
                      <Typography variant='body1'>{data.address || '-'}</Typography>
                    </Box>
                  </InfoBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InfoBox>
                    <Icon icon='tabler:calendar' />
                    <Box>
                      <Typography variant='caption' color='text.secondary'>
                        Tanggal Lahir
                      </Typography>
                      <Typography variant='body1'>{formatDate(data.dob)}</Typography>
                    </Box>
                  </InfoBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InfoBox>
                    <Icon icon={data.sex === 'Perempuan' ? 'tabler:gender-female' : 'tabler:gender-male'} />
                    <Box>
                      <Typography variant='caption' color='text.secondary'>
                        Jenis Kelamin
                      </Typography>
                      <Typography variant='body1'>{data.sex || '-'}</Typography>
                    </Box>
                  </InfoBox>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Typography variant='h5' sx={{ mb: 3, fontWeight: 600 }}>
                Informasi Keuangan
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InfoBox>
                    <Icon icon='tabler:cash' />
                    <Box>
                      <Typography variant='caption' color='text.secondary'>
                        Gaji
                      </Typography>
                      <Typography variant='body1' sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                        {data.salary ? priceFormatWIthCurrency(data.salary) : '-'}
                      </Typography>
                    </Box>
                  </InfoBox>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <InfoBox>
                    <Icon icon='tabler:star' />
                    <Box>
                      <Typography variant='caption' color='text.secondary'>
                        Bonus
                      </Typography>
                      <Typography variant='body1' sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        {data.bonus ? priceFormatWIthCurrency(data.bonus) : '-'}
                      </Typography>
                    </Box>
                  </InfoBox>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <ModalAddMasterEmployee open={openModal} setOpen={setOpenModal} typeModal={'EDIT'} id={data.id} />
    </Card>
  )
}
