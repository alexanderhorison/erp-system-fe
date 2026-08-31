import { useTheme } from '@emotion/react'
import { Divider, Grid, Typography, Paper } from '@mui/material'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { styled } from '@mui/material/styles'
import { format } from 'date-fns'

const InfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[0],
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[2]
  },
  '& svg': {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(2),
    fontSize: '1.5rem'
  }
}))

export default function EmployeeInformation({ data }) {
  const theme = useTheme()
  const formatDate = dateString => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'dd/MM/yyyy')
    } catch (error) {
      return '-'
    }
  }
  return (
    <Grid item xs={12} md={12}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography
          variant='h5'
          color='text.secondary'
          sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}
        >
          Informasi Pribadi
        </Typography>

        <Grid container spacing={0}>
          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
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

        <Typography variant='h5' color='text.secondary' sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Informasi Keuangan
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <InfoBox>
              <Icon icon='tabler:cash' />
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Gaji
                </Typography>
                <Typography variant='body1' sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  {data.salary ? priceFormatWIthCurrency(data.salary) : '-'}
                </Typography>
              </Box>
            </InfoBox>
          </Grid>

          <Grid item xs={12} sm={4}>
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

          <Grid item xs={12} sm={4}>
            <InfoBox>
              <Icon icon='tabler:receipt-2' />
              <Box>
                <Typography variant='caption' color='text.secondary'>
                  Kasbon
                </Typography>
                <Typography variant='body1' sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  {data.debt ? priceFormatWIthCurrency(data.debt) : '-'}
                </Typography>
              </Box>
            </InfoBox>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}
