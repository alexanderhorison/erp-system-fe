// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
{/* 3. Top 5 Vendor yang total hutang PO nya paling bnyk*/ }

export default function DashboardPo3({ data }) {
  return (
    <Card
      sx={{ height: '100%' }}
    >
      <CardHeader
        title='Top 5 Vendor dengan Total Hutang PO Tertinggi'
        sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }}
      />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item>
            {data.map((item, index) => (
              <Grid
                key={index}
                sx={{ display: 'flex', alignItems: 'center', mb: index !== data.length - 1 ? 4 : undefined }}
              >
                <Box >
                  <CustomAvatar
                    skin='light'
                    variant='rounded'
                    color={item.avatarColor}
                    sx={{ mr: 4, width: 200, height: 40 }}
                  >
                    {priceFormatWIthCurrency(item.totalNominalDebt)}
                  </CustomAvatar>
                </Box>
                {item?.vendorName}
              </Grid>
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
