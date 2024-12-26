// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import {
  Box,
  Card,
  Grid,
  Button,
  Dialog,
  Typography,
  DialogContent,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { chargePos, fetchListPaymentTypePos } from 'src/store/apps/pos'
import { priceFormat } from 'src/helpers/priceFormatter'

import PaymentSuccess from './PaymentSuccess'

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

export default function ModalChargePos({
  open,
  setOpen,
  subTotalPrice,
  listSelectedProduct,
  customer,
  resetAllField,
}) {
  const dispatch = useDispatch()

  const [selectedPayment, setSelectedPayment] = useState(null)

  const [alreadyPayment, setAlreadyPayment] = useState(false)

  const { listPaymentType, loadingListPaymentType } = useSelector(state => state.pos)

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmitCharge = () => {
    let dicount = 0
    let subTotal = 0
    let listSendProduct = []
    listSelectedProduct.forEach(item => {
      subTotal += item.quantity * item.price
      listSendProduct.push({
        warehouseProductId: item.warehouseProductId,
        price: item.price,
        quantity: item.quantity,
        subTotal: item.subTotal,
        notes: item?.notes || "",
        title: item?.title || "",
      })
    })
    let sendData = {
      customerId: customer.id,
      subTotal: subTotal,
      totalDiscount: dicount,
      grandTotal: subTotal - dicount,
      totalPayment: subTotal - dicount,
      notes: '',
      listProduct: listSendProduct,
      paymentTypeId: selectedPayment.id
    }

    dispatch(chargePos({
      data: sendData,
      selectedPayment: selectedPayment,
      subTotalPrice: priceFormat(subTotalPrice()),
      onComplete: () => {
        setAlreadyPayment(true)
      }
    }))
  }

  useEffect(() => {
    dispatch(fetchListPaymentTypePos())
  }, [])

  return (
    <Card>
      <Dialog
        fullWidth
        open={open}
        maxWidth='md'
        scroll='body'
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' }, zoom: 1.2 }}
      >
        <DialogContent
          sx={{
          }}
        >
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          {
            alreadyPayment ? (
              <PaymentSuccess alreadyPayment={alreadyPayment} totalPayment={priceFormat(subTotalPrice())} change={0} setOpen={setOpen} resetAll={resetAllField} />
            ) : (
              <>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant='h4' sx={{}}>
                    Total Harga : Rp.{priceFormat(subTotalPrice())}
                  </Typography>
                </Box>
                <Grid container py={3} spacing={6}>
                  <Grid item xs={6}>
                    <Button fullWidth variant='outlined' onClick={handleClose}>Cancel</Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button fullWidth variant='contained' onClick={handleSubmitCharge} disabled={!selectedPayment}>Charge</Button>
                  </Grid>
                </Grid>
                <Grid container py={10} spacing={3}>
                  <Grid item xs={4} alignContent={'top'}>Pilih Metode Pembayaran</Grid>
                  <Grid item xs={8}>
                    <Grid container spacing={3}>
                      {
                        listPaymentType && listPaymentType.map((item, index) => (
                          <Grid item key={index} xs={3}>
                            <Button
                              fullWidth
                              variant={selectedPayment?.id === item?.id ? 'contained' : 'outlined'}
                              onClick={() => setSelectedPayment(item)}
                              style={{
                                whiteSpace: 'nowrap', // Prevents text from wrapping
                                overflow: 'hidden',  // Ensures text doesn't overflow
                                textOverflow: 'ellipsis', // Adds ellipsis for truncated text
                                fontSize: item?.label.length > 10 ? '0.8rem' : '1rem', // Shrinks font size if label is long
                              }}
                            >
                              {item?.label}
                            </Button>
                          </Grid>
                        ))
                      }
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )
          }
        </DialogContent>
      </Dialog>
    </Card>
  )
}
