// ** MUI Imports
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { useTheme } from '@mui/material/styles'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { Card, CardContent, Box } from '@mui/material'
import { companyInfo } from 'src/data/companyInfo'
import { priceFormat } from 'src/helpers/priceFormatter'
import { CompanySvg } from 'src/data/companySvg'
import { MUITableCell } from './PrintSalesOrder'
import React, { forwardRef } from 'react'

const GeneratePdfSalesOrder = forwardRef(({ id, data }, ref) => {
  const theme = useTheme()

  return (
    <Card id={id} ref={ref}>
      <CardContent sx={{ p: [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`] }}>
        <Grid container sx={{ mt: 7 }}>
          <Grid item sm={6} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CompanySvg />
                <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 800, lineHeight: '18px', textWrap: 'nowrap' }}>
                  {themeConfig.templateName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex-column', alignItems: 'center', mt: 5 }}>
                <Typography sx={{ mb: 2, fontWeight: 800, color: 'text.secondary' }}>
                  {companyInfo.companyName}
                </Typography>
                <Typography sx={{ mb: 2, fontWeight: 800, color: 'text.secondary' }}>{companyInfo.address}</Typography>
                <Typography sx={{ mb: 2, fontWeight: 800, color: 'text.secondary' }}>{companyInfo.city}</Typography>
                <Typography sx={{ fontWeight: 800, color: `'text.secondary'` }}>{companyInfo.phoneNumber}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Table sx={{ maxWidth: '9rem' }}>
                <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant='h6' sx={{ textWrap: 'nowrap', fontWeight: 800 }}>
                        Sales Order
                      </Typography>
                      <Typography
                        variant='h6'
                        sx={{ textWrap: 'nowrap', fontWeight: 800 }}
                      >{`#${data.code}`}</Typography>
                    </MUITableCell>
                  </TableRow>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant='h6' sx={{ textWrap: 'nowrap', fontWeight: 800 }}>
                        Tgl. Jatuh Tempo
                      </Typography>
                      <Typography
                        variant='h6'
                        sx={{ textWrap: 'nowrap', fontWeight: 800 }}
                      >{`${data.dueDate}`}</Typography>
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
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 800 }}>
              Tagihan Kepada
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>
              {data?.customer?.name.toUpperCase() || ''}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>
              {data?.customer?.address.toUpperCase() || ''}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}></Grid>
        </Grid>
      </CardContent>

      <Divider />

      <TableContainer>
        <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 3, fontWeight: 800 }}>
          Barang Sales Order
        </Typography>
        <Table>
          <TableHead
            sx={{
              '& .MuiTableCell-root': {
                fontWeight: 700
              }
            }}
          >
            <TableRow>
              <TableCell align='left'>Produk</TableCell>
              <TableCell align='left'>Unit</TableCell>
              <TableCell align='left'>Kuantiti</TableCell>
              <TableCell align='left'>Harga</TableCell>
              <TableCell align='center'>Jumlah</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              '& .MuiTableCell-root': {
                py: `${theme.spacing(2.5)} !important`,
                fontWeight: 700
              }
            }}
          >
            {data?.listProducts?.map((data, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{data?.productName}</TableCell>
                  <TableCell>{data?.unitName || ''}</TableCell>
                  <TableCell>{data?.quantity || ''}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Rp. {priceFormat(data?.price)}</TableCell>
                  <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                    Rp. {priceFormat(data?.subTotal)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, p: 3, mr: 1 }}>
          <Typography sx={{ paddingTop: 2, mr: 5, fontWeight: 700 }}>Total :</Typography>
          <Typography sx={{ paddingTop: 2, mr: 2, fontWeight: 700, whiteSpace: 'nowrap' }}>
            Rp. {priceFormat(data?.grandTotalCustomer)}
          </Typography>
        </Box>
      </TableContainer>
      {data?.listBarterProducts?.length > 0 && (
        <>
          <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 5, fontWeight: 800 }}>
            Barang Barter
          </Typography>
          <TableContainer>
            <Table>
              <TableHead
                sx={{
                  '& .MuiTableCell-root': {
                    fontWeight: 700
                  }
                }}
              >
                <TableRow>
                  <TableCell align='left'>Produk</TableCell>
                  <TableCell align='left'>Unit</TableCell>
                  <TableCell align='left'>Kuantiti</TableCell>
                  <TableCell align='left'>Harga</TableCell>
                  <TableCell align='center'>Jumlah</TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  '& .MuiTableCell-root': {
                    py: `${theme.spacing(2.5)} !important`,
                    fontWeight: 700
                  }
                }}
              >
                {data?.listBarterProducts?.map((data, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{data?.productName}</TableCell>
                      <TableCell>{data?.unitName || ''}</TableCell>
                      <TableCell>{data?.quantity || ''}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>Rp. {priceFormat(data?.price)}</TableCell>
                      <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                        Rp. {priceFormat(data?.subTotal)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, p: 3, mr: 1 }}>
            <Typography sx={{ paddingTop: 2, mr: 5, fontWeight: 700 }}>Total :</Typography>
            <Typography sx={{ paddingTop: 2, mr: 2, whiteSpace: 'nowrap', fontWeight: 700 }}>
              Rp. {priceFormat(data?.grandTotalBarter)}
            </Typography>
          </Box>
          <Divider sx={{ mt: 8 }} />
        </>
      )}

      <CardContent sx={{ p: 5 }}>
        <Grid container sx={{ ml: 'auto', justifyContent: 'flex-end' }}>
          <Grid item xs={3} lg={3} md={2} sx={{ textAlign: 'center' }}></Grid>
          <Grid item xs={3} lg={3} md={2} sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>Grand Total:</Typography>
          </Grid>
          <Grid item xs={2} lg={3} md={2}>
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                textAlign: 'right',
                mr: 1.5
              }}
            >
              <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>Rp.</Typography>
              <Typography sx={{ color: 'text.secondary', textIndent: 3, fontWeight: 700 }}>
                {priceFormat(data?.grandTotal)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider sx={{ mt: 7 }} />

      <CardContent sx={{ p: [`${theme.spacing(8)} !important`, `${theme.spacing(6)} !important`] }}>
        <Box sx={{ display: 'flex-col', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'left' }}>
            {data?.grandTotal < 0
              ? `${companyInfo.ptName} harus melakukan pembayaran sebesar Rp. ${Math.abs(
                  data?.grandTotal
                ).toLocaleString()}`
              : `Customer ${
                  data?.customer?.name?.toUpperCase() || ''
                } harus melakukan pembayaran sebesar Rp. ${priceFormat(data?.grandTotal)}`}
          </Typography>
        </Box>
      </CardContent>

      <Divider />

      <CardContent sx={{ p: [`${theme.spacing(8)} !important`, `${theme.spacing(6)} !important`], mt: 5 }}>
        <Box sx={{ display: 'flex-col', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'left' }}>
            Silahkan transfer ke rekening:
          </Typography>
          <Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>{companyInfo.bank}</Typography>
        </Box>
      </CardContent>

      <Divider />

      <CardContent sx={{ px: [6, 10], pageBreakInside: 'avoid' }}>
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
              <Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>Penerima</Typography>
              <Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>Dengan Hormat,</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} lg={12} sx={{}}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ mb: 2, ml: 5, display: 'flex-column', alignItems: 'center', textAlign: 'center' }}>
                <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>( ................... )</Typography>
              </Box>
              <Box sx={{ mb: 2, display: 'flex-column', alignItems: 'center', textAlign: 'center', mr: 8 }}>
                <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>{companyInfo.ownerName}</Typography>
                <Typography sx={{ color: 'text.secondary', fontWeight: 700 }}>{companyInfo.ownerTitle}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
})

export default GeneratePdfSalesOrder
