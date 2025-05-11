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
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { returnFormatDate, returnFormatTime } from 'src/helpers/formatDate'
import { companyInfo } from 'src/data/companyInfo'
import { Status } from 'src/@core/components/common'
import { priceFormat } from 'src/helpers/priceFormatter'
import { CompanySvg } from 'src/data/companySvg'
import { UseAuth } from 'src/hooks/useAuth'
import { useMemo } from 'react'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const DetailPageSalesOrder = ({ data }) => {
  // ** Hook
  const theme = useTheme()
  const { user } = UseAuth()
  const isAdmin = useMemo(() => user?.roleId === 1, [user])

  if (data) {
    return (
      <Card>
        <CardContent sx={{ p: [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`] }}>
          <Grid container sx={{ mt: 7 }}>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CompanySvg />
                  <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 500, lineHeight: '18px' }}>
                    {themeConfig.templateName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex-column', alignItems: 'center', mt: 5 }}>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>{companyInfo.companyName}</Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>{companyInfo.address}</Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>{companyInfo.city}</Typography>
                  <Typography sx={{ color: `'text.secondary'` }}>{companyInfo.phoneNumber}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '15rem' }}>
                  <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h6'>Sales Order</Typography>
                        <Typography variant='h6'>{`#${data.code}`}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h6'>Tgl. Jatuh Tempo</Typography>
                        <Typography variant='h6'>{`${data.dueDate}`}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Status status={data?.status} />
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
              <div>
                <Typography variant='h6' sx={{ mb: 2 }}>
                  Tagihan Kepada
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.customer?.name?.toUpperCase() || ''}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>{data?.customer?.address?.toUpperCase() || ''}</Typography>
              </div>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ p: [`${theme.spacing(8)} !important`, `${theme.spacing(6)} !important`] }}>
          <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 3 }}>
            Barang Sales Order
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='left'>Gudang</TableCell>
                  <TableCell align='left'>Produk</TableCell>
                  <TableCell align='left'>Kuantiti</TableCell>
                  <TableCell align='left'>Harga</TableCell>
                  {isAdmin && <TableCell align='left'>Modal</TableCell>}
                  <TableCell align='center'>Jumlah</TableCell>
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
                {data?.listProducts?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant='body1'>{item?.warehouseName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant='body1'>{item?.productName}</Typography>
                        <Typography variant='body2' color='textSecondary' sx={{ mt: 0.5 }}>
                          Rack: {item?.rackName} | {item?.unitName}
                        </Typography>
                      </TableCell>
                      <TableCell>{item?.quantity || ''}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>Rp. {priceFormat(item?.price)}</TableCell>
                      {isAdmin && (
                        <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                          Rp. {priceFormat(item?.modal)}
                        </TableCell>
                      )}
                      <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                        Rp. {priceFormat(item?.subTotal)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {data?.listBarterProducts?.length > 0 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, p: 3, mr: 1 }}>
                <Typography sx={{ paddingTop: 2, mr: 5 }}>Total :</Typography>
                <Typography sx={{ paddingTop: 2, mr: 2 }}>Rp. {priceFormat(data?.grandTotalCustomer)}</Typography>
              </Box>

              <Divider sx={{ mt: 6 }} />

              <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 3 }}>
                Barang Barter
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align='left'>Gudang</TableCell>
                      <TableCell align='left'>Produk</TableCell>
                      <TableCell align='left'>Kuantiti</TableCell>
                      <TableCell align='left'>Harga</TableCell>
                      <TableCell align='left'>Modal Baru</TableCell>
                      <TableCell align='center'>Jumlah</TableCell>
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
                    {data?.listBarterProducts?.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant='body1'>{item?.warehouseName}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body1'>{item?.productName}</Typography>
                            <Typography variant='body2' color='textSecondary' sx={{ mt: 0.5 }}>
                              Rack: {item?.rackName || '-'} | {item?.unitName || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>{item?.quantity || ''}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Rp. {priceFormat(item?.price)}</TableCell>
                          <TableCell>{item?.isNewModal ? 'Ya' : 'Tidak'}</TableCell>
                          <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                            Rp. {priceFormat(item?.subTotal)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, p: 3, mr: 1 }}>
                <Typography sx={{ paddingTop: 2, mr: 5 }}>Total :</Typography>
                <Typography sx={{ paddingTop: 2, mr: 2 }}>Rp. {priceFormat(data?.grandTotalBarter)}</Typography>
              </Box>
              <Divider sx={{ mt: 8 }} />
            </>
          )}

          <CardContent sx={{ p: 5 }}>
            <Grid container>
              <Grid item xs={12} sm={8} lg={7} sx={{ order: { sm: 1, xs: 2 }, mb: 4 }}>
                <Box sx={{ display: 'flex-col', alignItems: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>
                    <Typography component='span' sx={{ mr: 1.5, fontWeight: 500, color: 'inherit' }}>
                      CATATAN :
                    </Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} lg={1} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 1, xs: 2 } }}></Grid>
              <Grid
                item
                xs={12}
                sm={12}
                lg={2}
                sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 1, xs: 3 }, ml: 'auto', textAlign: 'right' }}
              >
                <Typography sx={{ color: 'text.secondary', mr: 5 }}>Grand Total:</Typography>
              </Grid>
              <Grid
                item
                xs={8}
                sm={8}
                lg={2}
                sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 1, xs: 2 }, ml: 'auto', textAlign: 'right' }}
              >
                <Typography sx={{ color: 'text.secondary', mr: 1, whiteSpace: 'nowrap' }}>
                  Rp. {priceFormat(data?.grandTotal)}
                </Typography>
              </Grid>
            </Grid>
            <Typography
              sx={{
                color: 'text.secondary',
                mt: 3,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                display: 'block',
                width: '100%'
              }}
            >
              {data?.notes}
            </Typography>
          </CardContent>
        </CardContent>

        <Divider />

        <CardContent sx={{ p: [`${theme.spacing(8)} !important`, `${theme.spacing(6)} !important`] }}>
          <Box sx={{ display: 'flex-col', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary', textAlign: 'left' }}>
              {data?.grandTotal < 0
                ? `${companyInfo.ptName} harus melakukan pembayaran sebesar Rp. ${Math.abs(
                  data?.grandTotal
                ).toLocaleString()}`
                : `Customer ${data?.customer?.name?.toUpperCase() || ''
                } harus melakukan pembayaran sebesar Rp. ${priceFormat(data?.grandTotal)}`}
            </Typography>
          </Box>
        </CardContent>

        <Divider />

        <CardContent sx={{ p: [`${theme.spacing(8)} !important`, `${theme.spacing(6)} !important`] }}>
          <Box sx={{ display: 'flex-col', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary', textAlign: 'left' }}>
              Silahkan transfer ke rekening:
            </Typography>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{companyInfo.bank}</Typography>
          </Box>
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
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>Penerima</Typography>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>Dengan Hormat,</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={12} sx={{}}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ mb: 2, ml: 5, display: 'flex-column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary' }}>( ................... )</Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex-column', alignItems: 'center', textAlign: 'center', mr: 8 }}>
                  <Typography sx={{ color: 'text.secondary' }}>{companyInfo.ownerName}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{companyInfo.ownerTitle}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  } else {
    return null
  }
}

export default DetailPageSalesOrder
