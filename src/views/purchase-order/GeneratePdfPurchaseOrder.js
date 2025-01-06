// ** React Imports
import React, { forwardRef } from 'react'

// ** Next Import

// ** MUI Imports
import Grid from '@mui/material/Grid'
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
import { Card, CardContent, Box } from '@mui/material'
import { companyInfo } from 'src/data/companyInfo'
import { priceFormat } from 'src/helpers/priceFormatter'
import { CompanySvg } from 'src/data/companySvg'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`
}))

const GeneratePdfPurchaseOrder = forwardRef(({ id, data }, ref) => {
  // ** Hooks
  const theme = useTheme()

  const stylePageBreak = (index) => {
    // Add a page break class if the item is the last in a group of 10
    if ((index + 1) % 11 === 0) {
      return 'page-break'; // Class for breaking page
    }
    return ''; // No special class for other items
  };

  return (
    <Card id={id} ref={ref}>
      <CardContent sx={{ p: [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`] }}>
        <Grid container sx={{ mt: 7 }}>
          <Grid item sm={4} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CompanySvg />
                <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 900, lineHeight: '18px', textWrap: 'nowrap' }}>
                  {themeConfig.templateName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex-column', alignItems: 'center', mt: 4 }}>
                <Typography sx={{ mb: 2, fontWeight: 900, color: 'text.secondary', textWrap: 'nowrap' }}>
                  {companyInfo.companyName}
                </Typography>
                <Typography sx={{ mb: 2, fontWeight: 900, color: 'text.secondary' }}>{companyInfo.address}</Typography>
                <Typography sx={{ mb: 2, fontWeight: 900, color: 'text.secondary' }}>{companyInfo.city}</Typography>
                <Typography sx={{ fontWeight: 900, color: 'text.secondary' }}>{companyInfo.phoneNumber}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Table sx={{ maxWidth: '9rem' }}>
                <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant='h6' sx={{ textWrap: 'nowrap', fontWeight: 900 }}>
                        Purchase Order
                      </Typography>
                      <Typography
                        variant='h6'
                        sx={{ textWrap: 'nowrap', fontWeight: 900 }}
                      >{`#${data.code}`}</Typography>
                    </MUITableCell>
                  </TableRow>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant='h6' sx={{ textWrap: 'nowrap', fontWeight: 900 }}>
                        Tgl. Jatuh Tempo
                      </Typography>
                      <Typography
                        variant='h6'
                        sx={{ textWrap: 'nowrap', fontWeight: 900 }}
                      >{`${data.dueDate}`}</Typography>
                    </MUITableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Grid>
          <Grid item sm={4} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', py: 1.5 }}>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 900 }}>
                Vendor
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>
                {data?.vendor?.name?.toUpperCase() || ''}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>
                {data?.vendor?.address?.toUpperCase() || ''}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <TableContainer>
        <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 3, fontWeight: 900 }}>
          Barang Purchase Order
        </Typography>
        <Table>
          <TableHead
            sx={{
              '& .MuiTableCell-root': {
                fontWeight: 800,
                maxWidth: '200px'
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
                fontWeight: 800
              }
            }}
          >
            {data?.listProducts?.map((data, index) => (
              <TableRow key={index} className={stylePageBreak(index)}>
                <TableCell
                  sx={{
                    width: '320px', // Fixed width for all rows and columns
                    maxWidth: '320px', // Prevent exceeding this width
                    overflow: 'hidden', // Hide overflow
                    textOverflow: 'ellipsis', // Show ellipsis for truncated text
                    whiteSpace: 'nowrap'
                  }}
                >
                  {data?.productName}
                </TableCell>
                <TableCell>{data?.unitName || ''}</TableCell>
                <TableCell>{data?.quantity || ''}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Rp. {priceFormat(data?.price)}</TableCell>
                <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                  Rp. {priceFormat(data?.subTotal)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, p: 3, mr: 1 }}>
          <Typography sx={{ paddingTop: 2, mr: 5, fontWeight: 800 }}>Total :</Typography>
          <Typography sx={{ paddingTop: 2, mr: 2, fontWeight: 800, whiteSpace: 'nowrap' }}>
            Rp. {priceFormat(data?.grandTotalVendor)}
          </Typography>
        </Box>
      </TableContainer>

      {data?.listBarterProducts?.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <TableContainer>
            <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 3, fontWeight: 900 }}>
              Barang Barter
            </Typography>
            <Table>
              <TableHead
                sx={{
                  '& .MuiTableCell-root': {
                    fontWeight: 800
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
                    fontWeight: 800
                  }
                }}
              >
                {data?.listBarterProducts?.map((data, index) => {
                  return (
                    <TableRow key={index} className={stylePageBreak(index)}>
                      <TableCell
                        sx={{
                          width: '320px', // Fixed width for all rows and columns
                          maxWidth: '320px', // Prevent exceeding this width
                          overflow: 'hidden', // Hide overflow
                          textOverflow: 'ellipsis', // Show ellipsis for truncated text
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {data?.productName}
                      </TableCell>
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
            <Typography sx={{ paddingTop: 2, mr: 5, fontWeight: 800 }}>Total :</Typography>
            <Typography sx={{ paddingTop: 2, mr: 2, whiteSpace: 'nowrap', fontWeight: 800 }}>
              Rp. {priceFormat(data?.grandTotalBarter)}
            </Typography>
          </Box>
          <Divider sx={{ mt: 8 }} />
        </Box>
      )}

      <CardContent sx={{ p: 5 }}>
        <Grid container sx={{ ml: 'auto', justifyContent: 'flex-end' }}>
          <Grid item xs={12} lg={2} md={2} sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>Grand Total:</Typography>
          </Grid>
          <Grid item xs={12} lg={2} md={2}>
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
              <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>Rp.</Typography>
              <Typography sx={{ color: 'text.secondary', textIndent: 3, fontWeight: 800 }}>
                {priceFormat(data?.grandTotal)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <div className='no-page-break'>
        <Divider sx={{ mt: 5 }} />

        <CardContent sx={{ p: [`${theme.spacing(8)} !important`, `${theme.spacing(6)} !important`] }} >
          <Box sx={{ display: 'flex-col', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 800, color: 'text.secondary', textAlign: 'left' }}>
              {data?.grandTotal < 0
                ? `${companyInfo.ptName} harus melakukan pembayaran sebesar Rp. ${Math.abs(
                  data?.grandTotal
                ).toLocaleString()}`
                : `Vendor ${data?.customer?.name?.toUpperCase() || ''
                } harus melakukan pembayaran sebesar Rp. ${priceFormat(data?.grandTotal)}`}
            </Typography>
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
                <Typography sx={{ fontWeight: 800, color: 'text.secondary' }}>Penerima</Typography>
                <Typography sx={{ fontWeight: 800, color: 'text.secondary' }}>Dengan Hormat,</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ mb: 2, ml: 5, display: 'flex-column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>( ................... )</Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex-column', alignItems: 'center', textAlign: 'center', mr: 8 }}>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>{companyInfo.ownerName}</Typography>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>{companyInfo.ownerTitle}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </div>
    </Card>
  )
})

export default GeneratePdfPurchaseOrder
