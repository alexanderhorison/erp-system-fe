// ** React Imports
import React, { forwardRef, useEffect } from 'react'

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
import { priceFormat } from 'src/helpers/priceFormatter'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'
import Logo from 'src/icons/logo'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`
}))

const GeneratePdfPrintOfSale = forwardRef(({ id, data }, ref) => {
  // ** Hooks
  const theme = useTheme()
  const dispatch = useDispatch()

  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  useEffect(() => {
    dispatch(fetchCompanyInfo())
  }, [dispatch])

  return (
    <Card id={id} ref={ref}>
      <CardContent sx={{ p: [`${theme.spacing(4)} !important`, `${theme.spacing(6)} !important`] }}>
        <Grid container sx={{ mt: 7 }}>
          <Grid item sm={5} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Logo width={30} />
                <Typography variant='h5' sx={{ ml: 2.5, fontWeight: 900, lineHeight: '18px', textWrap: 'nowrap' }}>
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
          <Grid item sm={3} xs={12} sx={{ ml: '1rem' }}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Table sx={{ maxWidth: '9rem' }}>
                <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant='h6' sx={{ textWrap: 'nowrap', fontWeight: 900 }}>
                        Point Of Sale
                      </Typography>
                      <Typography
                        variant='h6'
                        sx={{ textWrap: 'nowrap', fontWeight: 900 }}
                      >{`#${data.code}`}</Typography>
                    </MUITableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Grid>
          <Grid item sm={3} xs={12} sx={{ ml: '1rem' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', py: 1.5 }}>
              {data?.customer?.name && (
                <>
                  <Typography variant='h6' sx={{ mb: 2, fontWeight: 900 }}>
                    Customer
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>
                    {data?.customer?.name?.toUpperCase() || ''}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>
                    {data?.customer?.address?.toUpperCase() || ''}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <TableContainer sx={{ overflow: 'hidden' }}>
        <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 3, fontWeight: 900 }}>
          Barang Sale
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
              <TableRow key={index}>
                <TableCell
                  sx={{
                    width: '320px', // Fixed width for all rows and columns
                    maxWidth: '320px', // Prevent exceeding this width
                    overflow: 'hidden', // Hide overflow
                    textOverflow: 'ellipsis', // Show ellipsis for truncated text
                    whiteSpace: 'nowrap'
                  }}
                >
                  {data?.productName ? data?.productName : data?.title}
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
      </TableContainer>

      <CardContent>
        <Grid container sx={{ justifyContent: 'space-between', alignItems: 'normal' }}>
          {/* Left Aligned Content */}

          <Grid item xs={6} lg={6} md={6} sx={{ textAlign: 'left' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1,
                maxWidth: '100%',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 1,
                  width: '100%',
                  maxWidth: '300px'
                }}
              >
                <Typography
                  sx={{ color: 'text.secondary', whiteSpace: 'nowrap', fontWeight: 800, flex: '1 1 auto', mr: '1rem' }}
                >
                  Sudah Dibayar Sejumlah
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>Rp.</Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 800,
                    textAlign: 'right',
                    flexBasis: '80px'
                  }}
                >
                  {priceFormat(data?.totalPayment || 0)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Aligned Content */}
          <Grid item xs={6} lg={6} md={6} sx={{ textAlign: 'right' }}>
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 1,
                maxWidth: '100%',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 1,
                  width: '100%', // Ensure alignment across the items
                  maxWidth: '300px' // Optional: Adjust this to fit your layout
                }}
              >
                <Typography sx={{ color: 'text.secondary', fontWeight: 800, flex: '1 1 auto', mr: '1rem' }}>
                  Total :
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>Rp.</Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 800,
                    textAlign: 'right',
                    flexBasis: '80px' // Ensure consistent space for numbers
                  }}
                >
                  {priceFormat(data?.subTotal || 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 1,
                  width: '100%', // Ensure alignment across the items
                  maxWidth: '300px' // Optional: Adjust this to fit your layout
                }}
              >
                <Typography sx={{ color: 'text.secondary', fontWeight: 800, flex: '1 1 auto', mr: '1rem' }}>
                  Total Discount :
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>Rp.</Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 800,
                    textAlign: 'right',
                    flexBasis: '80px' // Ensure consistent space for numbers
                  }}
                >
                  {priceFormat(data?.totalDiscount || 0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 1,
                  width: '100%',
                  maxWidth: '300px'
                }}
              >
                <Typography sx={{ color: 'text.secondary', fontWeight: 800, flex: '1 1 auto', mr: '1rem' }}>
                  Grand Total :
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>Rp.</Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 800,
                    textAlign: 'right',
                    flexBasis: '80px' // Match width with Total Discount for alignment
                  }}
                >
                  {priceFormat(data?.grandTotal)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <div className='no-page-break'>
        <CardContent sx={{ px: [6, 10], pageBreakInside: 'avoid' }}>
          <Grid container>
            <Grid item xs={12} sm={12} lg={12} sx={{ mb: 20, mx: 7 }}>
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  textAlign: 'center'
                }}
              >
                <Typography sx={{ fontWeight: 800, color: 'text.secondary' }}>Dengan Hormat,</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Box sx={{ mb: 2, ml: 5, display: 'flex-column', alignItems: 'center', textAlign: 'center' }}></Box>
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

export default GeneratePdfPrintOfSale
