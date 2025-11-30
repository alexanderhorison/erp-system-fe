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
import { priceFormat } from 'src/helpers/priceFormatter'
import { MUITableCell } from './PrintSalesOrder'
import React, { forwardRef, useEffect } from 'react'
import { UseAuth } from 'src/hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCompanyInfo } from 'src/store/apps/config/configCompany'
import Logo from 'src/icons/logo'

const GeneratePdfSalesOrder = forwardRef(({ id, data }, ref) => {
  const theme = useTheme()
  const { user } = UseAuth()
  const isAdmin = user?.roleId === 1
  const dispatch = useDispatch()

  const { rawCompany: companyInfo } = useSelector(state => state.companyConfig)

  useEffect(() => {
    dispatch(fetchCompanyInfo())
  }, [dispatch])

  const calculatePageBreaks = (productCount, barterCount) => {
    const maxItemsPerPage = 14 // Maximum items per page
    const maxCombineLimit = 8 // Max combined limit for products + barters
    const maxProductsPerPage = 12 // Max products allowed per page

    const pages = [] // Array of pages
    let remainingProducts = productCount
    let remainingBarters = barterCount

    // Distribute items dynamically, page by page
    while (remainingProducts > 0 || remainingBarters > 0) {
      let productsThisPage = 0
      let bartersThisPage = 0

      if (remainingProducts > 0) {
        // Fill products on this page, respecting limits
        productsThisPage = Math.min(maxProductsPerPage, remainingProducts)
        remainingProducts -= productsThisPage
      }

      // Calculate available space after products
      const spaceLeft = maxItemsPerPage - productsThisPage

      if (spaceLeft > 0 && remainingBarters > 0) {
        // Fill barters, respecting the combined limit
        bartersThisPage = Math.min(Math.min(remainingBarters, spaceLeft), maxCombineLimit - productsThisPage)
        remainingBarters -= bartersThisPage
      }

      // Save the page allocation
      pages.push({ products: productsThisPage, barters: bartersThisPage })
    }

    return pages
  }

  const productPageBreaks = calculatePageBreaks(data?.listProducts?.length || 0, data?.listBarterProducts?.length || 0)

  return (
    <Card id={id} ref={ref} className='page'>
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
              <Box sx={{ display: 'flex-column', alignItems: 'center', mt: 5 }}>
                <Typography sx={{ mb: 2, fontWeight: 900, color: 'text.secondary', textWrap: 'nowrap' }}>
                  {companyInfo?.companyName}
                </Typography>
                <Typography sx={{ mb: 2, fontWeight: 900, color: 'text.secondary' }}>{companyInfo?.address}</Typography>
                <Typography sx={{ mb: 2, fontWeight: 900, color: 'text.secondary' }}>{companyInfo?.city}</Typography>
                <Typography sx={{ fontWeight: 900, color: 'text.secondary' }}>{companyInfo?.phoneNumber}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item sm={3} xs={12}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
              <Table sx={{ maxWidth: '9rem' }}>
                <TableBody sx={{ '& .MuiTableCell-root': { py: `${theme.spacing(1.5)} !important` } }}>
                  <TableRow>
                    <MUITableCell>
                      <Typography variant='h6' sx={{ textWrap: 'nowrap', fontWeight: 900 }}>
                        Sales Order
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
                Tagihan Kepada
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>
                {data?.customer?.name?.toUpperCase() || ''}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>
                {data?.customer?.address?.toUpperCase() || ''}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <TableContainer sx={{ overflow: 'hidden' }}>
        <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 3, fontWeight: 900 }}>
          Barang Sales Order
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
              {isAdmin && <TableCell align='left'>Modal</TableCell>}
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
            {data?.listProducts?.map((data, index) => {
              return (
                <TableRow key={index} className={productPageBreaks?.products?.includes(index) ? 'page-break' : ''}>
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
                  {isAdmin && <TableCell sx={{ whiteSpace: 'nowrap' }}>Rp. {priceFormat(data?.modal)}</TableCell>}
                  <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>
                    Rp. {priceFormat(data?.subTotal)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3, // Adjust gap if needed for spacing
            p: 3,
            mr: 1
          }}
        >
          {/** Empty box*/}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start', // Left alignment
              gap: 2,
              p: 2
            }}
          >
            {/* {data?.listBarterProducts?.length == 0 && (
              <Typography sx={{ fontWeight: 800, color: 'text.secondary', textAlign: 'left', ml: 1 }}>
                Silahkan transfer ke rekening:
              </Typography>
            )} */}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center', // Vertical alignment
              textAlign: 'right',
              gap: 1,
              mr: 2
            }}
          >
            <Typography sx={{ paddingTop: 2, fontWeight: 800, mr: '3rem' }}>Total :</Typography>
            <Typography sx={{ paddingTop: 2, whiteSpace: 'nowrap', fontWeight: 800, mr: 1 }}>Rp.</Typography>
            <Typography sx={{ paddingTop: 2, whiteSpace: 'nowrap', fontWeight: 800 }}>
              {priceFormat(data?.grandTotalCustomer)}
            </Typography>
          </Box>
        </Box>
      </TableContainer>
      {data?.listBarterProducts?.length > 0 && (
        <Box className='no-page-break'>
          <TableContainer sx={{ overflow: 'hidden' }}>
            <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 5, fontWeight: 900 }}>
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
                    <TableRow key={index} className={productPageBreaks?.barters?.includes(index) ? 'page-break' : ''}>
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 3, // Adjust gap if needed for spacing
              p: 3,
              mr: 1
            }}
          >
            {/* Total Box */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start', // Left alignment
                gap: 2,
                p: 2
              }}
            >
              {/* <Typography sx={{ fontWeight: 800, color: 'text.secondary', textAlign: 'left', ml: 1 }}>
                Silahkan transfer ke rekening:
              </Typography> */}
            </Box>

            {/* Grand Total Box */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center', // Vertical alignment
                textAlign: 'right',
                gap: 1,
                mr: 2
              }}
            >
              <Typography sx={{ paddingTop: 2, fontWeight: 800, mr: '3rem' }}>Total :</Typography>
              <Typography sx={{ paddingTop: 2, whiteSpace: 'nowrap', fontWeight: 800, mr: 1 }}>Rp.</Typography>
              <Typography sx={{ paddingTop: 2, whiteSpace: 'nowrap', fontWeight: 800 }}>
                {priceFormat(data?.grandTotalBarter)}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <CardContent sx={{ mt: '-2rem' }}>
        <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Aligned Typography */}
          <Grid item xs={6} lg={6} md={6} sx={{ textAlign: 'left' }}>
            <Box sx={{ display: 'flex-col', alignItems: 'center' }}>
              {/* <Typography sx={{ fontWeight: 800, color: 'text.secondary' }}>{companyInfo?.bank}</Typography> */}
            </Box>
          </Grid>

          {/* Right Aligned Content */}
          <Grid item xs={6} lg={6} md={6} sx={{ textAlign: 'right' }}>
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                textAlign: 'right',
                gap: 1,
                maxWidth: '100%', // Ensure it doesn't go beyond container width
                overflow: 'hidden' // Avoid any overflow from this box
              }}
            >
              <Typography sx={{ color: 'text.secondary', fontWeight: 800, mr: '3rem' }}>Grand Total :</Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 800, mr: 1 }}>Rp.</Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>{priceFormat(data?.grandTotal)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Box
        sx={{
          display: 'flex-col',
          textAlign: 'left',
          gap: 2,
          ml: 4,
          mt: -4
          // maxWidth: '100%', // Ensure it doesn't go beyond container width
          // overflow: 'hidden' // Avoid any overflow from this box
        }}
      >
        <Typography sx={{ fontWeight: 800, color: 'text.secondary' }}>Silahkan transfer ke rekening:</Typography>
        <Typography sx={{ fontWeight: 800, color: 'text.secondary' }}>{companyInfo?.bank}</Typography>
      </Box>

      <div className='no-page-break'>
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
            <Grid item xs={12} sm={12} lg={12} sx={{}}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ mb: 2, ml: 5, display: 'flex-column', alignItems: 'center', textAlign: 'center' }}>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>( ................... )</Typography>
                </Box>
                <Box sx={{ mb: 2, display: 'flex-column', alignItems: 'center', textAlign: 'center', mr: 8 }}>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>{companyInfo?.ownerName}</Typography>
                  <Typography sx={{ color: 'text.secondary', fontWeight: 800 }}>{companyInfo?.ownerTitle}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </div>
    </Card>
  )
})

export default GeneratePdfSalesOrder
