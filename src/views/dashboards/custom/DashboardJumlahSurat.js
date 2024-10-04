// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useMemo } from 'react'
import { fetchDashboardJumlahSurat } from 'src/store/apps/dashboard'
import { Grid } from '@mui/material'
import { useRouter } from 'next/router'

// 6
export default function DashboardJumlahSurat({ query }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const {
    dataDashboardJumlahSurat: data,
    loadingDashboardJumlahSurat: loading,
    errorDashboardJumlahSurat: error
  } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardJumlahSurat({ query }))
  }, [query])

  return (
    <Card
      sx={{ height: '100%' }}
    >
      <CardHeader
        title='Total Surat Terbuat'
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
                  sx={{ mr: 4, width: 34, height: 34 }}
                >
                  {item.value}
                </CustomAvatar>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    ":hover": {
                      cursor: "pointer",
                      color: "blue", fontWeight: "bold"
                    }
                  }}
                  onClick={() => router.push(item.url)}
                >{item.title}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                </Box>
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} sm={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
