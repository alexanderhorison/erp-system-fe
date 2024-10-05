// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchDashboardBarangHabis } from 'src/store/apps/dashboard'
import LoadingSpinner from 'src/views/common/LoadingSpinner'

export default function DashboardBarangHabis({ query }) {
  const dispatch = useDispatch()

  const {
    dataDashboardBarangHabis: data,
    loadingDashboardBarangHabis: loading,
    errorDashboardBarangHabis: error
  } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardBarangHabis({ query }))
  }, [dispatch, query])

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title='Daftar 5 Barang Habis'
      />
      <CardContent>
        <LoadingSpinner loading={loading} />
        {data.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                '& img': { mr: 4 },
                alignItems: 'center',
                mb: index !== data.length - 1 ? 4.75 : undefined
              }}
            >
              <img width={46} src='https://img.freepik.com/premium-vector/cigarettes-pack-illustration-design-element-flat-icon_645658-280.jpg' alt={item.title} />

              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6' sx={{ fontSize: (theme) => theme.typography.pxToRem(16 - (item.productName.length / 10)) }}>
                    {item.productName}
                  </Typography>
                  <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.disabled' }}>
                    {item.unitName} - {item.rackName}
                  </Typography>
                  {
                    query.warehouseId === 0 && <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.disabled' }}>
                      {item.warehouseName}
                    </Typography>
                  }
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>Stock</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{item.quantity}</Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}
