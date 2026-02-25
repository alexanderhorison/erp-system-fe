// ** React Imports
import { useEffect, useRef, useState } from 'react'
import * as yup from 'yup'
import React from 'react'
// ** MUI Imports
import { Box, Card, Grid, Button, Dialog, Typography, DialogContent, IconButton, CircularProgress } from '@mui/material'
import { styled } from '@mui/material/styles'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { chargePos, fetchListPaymentTypePos, validatePricePos } from 'src/store/apps/pos'
import { priceFormat } from 'src/helpers/priceFormatter'

import PaymentSuccess from './PaymentSuccess'
import FormInputPricePos from '../common/FormPos/FormInputPricePos'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomPaymentTypePos from './CustomPaymentTypePos'
import { swalNotifError } from 'src/helpers/swalFunction'
import ModalPriceValidation from './ModalPriceValidation'

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
  const isExactMultipleOfLargeDenomination = subTotalPrice => {
    return subTotalPrice % 50000 === 0 || subTotalPrice % 100000 === 0
  }

  const showButton2And3 = !isExactMultipleOfLargeDenomination(subTotalPrice)

  // Fungsi untuk menghitung tombol kedua (dibulatkan sesuai aturan pecahan)
  const calculateButton2Value = subTotalPrice => {
    // Jika subTotalPrice di bawah 500.000, gunakan pecahan 5.000 - 20.000
    if (subTotalPrice <= 500000) {
      if (subTotalPrice <= 20000) return 20000 // Jika nilai terlalu kecil, gunakan 20.000
      return Math.ceil(subTotalPrice / 5000) * 5000 // Dibulatkan ke atas kelipatan 5000
    } else {
      // Jika di atas 500.000, gunakan pecahan 10.000 - 50.000
      return Math.ceil(subTotalPrice / 50000) * 50000 // Dibulatkan ke atas kelipatan 10000
    }
  }

  // Fungsi untuk menghitung tombol ketiga (dibulatkan ke angka besar berikutnya)
  const calculateButton3Value = subTotalPrice => {
    // Jika subTotalPrice di bawah 500.000, gunakan pecahan 10.000 - 50.000
    if (subTotalPrice <= 500000) {
      return Math.ceil(subTotalPrice / 50000) * 50000 // Dibulatkan ke atas kelipatan 10000
    } else {
      // Jika di atas 500.000, gunakan pecahan 50.000 - 100.000
      return Math.ceil(subTotalPrice / 100000) * 100000 // Dibulatkan ke atas kelipatan 50000
    }
  }

  // Hitung nilai untuk setiap tombol
  const buttonValues = [
    ...new Set([
      subTotalPrice,
      showButton2And3 ? calculateButton2Value(subTotalPrice) : null,
      showButton2And3 ? calculateButton3Value(subTotalPrice) : null
    ])
  ].filter(Boolean) // Hapus null dan undefined

  return (
    <Grid container py={3} spacing={3}>
      {buttonValues.map(
        (value, index) =>
          value !== null && ( // Hanya tampilkan tombol jika nilai tidak null
            <Grid item xs={4} key={index}>
              <Button fullWidth variant='outlined' onClick={() => selectAmount(value)}>
                {value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
              </Button>
            </Grid>
          )
      )}
    </Grid>
  )
}

