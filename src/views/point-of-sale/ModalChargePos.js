// ** React Imports
import { useEffect, useState } from 'react'
import * as yup from 'yup'
import React from 'react'
// ** MUI Imports
import { Box, Grid, Button, Typography, CircularProgress } from '@mui/material'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { chargePos, fetchListPaymentTypePos } from 'src/store/apps/pos'
import { priceFormat, priceFormatWithZero } from 'src/helpers/priceFormatter'

import Icon from 'src/@core/components/icon'
import PaymentSuccess from './PaymentSuccess'
import FormInputPricePos from '../common/FormPos/FormInputPricePos'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import CustomPaymentTypePos from './CustomPaymentTypePos'
import TotalSectionPos from './TotalSectionPos'
import { swalNotifError } from 'src/helpers/swalFunction'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import ConfirmDialog from 'src/views/common/ConfirmDialog'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

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
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {buttonValues.map(
        (value, index) =>
          value !== null && ( // Hanya tampilkan tombol jika nilai tidak null
            <Button
              key={index}
              variant='outlined'
              color='secondary'
              onClick={() => selectAmount(value)}
              sx={{ flex: '1 1 0', minWidth: 120, color: colors.foreground, borderColor: colors.border3 }}
            >
              {value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
            </Button>
          )
      )}
    </Box>
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
  getTotals
}) {
  const dispatch = useDispatch()

  const [selectedPayment, setSelectedPayment] = useState(null)
  const [alreadyPayment, setAlreadyPayment] = useState(false)
  const [dataSuccessPayment, setDataSuccessPayment] = useState({})
  // Payload waiting for the cashier's "Ya" in the confirmation dialog
  const [pendingCharge, setPendingCharge] = useState(null)

  // State untuk menyimpan nilai payment saat sukses
  const [savedPaymentData, setSavedPaymentData] = useState({
    totalAmount: 0,
    totalPayment: 0,
    change: 0
  })

  const { listPaymentType, loadingListPaymentType, loadingChargePos } = useSelector(state => state.pos)

  // SCHEMA YUP VALIDATION
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
    setOpen(false)
  }

  // Eksekusi charge ke backend
  const doCharge = sendData => {
    const totalPayment = getValues('amount')
    dispatch(
      chargePos({
        data: sendData,
        selectedPayment: selectedPayment,
        subTotalPrice: priceFormat(totalPayment),
        skipPrompt: true,
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

  // Build payload dan langsung charge — validasi harga sudah dilakukan di PointOfSaleLayout
  const handleSubmitCharge = () => {
    let discount = 0
    let subTotal = 0
    let listSendProduct = []
    let totalDebt = 0
    listSelectedProduct.forEach((item, index) => {
      subTotal += item.quantity * item.price
      if (item.isDebt) {
        totalDebt = item.price
      }
      listSendProduct.push({
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
        productName: item?.productName || item?.title || '',
        unitName: item?.unitName || ''
      })
    })

    const totalPayment = getValues('amount')
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

    // Ask first; the request itself only goes out from handleConfirmCharge
    setPendingCharge(sendData)
  }

  const handleConfirmCharge = () => {
    const sendData = pendingCharge
    setPendingCharge(null)
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

  // Customer chosen in POS. If the prop arrives without a name, fall back to the one POS saved locally.
  const customerName = (() => {
    if (customer?.name || customer?.customerName) return customer.name || customer.customerName
    try {
      return JSON.parse(localStorage.getItem('selectedCustomerPos') || 'null')?.name || ''
    } catch (error) {
      return ''
    }
  })()

  return (
    <>
      <AppModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit(handleSubmitCharge)}
        title={alreadyPayment ? '' : 'Pembayaran'}
        hideHeader={alreadyPayment}
        size='md'
        showActions={!alreadyPayment}
        cancelLabel='Batal'
        submitLabel={loadingChargePos ? 'Memproses...' : 'Charge'}
        submitIcon='tabler:cash'
        submitDisabled={!selectedPayment || loadingChargePos}
      >
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
          <Grid container spacing={4}>
            {/* Order Details */}
            <Grid item xs={12} md={6}>
              <Box sx={{ ...panelSx, height: '100%' }}>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground }}>
                    Order Details
                  </Typography>
                  {customerName && (
                    <Box
                      sx={{
                        px: 4,
                        py: 1,
                        flexShrink: 0,
                        maxWidth: '60%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        lineHeight: '16px',
                        borderRadius: `${radii.full}px`,
                        color: colors.primaryForeground,
                        backgroundColor: 'primary.main'
                      }}
                    >
                      {customerName}
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    maxHeight: 420,
                    overflowY: 'auto',
                    px: 3,
                    borderRadius: `${radii['3xl']}px`,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  {listSelectedProduct.map((item, index) => {
                    const quantity = Number(item?.quantity) || 0
                    const price = Number(item?.price) || 0

                    return (
                      <Box
                        key={item?.id ?? index}
                        sx={{
                          py: 3,
                          '&:not(:last-of-type)': { borderBottom: `1px solid ${colors.border}` }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.foreground }}>
                            {item?.productName || item?.title}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground, flexShrink: 0 }}>
                            x{quantity}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                          <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground }}>
                            {item?.unitName ? `${item.unitName} @ ` : ''}
                            {priceFormatWithZero(price)}
                          </Typography>
                          <Typography
                            sx={{ fontSize: '0.75rem', fontWeight: 600, color: colors.foreground, flexShrink: 0 }}
                          >
                            Rp {priceFormat(item?.subTotal ?? quantity * price)}
                          </Typography>
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              </Box>
            </Grid>

            {/* Payment */}
            <Grid item xs={12} md={6}>
              <Box sx={{ ...panelSx, height: '100%' }}>
                <Typography sx={{ mb: 3, fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground }}>
                  Metode Pembayaran
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
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
                        icon={defaultIconPayment({ icon: item?.icon, label: item?.label })}
                        handleChange={() => setSelectedPayment(item)}
                        gridProps={{ xs: 12, sm: 6 }}
                      />
                    ))
                  )}
                </Grid>

                {/* Input Amount & Quick Buttons */}
                {/* Enter must not submit the form: a charge only goes through the Charge button */}
                <Box
                  onKeyDown={event => {
                    if (event.key === 'Enter') event.preventDefault()
                  }}
                >
                  <FormInputPricePos
                    control={control}
                    name='amount'
                    errors={errors}
                    label='Amount'
                    disabled={false}
                    fullWidth
                  />
                </Box>
                <Typography sx={{ mt: 1, mb: 3, fontSize: '0.75rem', color: colors.mutedForeground }}>
                  Masukkan nominal yang diterima dari customer
                </Typography>
                <Box sx={{ mb: 4 }}>
                  <AmountButton subTotalPrice={subTotalPrice()} selectAmount={selectAmount} />
                </Box>

                {/* Ringkasan Transaksi */}
                <TotalSectionPos getTotals={getTotals} />
              </Box>
            </Grid>
          </Grid>
        )}
      </AppModal>

      <ConfirmDialog
        open={Boolean(pendingCharge)}
        onClose={() => setPendingCharge(null)}
        onConfirm={handleConfirmCharge}
        title='Konfirmasi Pembayaran'
        description={
          <>
            Apakah Anda yakin pembayaran menggunakan{' '}
            <Box component='span' sx={{ fontWeight: 600, color: colors.foreground }}>
              {selectedPayment?.label}
            </Box>{' '}
            sebesar{' '}
            <Box component='span' sx={{ fontWeight: 600, color: colors.foreground }}>
              Rp {priceFormat(pendingCharge?.totalPayment || 0)}
            </Box>
          </>
        }
        confirmLabel='Ya'
        cancelLabel='Tidak'
        confirmIcon='tabler:check'
        destructive={false}
      />
    </>
  )
}

