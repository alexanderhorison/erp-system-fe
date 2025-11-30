// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { returnFormatDate, returnFormatTime } from 'src/helpers/formatDate'
import IconTjahayaBerkatAbadi from '../common/iconTjahayaBerkatAbadi'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchDetailReceiptOrderOutstanding } from 'src/store/apps/receipt-order-outstanding'
import { useTheme } from '@mui/system'
import { Alert, CircularProgress } from '@mui/material'
import HeaderReceiptOrderOutstanding from './HeaderReceiptOrderOutstanding'
import Link from 'next/link'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'

export default function PrintReceiptOrderOutstanding({ code }) {
  // ** Hook
  const theme = useTheme()
  const dispatch = useDispatch()

  const {
    detail: data,
    errorDetail,
    loadingDetail
  } = useSelector(state => state.deliveryOrderReceiptOutstanding)
  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  useEffect(() => {
    if (data?.code === code) {
      setTimeout(() => {
        window.print()
      }, 200)
    }
  }, [loadingDetail])

  useEffect(() => {
    if (code) {
      dispatch(fetchDetailReceiptOrderOutstanding({ code }))
      dispatch(fetchCompanyInfo())
    }
  }, [code, dispatch])

  // return null
  if (loadingDetail) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }

  if (errorDetail) {
    return (
      <Box sx={{ p: 5 }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Alert severity='error'>
              Surat Jalan: {id} Tidak Ditemukan. Mohon cek list penerimaan surat jalan:{' '}
              <Link href='/delivery-order-receive'>Penerimaan Surat Jalan</Link>
            </Alert>
          </Grid>
        </Grid>
      </Box>
    )
  }

  if (data) {
    return (
      <Card sx={{ boxShadow: 0 }}>
        <CardContent sx={{ p: [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`] }}>
          <Grid container sx={{ mt: 7 }}>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconTjahayaBerkatAbadi />
                  <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 500, lineHeight: '18px' }}>
                    {themeConfig.templateName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex-column', alignItems: 'center', mt: 5 }}>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>{companyInfo?.companyName}</Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>{companyInfo?.address}</Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>{companyInfo?.city}</Typography>
                  <Typography sx={{ color: `'text.secondary'` }}>{companyInfo?.phoneNumber}</Typography>
                </Box>
              </Box>
            </Grid>
            <HeaderReceiptOrderOutstanding data={data} />
          </Grid>
        </CardContent>
        <Divider />
        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
          <Grid container>
            <Grid item xs={6} sm={5} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Gudang Asal
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{data?.warehouseOrigin?.name}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{data?.warehouseOrigin?.location}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
              <div>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Gudang Tujuan
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.warehouseDestination?.name}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.warehouseDestination?.location}</Typography>
              </div>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={"30%"} align='left'>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='body2'>Produk & Rak</Typography>
                  </Box>
                </TableCell>
                <TableCell width={"16%"} align='left'>Kuantiti Asal</TableCell>
                <TableCell width={"16%"} align='left'>Kuantiti Diterima</TableCell>
                <TableCell width={"16%"} align='left'>Kuantiti Outstanding</TableCell>
                <TableCell width={"16%"} align='left'>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& .MuiTableCell-root': {
                  py: `${theme.spacing(2.5)} !important`,
                  fontSize: theme.typography.body1.fontSize
                }
              }}
            >
              {data?.productOutstandings?.map((data, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='body2'>{data?.productName} - {data?.unitName || ''}</Typography>
                        <Typography variant='body2'>{data?.rackName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{data?.quantityFrom}</TableCell>
                    <TableCell>{data?.quantityReceived}</TableCell>
                    <TableCell>{data?.quantityOutstanding}</TableCell>
                    <TableCell>{data?.status}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent sx={{ p: [`${theme.spacing(8)} !important`, `${theme.spacing(6)} !important`] }}>
          <Grid container>
            <Grid item xs={12} sm={9} lg={9} sx={{ order: { sm: 1, xs: 2 }, mb: 4 }}>
              <Box sx={{ mb: 2, display: 'flex-col', alignItems: 'center' }}>
                <Typography sx={{ color: 'text.secondary' }}>
                  <Typography component='span' sx={{ mr: 1.5, fontWeight: 500, color: 'inherit' }}>
                    CATATAN :
                  </Typography>
                </Typography>
                <Typography sx={{ color: 'text.secondary', mt: 3 }}>{data?.notes}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ px: [6, 10] }}>
          <Grid container>
            <Grid item xs={12} sm={12} lg={12} sx={{ mb: 20, mx: 4 }}>
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'center'
                }}
              >
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>Dibuat Oleh</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>Diselesaikan Oleh</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={12} sx={{}}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ mb: 2, ml: 2, display: 'flex-column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.creatorBy?.name}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{returnFormatDate(data?.createdAt)}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{returnFormatTime(data?.createdAt)}</Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex-column', alignItems: 'center', textAlign: 'center', mr: 8 }}>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.approverBy?.name}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{returnFormatDate(data?.approvedAt)}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{returnFormatTime(data?.approvedAt)}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card >
    )
  } else {
    return null
  }
}
