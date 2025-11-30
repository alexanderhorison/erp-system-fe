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
import { fetchDetailAdjustmentGoodsIn } from 'src/store/apps/adjustment/goods-in'
import { Status } from 'src/@core/components/common'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'
import Logo from 'src/icons/logo'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`
}))

const PrintGoodsIn = ({ id }) => {
  // ** Hooks
  const theme = useTheme()
  const dispatch = useDispatch()

  const {
    detailAdjustmentGoodsIn: data,
    errorDetailAdjustmentGoodsIn,
    loadingDetailAdjustmentGoodsIn
  } = useSelector(state => state.adjustmentGoodsIn)

    const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  useEffect(() => {
    if (data?.code === id) {
      setTimeout(() => {
        window.print()
      }, 200)
    }
  }, [loadingDetailAdjustmentGoodsIn])

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailAdjustmentGoodsIn(id))
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
                <Table sx={{ maxWidth: '9rem' }}>
                  <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h6'>Barang Masuk</Typography>
                        <Typography variant='h6'>{`#${data.code}`}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Status
                          status={data?.status}
                          color={"secondary"}
                        />
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
            <Grid item xs={6} sm={5} sx={{ mb: { lg: 0, xs: 2 } }}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Gudang Tujuan
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{data?.warehouseDestinationName}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{data?.warehouseLocation}</Typography>
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
                <TableCell align='left'>Total</TableCell>
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
              {data?.listProduct?.map((data, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{data?.productName}</TableCell>
                    <TableCell>{data?.unitName || ''}</TableCell>
                    <TableCell>{data?.quantity || ''}</TableCell>
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
                  <Typography sx={{ color: 'text.secondary' }}>{data?.createdBy}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{returnFormatDate(data?.createdAt)}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{returnFormatTime(data?.createdAt)}</Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex-column', alignItems: 'center', textAlign: 'center', mr: 8 }}>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.approvedBy}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{returnFormatDate(data?.approvedAt)}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{returnFormatTime(data?.approvedAt)}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  } else if (errorDetailAdjustmentGoodsIn) {
    return (
      <Box sx={{ p: 5 }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Alert severity='error'>
              Surat Barang Masuk: {id} Tidak Ditemukan. Mohon cek list surat barang masuk:{' '}
              <Link href='/adjustment/goods-in/'>Penyesuaian Barang Masuk</Link>
            </Alert>
          </Grid>
        </Grid>
      </Box>
    )
  } else if (loadingDetailAdjustmentGoodsIn) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }
}

export default PrintGoodsIn
