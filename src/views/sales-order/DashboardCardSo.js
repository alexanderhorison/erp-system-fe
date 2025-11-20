import { Grid, Card, CardContent, Typography, Box } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'

const DashboardCardSo = ({ dataDashboardCountSo, loadingDashboardCountSo }) => {
  return (
    <Grid container spacing={4}>
      {/* Card Lunas */}
      <Grid item xs={12} md={6}>
        <Card sx={{ backgroundColor: 'rgba(76, 175, 80, 0.08)' }}>
          <CardContent sx={{ gap: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant='h5' sx={{ mb: 0.5 }}>
                {loadingDashboardCountSo ? '...' : dataDashboardCountSo.countPaid || 0}
              </Typography>
              <Typography variant='body2'>SO Lunas</Typography>
            </Box>
            <CustomAvatar skin='light' color='success' sx={{ width: 42, height: 42 }}>
              <Icon icon='tabler:circle-check' fontSize='1.625rem' />
            </CustomAvatar>
          </CardContent>
        </Card>
      </Grid>

      {/* Card Belum Lunas */}
      <Grid item xs={12} md={6}>
        <Card sx={{ backgroundColor: 'rgba(244, 67, 54, 0.08)' }}>
          <CardContent sx={{ gap: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant='h5' sx={{ mb: 0.5 }}>
                {loadingDashboardCountSo ? '...' : dataDashboardCountSo.countDebt || 0}
              </Typography>
              <Typography variant='body2'>SO Belum Lunas</Typography>
            </Box>
            <CustomAvatar skin='light' color='error' sx={{ width: 42, height: 42 }}>
              <Icon icon='tabler:clock-hour-4' fontSize='1.625rem' />
            </CustomAvatar>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default DashboardCardSo