export default function ModalChargePos({
  open,
  setOpen,
  subTotalPrice,
  listSelectedProduct,
  customer,
  resetAllField,
  warehouse,
  getTotals,
  isCartValidated,
  applyValidatedPrices,
  onCartChange
}) {
  const dispatch = useDispatch()

  const [selectedPayment, setSelectedPayment] = useState(null)
  const [alreadyPayment, setAlreadyPayment] = useState(false)
  const [dataSuccessPayment, setDataSuccessPayment] = useState({})

  // State untuk menyimpan nilai payment saat sukses
  const [savedPaymentData, setSavedPaymentData] = useState({
    totalAmount: 0,
    totalPayment: 0,
    change: 0
  })

  // State untuk modal validasi harga
  const [priceValidationOpen, setPriceValidationOpen] = useState(false)
  const [priceValidationResult, setPriceValidationResult] = useState([])

  // Ref untuk menyimpan sendData sementara, dipakai setelah user confirm di modal validasi
  const pendingSendDataRef = useRef(null)

  const { listPaymentType, loadingListPaymentType, loadingChargePos, loadingValidatePrice } = useSelector(state => state.pos)

  // SHCEMA YUP VALIDATION
  const schema = yup.object().shape({
    amount: yup.number().min(0, 'Nominal harus diisi').required('Harga harus diisi')
  })

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      amount: 0
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // CLOSE MODAL AND RESET FORM
  const handleClose = () => {
    if (alreadyPayment) {
      resetAllField()
    }
    setPriceValidationOpen(false)
    pendingSendDataRef.current = null
    setOpen(false)
  }

  // ─── STEP 2: eksekusi charge (dipanggil setelah validasi harga selesai) ────────
  const doCharge = sendData => {
    const totalPayment = getValues('amount')
    dispatch(
      chargePos({
        data: sendData,
        selectedPayment: selectedPayment,
        subTotalPrice: priceFormat(totalPayment),
        onComplete: data => {
          setSavedPaymentData({
            totalAmount: subTotalPrice(),
            totalPayment: totalPayment,
            change: totalPayment - subTotalPrice()
          })
          setAlreadyPayment(true)
          setDataSuccessPayment(data)
          const openBill = JSON.parse(localStorage.getItem('openBill'))
          const billId = JSON.parse(localStorage.getItem('billId'))
          const newArray = openBill.filter(bill => bill.id !== billId)
          localStorage.setItem('openBill', JSON.stringify(newArray))
          resetAllField()
        }
      })
    )
  }

  // ─── Callback dari ModalPriceValidation ──────────────────────────────────────
  // appliedItems = [{warehouseProductId, backendPrice}] — item yang user pilih untuk di-apply
  // Flow baru: terapkan harga ke cart di parent, tutup modal charge, user kembali ke cart
  const handlePriceValidationConfirm = appliedItems => {
    setPriceValidationOpen(false)
    pendingSendDataRef.current = null

    // Terapkan harga ke cart (di PointOfSaleLayout) dan set isCartValidated=true,
    // lalu tutup ModalCharge supaya user bisa melihat cart yang sudah diupdate
    applyValidatedPrices(appliedItems, () => setOpen(false))
  }

  // ─── STEP 1: build listSendProduct, validasi harga ke backend, buka modal ────
  const handleSubmitCharge = async () => {
    let discount = 0
    let subTotal = 0
    let listSendProduct = []
    let totalDebt = 0
    const totalPayment = getValues('amount')
    listSelectedProduct.forEach((item, index) => {
      subTotal += item.quantity * item.price
      if (item.isDebt) {
        totalDebt = item.price
      }
      listSendProduct.push({
        cartIndex: index,          // identifier unik — aman untuk item duplikat (warehouseProductId sama)
        warehouseProductId: item.warehouseProductId,
        price: item.price,
        quantity: item.quantity,
        subTotal: item.subTotal,
        notes: item?.notes || '',
        title: item?.title || '',
        isDebt: item?.isDebt || false,
        debtDate: item?.debtDate || '',
        MasterProductPriceId: item?.MasterProductPriceId ?? null,
        isPriceUpdated: item?.isPriceUpdated ?? false,
        // Bawa data tampilan untuk modal preview
        productName: item?.productName || item?.title || '',
        unitName: item?.unitName || ''
      })
    })

    const sendData = {
      customerId: customer?.id,
      subTotal: subTotal,
      totalDiscount: discount,
      grandTotal: subTotal - discount,
      totalPayment: totalPayment - discount,
      warehouseId: warehouse?.warehouseId,
      notes: '',
      listProduct: listSendProduct,
      paymentTypeId: selectedPayment.id,
      totalDebt: totalDebt
    }

    // JIKA ADA HUTANG, HARUS ADA CUSTOMERNYA
    if (sendData.totalPayment - sendData.grandTotal < 0 && !sendData.customerId) {
      swalNotifError({ timer: 5000, message: 'Silahkan pilih Customer jika ingin berhutang' })
      return
    }

    // ── Jika cart sudah tervalidasi (user sudah review harga), langsung charge ──
    if (isCartValidated) {
      doCharge(sendData)
      return
    }

    // ── VALIDASI HARGA: semua produk yang punya MasterProductPriceId dicek ──
    const productsToValidate = listSendProduct.filter(
      item => item.MasterProductPriceId !== null && item.MasterProductPriceId !== undefined
    )

    if (productsToValidate.length > 0) {
      const validateResult = await dispatch(validatePricePos({ listProduct: productsToValidate }))

      if (validatePricePos.rejected.match(validateResult)) {
        // Error sudah ditampilkan oleh swalToastError di dalam thunk
        return
      }

      // Backend mengembalikan list produk dengan cartPrice vs backendPrice
      // Struktur yang diharapkan: { data: Array<{...}> } atau langsung Array
      const responseItems = validateResult.payload?.data ?? validateResult.payload ?? []

      if (Array.isArray(responseItems) && responseItems.length > 0) {
        // Enrich dengan data lokal (productName, unitName, cartIndex) supaya modal bisa tampilkan
        // Backend return per warehouseProductId — match ke productsToValidate menggunakan index urutan
        // (productsToValidate dan responseItems harus sejajar; jika tidak, fallback ke find by warehouseProductId)
        const enriched = responseItems.map((r, rIdx) => {
          // Coba match berdasarkan cartIndex yang backend return; jika tidak ada, match by posisi urutan
          const matchByCartIndex = r.cartIndex !== undefined
            ? productsToValidate.find(p => p.cartIndex === r.cartIndex)
            : null
          const matchByOrder = productsToValidate[rIdx]
          const match = matchByCartIndex ?? matchByOrder
          const qty = r.quantity ?? Number(match?.quantity ?? 1)
          const cartPrice = r.cartPrice ?? Number(match?.price ?? 0)
          const backendPrice = r.backendPrice ?? cartPrice
          return {
            ...r,
            cartIndex: r.cartIndex ?? match?.cartIndex ?? rIdx,  // pastikan cartIndex selalu ada
            productName: r.productName ?? match?.productName ?? '',
            unitName: r.unitName ?? match?.unitName ?? '',
            quantity: qty,
            cartPrice,
            backendPrice,
            cartSubTotal: r.cartSubTotal ?? cartPrice * qty,
            backendSubTotal: r.backendSubTotal ?? backendPrice * qty,
            isPriceDifferent: r.isPriceDifferent ?? cartPrice !== backendPrice
          }
        })
        // Buka modal preview validasi harga
        setPriceValidationResult(enriched)
        setPriceValidationOpen(true)
        return
      }
    }

    // Tidak ada produk untuk divalidasi, atau validasi OK tanpa perbedaan → langsung charge
    doCharge(sendData)
  }

  useEffect(() => {
    if (listPaymentType.length === 0) {
      dispatch(fetchListPaymentTypePos())
    }
  }, [])

  useEffect(() => {
    if (open && listPaymentType.length > 0) {
      const cashPayment = listPaymentType.find(
        payment => payment.label === 'CASH' || payment.code === 'CASH' || payment.name === 'CASH'
      )
      if (cashPayment) {
        setSelectedPayment(cashPayment)
      } else {
        setSelectedPayment(listPaymentType[0])
      }
    }
  }, [open, listPaymentType])

  const selectAmount = value => {
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
        <DialogContent>
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          {alreadyPayment ? (
            <PaymentSuccess
              alreadyPayment={alreadyPayment}
              customer={customer}
              totalPayment={savedPaymentData.totalPayment}
              totalAmount={savedPaymentData.totalAmount}
              change={savedPaymentData.change}
              setOpen={setOpen}
              resetAll={resetAllField}
              dataPayment={dataSuccessPayment}
            />
          ) : (
            <>
              {/* Payment Methods */}
              <Box
                sx={{
                  p: 2,
                  mb: 3
                }}
              >
                <Typography variant='h6' sx={{ fontWeight: 600, mb: 2 }}>
                  Metode Pembayaran
                </Typography>

                <Grid container spacing={2}>
                  {loadingListPaymentType ? (
                    <Grid item xs={12} sx={{ height: '120px' }} textAlign='center'>
                      <CircularProgress />
                    </Grid>
                  ) : (
                    listPaymentType.map((item, index) => (
                      <CustomPaymentTypePos
                        key={index}
                        data={{
                          id: item?.id,
                          title: item?.label,
                          value: item?.id,
                          icon: item?.icon,
                          description: item?.description
                        }}
                        selected={selectedPayment?.id}
                        icon={defaultIconPayment({ icon: item?.icon })}
                        handleChange={() => setSelectedPayment(item)}
                        gridProps={{ xs: 4, sm: 3 }}
                        iconHeight={40}
                        iconWidth={40}
                      />
                    ))
                  )}
                </Grid>
              </Box>

              {/* Input Amount & Quick Buttons */}
              <Box
                sx={{
                  p: 2,
                  mb: 3
                }}
              >
                {/* Total yang Harus Dibayar - Highlight */}
                <Box
                  sx={{
                    p: 1.5,
                    mb: 2,
                    borderRadius: 2,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    textAlign: 'center',
                    bgcolor: 'transparent'
                  }}
                >
                  <Typography variant='body1' sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                    JUMLAH YANG HARUS DIBAYAR
                  </Typography>
                  <Typography variant='h5' sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Rp {priceFormat(subTotalPrice())}
                  </Typography>
                </Box>

                {/* Input Amount */}
                <Grid container spacing={2} alignItems='center' sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <FormInputPricePos
                      control={control}
                      name='amount'
                      errors={errors}
                      label='Amount'
                      disabled={false}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                {/* Quick Amount Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    justifyContent: 'flex-start'
                  }}
                >
                  <AmountButton subTotalPrice={subTotalPrice()} selectAmount={selectAmount} />
                </Box>
              </Box>

              {/* Ringkasan Transaksi */}
              <Card
                variant='outlined'
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 1,
                  bgcolor: theme => theme.palette.grey[50],
                  boxShadow: 'none'
                }}
              >
                <Typography variant='h6' sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                  Ringkasan Transaksi
                </Typography>

                {(() => {
                  const { totalBarang, totalHutang, grandTotal } = getTotals()
                  return [
                    { label: 'Total Barang', value: priceFormat(totalBarang) },
                    { label: 'Total Hutang', value: priceFormat(totalHutang) },
                    { label: 'Grand Total', value: priceFormat(grandTotal) }
                  ].map((item, idx) => (
                    <Grid
                      container
                      key={idx}
                      justifyContent='space-between'
                      alignItems='center'
                      sx={{
                        py: 0.6,
                        borderBottom: idx !== 2 ? theme => `1px dashed ${theme.palette.divider}` : 'none'
                      }}
                    >
                      <Typography
                        variant='body1'
                        sx={{ fontWeight: idx === 2 ? 700 : 500, color: idx === 2 ? 'primary.main' : 'text.secondary' }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant={idx === 2 ? 'h6' : 'body1'}
                        sx={{ fontWeight: idx === 2 ? 700 : 500, color: idx === 2 ? 'primary.main' : 'text.primary' }}
                      >
                        Rp {item.value || 0}
                      </Typography>
                    </Grid>
                  ))
                })()}
              </Card>

              {/* Action Buttons */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button fullWidth variant='outlined' color='inherit' size='large' onClick={handleClose}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={handleSubmit(handleSubmitCharge)}
                    disabled={!selectedPayment || loadingChargePos || loadingValidatePrice}
                    startIcon={(loadingChargePos || loadingValidatePrice) ? <CircularProgress size={20} color='inherit' /> : null}
                  >
                    {loadingValidatePrice ? 'Validating...' : loadingChargePos ? 'Processing...' : 'Charge'}
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Preview Validasi Harga */}
      <ModalPriceValidation
        open={priceValidationOpen}
        onClose={() => setPriceValidationOpen(false)}
        onConfirm={handlePriceValidationConfirm}
        validationResult={priceValidationResult}
      />
    </Card>
  )
}

const defaultIconPayment = ({ icon }) => {
  let tempIcon = ''
  if (!icon) {
    tempIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h12a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M8 2v4h8V2"/></svg>`
  } else {
    tempIcon = icon
    tempIcon = tempIcon.replace(/width="[^"]*"/g, '').replace(/height="[^"]*"/g, '')
  }
  return typeof tempIcon === 'string' ? (
    <span style={{ width: 28, height: 28, display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: tempIcon }} />
  ) : (
    React.cloneElement(tempIcon, { width: 28, height: 28 })
  )
}
