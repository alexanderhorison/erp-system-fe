// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, Box, CircularProgress } from '@mui/material'
import { returnFormatDate, returnFormatTime } from 'src/helpers/formatDate'
import { fetchDetailReceiveOrder } from 'src/store/apps/receive-order'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'
import Logo from 'src/icons/logo'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`
}))

const PrintReceiveOrder = ({ id }) => {
  // ** Hooks
  const theme = useTheme()
  const dispatch = useDispatch()

  const {
    detailReceiveOrder: data,
    loadingDetailReceiveOrder,
    errorDetailReceiveOrder
  } = useSelector(state => state.receiveOrder)

  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  useEffect(() => {
    if (data?.codeReceipt === id) {
      setTimeout(() => {
        window.print()
      }, 100)
    }
  }, [loadingDetailReceiveOrder])

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailReceiveOrder(id))
      dispatch(fetchCompanyInfo())
    }
  }, [id, dispatch])

  if (data) {
    return (
      <Card>
        <CardContent sx={{ p: [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`] }}>
          <Grid container sx={{ mt: 7 }}>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Logo width={30} />
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
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '12rem' }}>
                  <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h6'>Penerimaan Surat Jalan</Typography>
                        <Typography variant='h6'>{`#${data.codeReceipt}`}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h6'>Surat Jalan</Typography>
                        <Typography variant='h6'>{`#${data.codeDeliveryOrder}`}</Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
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
                <TableCell align='left'>Produk</TableCell>
                <TableCell align='left'>Unit</TableCell>
                <TableCell align='left'>Rak</TableCell>
                <TableCell align='left'>Kuantiti Asal</TableCell>
                <TableCell align='left'>Kuantiti Diterima</TableCell>
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
              {data?.listProducts?.map((data, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{data?.productName}</TableCell>
                    <TableCell>{data?.unitName || ''}</TableCell>
                    <TableCell>{data?.rackName}</TableCell>
                    <TableCell>{data?.quantity}</TableCell>
                    <TableCell>{data?.receiveQuantity}</TableCell>
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
            <Grid item xs={12} sm={12} lg={12} sx={{ mb: 20, mx: 7 }}>
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'center'
                }}
              >
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Dibuat Oleh</Typography>
                <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Diterima Oleh</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={12} sx={{}}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ mb: 2, ml: 5, display: 'flex-column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.creatorBy?.name}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{returnFormatDate(data?.createdAt)}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{returnFormatTime(data?.createdAt)}</Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex-column', alignItems: 'center', textAlign: 'center', mr: 10 }}>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.receiverBy?.name}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{returnFormatDate(data?.receivedAt)}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{returnFormatTime(data?.receivedAt)}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  } else if (errorDetailReceiveOrder) {
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
  } else if (loadingDetailReceiveOrder) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }
}

export default PrintReceiveOrder
