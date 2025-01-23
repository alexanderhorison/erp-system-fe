import React from 'react'
import { Grid, Typography, Divider, Card, Alert, CircularProgress, Dialog, DialogContent } from '@mui/material'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Box } from '@mui/system'
import { priceFormat, priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { CustomCloseButton } from 'src/views/pages/dialog-examples/DialogEditUserInfo'
import Icon from 'src/@core/components/icon'
import { Status } from 'src/@core/components/common'

export default function ModalViewTransaction({ open, setOpen }) {
  const { detailPointOfSale: data, errorDetailPointOfSale, loadingDetailPointOfSale } = useSelector(state => state.pos)
  console.log(data)

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={() => setOpen(false)}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            height: '85vh',
            overflow: 'auto'
          }}
        >
          <CustomCloseButton onClick={() => setOpen(false)}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          {loadingDetailPointOfSale ? (
            <Box sx={{ mt: 11, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Loading...</Typography>
            </Box>
          ) : errorDetailPointOfSale ? (
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Alert severity='error'>
                  Point of sale: {data?.code || ''} Tidak Ditemukan. Mohon cek list point of sale:{' '}
                  <Link href='/point-of-sale'>Point of Sale</Link>
                </Alert>
              </Grid>
            </Grid>
          ) : (
            <>
              <Typography variant='h4' gutterBottom>
                Transaction Details
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    POS Code
                  </Typography>
                  <Typography variant='body1'>{data.code}</Typography>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Warehouse Name:
                  </Typography>
                  <Typography variant='body1'>{data?.warehouseName}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Status
                  </Typography>
                  <Status status={data.status} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Cashier
                  </Typography>
                  <Typography variant='body1'>Michael Santoso</Typography>
                </Grid>

                <Divider style={{ width: '100%', margin: '20px 0' }} />

                <Grid item xs={12}>
                  <Typography variant='h6' gutterBottom>
                    Customer Information
                  </Typography>
                  {!data?.customer?.name ? (
                    <Typography variant='body2' color='textSecondary'>
                      No customer details available.
                    </Typography>
                  ) : (
                    <Typography variant='body1'>{JSON.stringify(customer)}</Typography>
                  )}
                </Grid>

                <Divider style={{ width: '100%', margin: '20px 0' }} />

                <Grid item xs={12}>
                  <Typography variant='h6' gutterBottom>
                    Products
                  </Typography>
                  {data?.listProducts.map((product, index) => (
                    <Grid container spacing={1} key={product.id} style={{ marginBottom: '10px' }}>
                      <Grid item xs={6}>
                        <Typography variant='subtitle1'>Product Name:</Typography>
                        <Typography variant='body1'>
                          {product?.productName ? product?.productName : product?.title}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant='subtitle1'>Quantity:</Typography>
                        <Typography variant='body1'>{product?.quantity}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant='subtitle1'>Price:</Typography>
                        <Typography variant='body1'>Rp {priceFormat(product?.price)}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant='subtitle1'>Subtotal:</Typography>
                        <Typography variant='body1'>Rp {priceFormat(product?.subTotal)}</Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>

                <Divider style={{ width: '100%', margin: '20px 0' }} />

                <Grid item xs={12}>
                  <Typography variant='h6' gutterBottom>
                    Summary
                  </Typography>
                  <Grid container>
                    {/* Left Column */}
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='subtitle1' sx={{ mr: 1 }}>
                          Total Items:
                        </Typography>
                        <Typography variant='body1'>{data?.totalQuantity}</Typography>
                      </Box>
                      {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='subtitle1' sx={{ mr: 1 }}>
                          Payment Type
                        </Typography>
                        <Typography variant='body1'>{data?.totalQuantity}</Typography>
                      </Box> */}
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mr: '2rem' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant='subtitle1'>Sub Total:</Typography>
                          <Typography variant='body1'>{priceFormatWIthCurrency(data?.subTotal)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant='subtitle1'>Discount:</Typography>
                          <Typography variant='body1'>{priceFormatWIthCurrency(data?.totalDiscount)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant='subtitle1'>Total Price:</Typography>
                          <Typography variant='body1'>{priceFormatWIthCurrency(data?.grandTotal)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant='subtitle1'>Total Payment:</Typography>
                          <Typography variant='body1'>{priceFormatWIthCurrency(data?.totalPayment)}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider style={{ width: '100%', margin: '20px 0' }} />

                <Grid item xs={12}>
                  <Grid item xs={6}>
                    <Typography variant='subtitle1'>Notes</Typography>
                    <Typography variant='body1'>{data?.notes}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
