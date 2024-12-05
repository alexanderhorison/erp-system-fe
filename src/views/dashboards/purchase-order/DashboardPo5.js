// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// 5. DashboardPo5: Grafik x = date , y = nominal PO per gudang

export default function DashboardPo5({ query, data }) {
  return (
    <Card
      sx={{ height: '100%' }}
    >
      <CardHeader
        title='Grafik Tren Nominal PO per Gudang Berdasarkan Tanggal'
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
      />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item>
            {data.map((item, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', mb: index !== data.length - 1 ? 4 : undefined }}
              >
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={item.avatarColor}
                  sx={{ mr: 4, width: 100, height: 34 }}
                >
                  {item.totalSuratOutstanding} Surat
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    }}
                  >{item.productName} - {item.unitName}</Typography>
                  {
                    query.warehouseId == 0 && (
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                        }}
                      >{item.warehouseName}</Typography>
                    )
                  }
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                </Box>
              </Box>
            ))}
            {
              data.length == 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%'
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                    }}
                  >Tidak ada data</Typography>
                </Box>
              )
            }
          </Grid>
          <Grid item xs={12} sm={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