// A bordered panel holding one half of the dialog
const panelSx = {
  p: 4,
  borderRadius: `${radii['3xl']}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs,
  backgroundColor: colors.background
}

// ** Bundled icon for a payment type, picked from its name. The stored `icon` markup (often a
// generic placeholder) is only used when the name matches nothing known.
const paymentIconByName = label => {
  const name = (label || '').toLowerCase()
  const rules = [
    [/cash|tunai/, 'tabler:cash'],
    [/qris|\bqr\b/, 'tabler:qrcode'],
    [/transfer/, 'tabler:arrows-exchange'],
    [/bca|bni|bri|mandiri|bank|rekening|giro/, 'tabler:building-bank'],
    [/debit|kredit|credit|kartu|card|edc/, 'tabler:credit-card'],
    [/wallet|gopay|ovo|dana|shopee/, 'tabler:wallet']
  ]

  return rules.find(([pattern]) => pattern.test(name))?.[1] || null
}

const defaultIconPayment = ({ icon, label }) => {
  const bundled = paymentIconByName(label)
  if (bundled) return <Icon icon={bundled} fontSize='1rem' />

  let tempIcon = ''
  if (!icon) {
    tempIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/></svg>`
  } else {
    tempIcon = icon
    tempIcon = tempIcon.replace(/width="[^"]*"/g, '').replace(/height="[^"]*"/g, '')
  }
  return typeof tempIcon === 'string' ? (
    <span style={{ width: 16, height: 16, display: 'inline-flex' }} dangerouslySetInnerHTML={{ __html: tempIcon }} />
  ) : (
    React.cloneElement(tempIcon, { width: 16, height: 16 })
  )
}
