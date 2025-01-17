// ** React Imports
import { useEffect, useState } from 'react'
import * as yup from 'yup'
import React from 'react';
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
  CircularProgress,
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
import FormInputPricePos from '../common/FormPos/FormInputPricePos';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomPaymentTypePos from './CustomPaymentTypePos';

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

const AmountButton = ({ subTotalPrice, selectAmount }) => {
  // Fungsi untuk mengecek apakah subtotal sudah genap dengan pecahan 50.000 atau 100.000
  const isExactMultipleOfLargeDenomination = (subTotalPrice) => {
    return (
      subTotalPrice % 50000 === 0 || subTotalPrice % 100000 === 0
    );
  };

  const showButton2And3 = !isExactMultipleOfLargeDenomination(subTotalPrice);

  // Fungsi untuk menghitung tombol kedua (dibulatkan sesuai aturan pecahan)
  const calculateButton2Value = (subTotalPrice) => {
    // Jika subTotalPrice di bawah 500.000, gunakan pecahan 5.000 - 20.000
    if (subTotalPrice <= 500000) {
      if (subTotalPrice <= 20000) return 20000; // Jika nilai terlalu kecil, gunakan 20.000
      return Math.ceil(subTotalPrice / 5000) * 5000; // Dibulatkan ke atas kelipatan 5000
    } else {
      // Jika di atas 500.000, gunakan pecahan 10.000 - 50.000
      return Math.ceil(subTotalPrice / 10000) * 10000; // Dibulatkan ke atas kelipatan 10000
    }
  };

  // Fungsi untuk menghitung tombol ketiga (dibulatkan ke angka besar berikutnya)
  const calculateButton3Value = (subTotalPrice) => {
    // Jika subTotalPrice di bawah 500.000, gunakan pecahan 10.000 - 50.000
    if (subTotalPrice <= 500000) {
      return Math.ceil(subTotalPrice / 10000) * 10000; // Dibulatkan ke atas kelipatan 10000
    } else {
      // Jika di atas 500.000, gunakan pecahan 50.000 - 100.000
      return Math.ceil(subTotalPrice / 50000) * 50000; // Dibulatkan ke atas kelipatan 50000
    }
  };

  // Hitung nilai untuk setiap tombol
  const buttonValues = [
    subTotalPrice, // Nilai asli
    showButton2And3 ? calculateButton2Value(subTotalPrice) : null, // Nilai untuk tombol 2 (kembalian kecil)
    showButton2And3 ? calculateButton3Value(subTotalPrice) : null, // Nilai untuk tombol 3 (nilai besar berikutnya)
  ];

  return (
    <Grid container py={3} spacing={3}>
      {buttonValues.map(
        (value, index) =>
          value !== null && ( // Hanya tampilkan tombol jika nilai tidak null
            <Grid item xs={4} key={index}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => selectAmount(value)}
              >
                {value.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
              </Button>
            </Grid>
          )
      )}
    </Grid>
  );
};

export default function ModalChargePos({
  open,
  setOpen,
  subTotalPrice,
  listSelectedProduct,
  customer,
  resetAllField,
  warehouse,
}) {
  const dispatch = useDispatch()

  const [selectedPayment, setSelectedPayment] = useState(null)

  const [alreadyPayment, setAlreadyPayment] = useState(false)

  const [dataSuccessPayment, setDataSuccessPayment] = useState({})

  const { listPaymentType, loadingListPaymentType } = useSelector(state => state.pos)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    amount: yup.number().min(1, 'Nominal harus diisi').required('Harga harus diisi'),
  })

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      amount: 0,
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    if (alreadyPayment) {
      resetAllField()
    }
    setOpen(false)
  }

  const handleSubmitCharge = () => {
    let dicount = 0
    let subTotal = 0
    let listSendProduct = []
    const totalPayment = getValues('amount')
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
      totalPayment: totalPayment - dicount,
      warehouseId: warehouse?.warehouseId,
      notes: '',
      listProduct: listSendProduct,
      paymentTypeId: selectedPayment.id
    }

    dispatch(chargePos({
      data: sendData,
      selectedPayment: selectedPayment,
      subTotalPrice: priceFormat(totalPayment),
      onComplete: (data) => {
        setAlreadyPayment(true)
        setDataSuccessPayment(data)
      }
    }))
  }

  useEffect(() => {
    if (listPaymentType.length === 0) {
      dispatch(fetchListPaymentTypePos())
    }
  }, [])

  const selectAmount = (value) => {
    setValue('amount', value)
  }

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
              <PaymentSuccess alreadyPayment={alreadyPayment} totalPayment={priceFormat(getValues('amount'))} totalAmount={priceFormat(subTotalPrice())} change={getValues('amount') - subTotalPrice()} setOpen={setOpen} resetAll={resetAllField} dataPayment={dataSuccessPayment} />
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
                    <Button fullWidth variant='contained' onClick={handleSubmit(handleSubmitCharge)} disabled={!selectedPayment}>Charge</Button>
                  </Grid>
                </Grid>
                <Grid container py={3} spacing={3}>
                  <Grid item xs={12}>
                    <AmountButton subTotalPrice={subTotalPrice()} selectAmount={selectAmount} />
                  </Grid>
                </Grid>
                <Grid container p={3} spacing={3}>
                  <FormInputPricePos
                    control={control}
                    name='amount'
                    errors={errors}
                    label='Amount'
                    disabled={false}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} alignContent={'top'}>Pilih Metode Pembayaran</Grid>
                {/* <Grid container spacing={3}>
                  <Grid item xs={12} alignItems={'center'}>
                    <Grid container spacing={3} xs={12}>
                      {
                        listPaymentType && listPaymentType.map((item, index) => (
                          <Grid item key={index} xs={4}>
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
                </Grid> */}
                <Grid container spacing={4} py={3}>
                  {
                    loadingListPaymentType && <Grid item xs={12} sx={{ height: '150px' }} textAlign={'center'}><CircularProgress /></Grid>
                  }
                  {!loadingListPaymentType && listPaymentType.map((item, index) => (
                    <CustomPaymentTypePos
                      key={index}
                      data={{
                        id: item?.id,
                        title: item?.label,
                        value: item?.id,
                        icon: item?.icon
                      }}
                      selected={selectedPayment?.id}
                      icon={
                        defaultIconPayment({ icon: item?.icon })
                      }
                      handleChange={() => setSelectedPayment(item)}
                      gridProps={{ xs: 3 }}
                      iconHeight={50}
                      iconWidth={50}
                    />
                  ))}
                </Grid>
              </>
            )
          }
        </DialogContent>
      </Dialog>
    </Card>
  )
}


const defaultIconPayment = ({ icon }) => {
  let tempIcon = ''
  if (!icon) {
    tempIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M8 2v4h8V2"/></svg>`
  } else {
    tempIcon = icon
  }

  return typeof tempIcon === 'string' ? (
    <span
      style={{ width: 28, height: 28, display: 'inline-block' }}
      dangerouslySetInnerHTML={{ __html: tempIcon }}
    />
  ) : (
    React.cloneElement(tempIcon, { width: 28, height: 28 })
  );
}