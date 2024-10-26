// ** React Imports
import { useEffect, useState } from 'react'

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
import { companyInfo } from 'src/data/companyInfo'
import { fetchDetailSalesOrder, sendEmail } from 'src/store/apps/sales-order'
import { priceFormat } from 'src/helpers/priceFormatter'
import { CompanySvg } from 'src/data/companySvg'

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`
}))

const GeneratePdfSalesOrder = ({ id }) => {
  // ** Hooks
  const theme = useTheme()
  const dispatch = useDispatch()
  const [sending, setIsSending] = useState(false)

  const {
    detailSalesOrder: data,
    errorDetailSalesOrder,
    loadingDetailSalesOrder
  } = useSelector(state => state.salesOrder)

  useEffect(() => {
    if (data?.code === id) {
      sendPdf()
    }
  }, [loadingDetailSalesOrder])

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailSalesOrder(id))
    }
  }, [id, dispatch])

  const sendPdf = async () => {
    if (!sending) {
      const element = document.getElementById('sales-order')
      element.style.width = '210mm' // A4 width
      element.style.height = 'auto' // Allow height to auto to fit content
      element.style.overflow = 'visible' // Ensure all content is visible

      const canvas = await html2canvas(element, {
        scale: 2.5, // Higher scale for better quality
        width: element.scrollWidth,
        height: element.scrollHeight,
        useCORS: true, // Enable CORS if loading images from different origins
        allowTaint: true // Allow cross-origin images to be rendered
      })

      const imgData = canvas.toDataURL('image/png', 0.8)
      const pdf = new jsPDF('p', 'mm', 'a4') // A4 format

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth - 30 // Leave some margin (10mm on each side)
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let position = 20 // Start position from top with margin
      const maxHeight = pageHeight - 40 // Leave some margin from bottom

      while (position < imgHeight) {
        const scaledHeight = Math.min(imgHeight - position, maxHeight)
        pdf.addImage(imgData, 'PNG', 15, position, imgWidth, scaledHeight, undefined, 'SLOW')
        position += scaledHeight // Move to the next page with the scaled height
        if (position < imgHeight) pdf.addPage() // Add another page if content overflows
      }

      // Convert PDF to Blob and then to Base64
      const pdfBlob = await pdf.output('blob')
      const formData = new FormData()
      formData.append('pdf', pdfBlob, 'sales-order.pdf')
      const code = id
      formData.append('filename', code)
      formData.append('module', 'Sales Order')
      dispatch(sendEmail(formData))
      setIsSending(true);
    }
  }

  if (data) {
    return (
      <Card id='sales-order'>
        <CardContent sx={{ p: [`${theme.spacing(4)} !important`, `${theme.spacing(4)} !important`] }}>
          <Grid container sx={{ mt: 7 }}>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CompanySvg />
                  <Typography variant='h4' sx={{ ml: 2.5, fontWeight: 500, lineHeight: '18px' }}>
                    {themeConfig.templateName}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex-column', alignItems: 'center', mt: 4 }}>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>{companyInfo.companyName}</Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>{companyInfo.address}</Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>{companyInfo.city}</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{companyInfo.phoneNumber}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '9rem' }}>
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
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider />

        <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(8)} !important`] }}>
          <Grid container>
            <Grid item xs={6} sm={5} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Tagihan Kepada
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{data?.customer?.name.toUpperCase() || ''}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{data?.customer?.address.toUpperCase() || ''}</Typography>
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
                <TableCell align='left'>Kuantiti</TableCell>
                <TableCell align='left'>Harga</TableCell>
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
              {data?.listProducts?.map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data?.productName}</TableCell>
                  <TableCell>{data?.unitName || ''}</TableCell>
                  <TableCell>{data?.quantity || ''}</TableCell>
                  <TableCell>Rp. {priceFormat(data?.price)}</TableCell>
                  <TableCell align='right'>Rp. {priceFormat(data?.subTotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent sx={{ p: 5 }}>
          <Grid container sx={{ ml: 'auto', justifyContent: 'flex-end' }}>
            <Grid item xs={12} lg={2} md={2} sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: 'text.secondary' }}>Grand Total:</Typography>
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
                <Typography sx={{ color: 'text.secondary' }}>Rp.</Typography>
                <Typography sx={{ color: 'text.secondary', textIndent: 3 }}>
                  {priceFormat(data?.grandTotalCustomer)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ mt: 5 }} />

        <CardContent sx={{ p: [`${theme.spacing(8)} !important`, `${theme.spacing(6)} !important`] }}>
          <Box sx={{ display: 'flex-column', alignItems: 'center' }}>
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
            <Grid item xs={12} sm={12} lg={12}>
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
  } else if (errorDetailSalesOrder) {
    return (
      <Box sx={{ p: 5 }}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Alert severity='error'>
              Sales Order: {id} Tidak Ditemukan. Mohon cek list sales order:{' '}
              <Link href='/sales-order'>Sales Order</Link>
            </Alert>
          </Grid>
        </Grid>
      </Box>
    )
  } else if (loadingDetailSalesOrder) {
    return (
      <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
      </Box>
    )
  }
}

export default GeneratePdfSalesOrder
