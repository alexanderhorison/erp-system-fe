import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'

import * as yup from 'yup'
import { useRouter } from 'next/router'
import { updateFormSalesOrder } from 'src/store/apps/sales-order'
import PickersComponent from '../forms/form-elements/pickers/PickersCustomInput'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { priceFormat, priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { UseAuth } from 'src/hooks/useAuth'
import { returnFormatDateIsoString } from 'src/helpers/formatDate'
import { notifyError } from 'src/helpers/notify'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import FormActionBar from 'src/views/common/FormActionBar'
import SectionHeading from 'src/views/common/SectionHeading'
import DatePickerHighZIndexStyles from 'src/views/common/DatePickerHighZIndexStyles'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

const productRowSx = {
  pb: 4,
  mb: 4,
  borderBottom: `1px solid ${colors.border}`
}

// ** Stock tint for the "Stok: N" chip beside the Produk field — green above the
// product's minimum threshold, amber at/under it, red when exactly out of stock.
const stockTone = (quantity, minimumStock) => {
  const qty = Number(quantity)
  if (!qty) return statusTokens.danger
  if (minimumStock !== undefined && minimumStock !== null && qty <= Number(minimumStock)) return statusTokens.warning
  return statusTokens.success
}

const toneChipSx = tone => ({
  height: 22,
  borderRadius: `${radii.full}px`,
  border: `1px solid ${tone.border}`,
  backgroundColor: tone.bg,
  '& .MuiChip-label': {
    px: 1.5,
    fontSize: '0.6875rem',
    fontWeight: 600,
    lineHeight: '16px',
    color: tone.fg
  }
})

// ** Harga turns red when it's set below the product's Modal — flags a sale
// priced under cost so it isn't submitted by mistake.
const isPriceBelowModal = row => {
  const price = Number(row?.price)
  const modal = Number(row?.modal)
  return Boolean(price) && Boolean(modal) && price < modal
}

const priceBelowModalSx = {
  '& .MuiInputBase-input': {
    color: statusTokens.danger.fg,
    fontWeight: 600
  }
}

const infoChipSx = {
  height: 22,
  borderRadius: `${radii.full}px`,
  border: `1px solid ${colors.border}`,
  backgroundColor: 'transparent',
  '& .MuiChip-label': {
    px: 1.5,
    fontSize: '0.6875rem',
    lineHeight: '16px',
    color: colors.mutedForeground
  }
}

// ** designTokens.js has no orange ramp. `status.warning` is amber, already used
// for the low-stock chip elsewhere in this module, so it cannot double as the
// barter tint the brief asks for ("orange/400", distinct from amber). Using a
// literal Tailwind orange-400 / orange-50 pair here — a deliberate, called-out
// exception, not a new token.
const barterTone = { fg: '#FB923C', bg: '#FFF7ED', border: '#FDBA74' }

export default function EditSalesOrderPage({ data, salesOrderCode }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = UseAuth()
  const { loadingUpdateFormSalesOrder } = useSelector(state => state.salesOrder)

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [date, setDate] = useState(new Date())
  const [shippingDate, setShippingDate] = useState(new Date())
  const [customer, setCustomer] = useState({})

  // Conditionally skip stock validation for Loan Stock SO
  const isLoanStockSO = data?.isLoanStockSO || false

  const schema = yup.object({
    customerId: yup.string().required('Customer harus diisi'),
    grandTotal: yup.number().typeError('Grand Total harus ada'),
    grandTotalCustomer: yup.number().typeError('Total Sales order harus ada'),
    grandTotalBarter: yup.number().typeError('Total Barter harus ada'),
    shippingDate: yup.date().typeError('Tanggal Pengiriman harus diisi'),
    notes: yup.string().optional(),
    data: yup.array().of(
      yup.object({
        warehouseId: yup.number().typeError('Gudang asal harus ada'),
        warehouseProductId: yup.number().typeError('Id product warehouse harus diisi'),
        price: yup.number().typeError('Price product harus diisi'),
        quantity: isLoanStockSO
          ? yup
              .number()
              .typeError('Kuantiti harus diisi')
              .test('is-greater-than-zero', 'Jumlah stok minimal harus lebih dari 0', function (value) {
                const num = Number(value)
                return num >= 0
              })
          : yup
              .number()
              .typeError('Kuantiti harus diisi')
              .test('max', 'Kuantiti tidak boleh lebih besar dari stock tersedia', function (value) {
                const { qty } = this.parent
                return value <= qty
              })
              .test('is-greater-than-zero', 'Jumlah stok minimal harus lebih dari 0', function (value) {
                const num = Number(value)
                return num >= 0
              }),
        subTotal: yup.number().typeError('Sub Total Product harus diisi'),
        modal: yup.number().typeError('Modal Product harus diisi')
      })
    ),
    barterProduct: yup.lazy(value => {
      // If there are items in the barterProduct array, require all fields within the objects
      if (value && value.length > 0) {
        return yup.array().of(
          yup.object({
            warehouseId: yup.number().typeError('Gudang Asal harus ada'),
            warehouseProductId: yup
              .number()
              .typeError('Id product warehouse harus diisi')
              .required('Id product warehouse harus diisi'),
            price: yup.number().typeError('Price product harus diisi').required('Harga barter harus diisi'),
            quantity: yup
              .number()
              .typeError('Kuantiti harus diisi')
              .required('Kuantiti barter harus diisi')
              .test('is-greater-than-zero', 'Jumlah stok minimal harus lebih dari 0', function (value) {
                return Number(value) >= 0
              }),
            subTotal: yup.number().typeError('Sub Total Product harus diisi').required('Sub Total barter harus diisi'),
            isNewModal: yup.boolean().default(false)
          })
        )
      }
      // If no barter products, make it optional
      return yup
        .array()
        .of(
          yup.object({
            warehouseId: yup.number(),
            warehouseProductId: yup.number(),
            price: yup.number(),
            quantity: yup.number(),
            subTotal: yup.number(),
            isNewModal: yup.boolean().default(false)
          })
        )
        .optional()
    })
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch,
    getValues
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // Barang Sales Order
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'data'
  })
  const formField = watch('data') // Watch for changes in 'data' to update totals

  // Barang Barter
  const {
    fields: barterFields,
    remove: removeBarterProduct,
    append: appendBarterProduct
  } = useFieldArray({
    control,
    name: 'barterProduct'
  })
  const formBarter = watch('barterProduct')
  const grandTotalWatch = watch('grandTotal')

  const isAdmin = useMemo(() => {
    return user?.roleId === 1
  }, [user])

  const onSubmit = data => {
    const listItems = data.data
    const listBarter = data.barterProduct

    // Map Barang Sales order
    const lastIndexMap = new Map()
    let duplicate = true
    let lastIndex = -1
    for (let i = 0; i < listItems.length; i++) {
      const { warehouseProductId } = listItems[i]
      const key = `${warehouseProductId}`
      if (lastIndexMap.has(key)) {
        lastIndex = lastIndexMap.get(key)
      }
      lastIndexMap.set(key, i)
    }
    // Check duplicate index
    lastIndex !== -1 ? lastIndex : (duplicate = false)
    if (duplicate) {
      setError(`data[${lastIndex}].warehouseProductId`, {
        type: 'duplicate',
        message: `Produk dan Satuan sudah dipilih`
      })
      notifyError('Produk dan Satuan sudah dipilih')
    }

    // Map Barang Barang Barter
    if (listBarter.length > 0) {
      const lastIndexMap = new Map()
      duplicate = true
      let lastIndex = -1
      for (let i = 0; i < listBarter.length; i++) {
        const { warehouseProductId } = listBarter[i]
        const key = `${warehouseProductId}`
        if (lastIndexMap.has(key)) {
          lastIndex = lastIndexMap.get(key)
        }
        lastIndexMap.set(key, i)
      }
      // Check duplicate index
      lastIndex !== -1 ? lastIndex : (duplicate = false)
      if (duplicate) {
        setError(`barterProduct[${lastIndex}].warehouseProductId`, {
          type: 'duplicate',
          message: `Produk dan Satuan sudah dipilih`
        })
        notifyError('Produk dan Satuan sudah dipilih')
      }
    }

    if (!duplicate) {
      let sendData = {
        customerId: +data.customerId,
        grandTotal: data.grandTotal,
        grandTotalCustomer: data.grandTotalCustomer,
        grandTotalBarter: data.grandTotalBarter,
        dueDate: date.toLocaleDateString('en-GB'),
        shippingDate: returnFormatDateIsoString(shippingDate),
        notes: data.notes,
        listProduct: listItems,
        listBarterProduct: listBarter
      }
      dispatch(updateFormSalesOrder({ data: sendData, code: salesOrderCode, router }))
    }
  }

  const formatDate = date => {
    const [day, month, year] = date.split('/')
    const isoDate = `${year}-${month}-${day}`
    const dateObject = new Date(isoDate)
    return dateObject
  }

  useEffect(() => {
    remove()
    removeBarterProduct()
    data?.listProducts.forEach(product => {
      append({
        id: product.id,
        productName: `${product?.productName} - ${product.unitName}`,
        warehouseProductId: product.warehouseProductId,
        rackName: product.rackName,
        unitName: product.unitName,
        quantity: product.quantity,
        price: product.price,
        subTotal: product.subTotal,
        qty: product.qty,
        minimumStock: product.minimumStock,
        warehouseId: product.warehouseId,
        warehouseName: product.warehouseName,
        modal: product.modal
      })
    })
    if (data?.listBarterProducts.length > 0) {
      data?.listBarterProducts.forEach(product => {
        appendBarterProduct({
          id: product.id,
          productName: `${product?.productName} - ${product.unitName}`,
          warehouseProductId: product.warehouseProductId,
          rackName: product.rackName,
          unitName: product.unitName,
          quantity: product.quantity,
          price: product.price,
          subTotal: product.subTotal,
          qty: product.qty,
          minimumStock: product.minimumStock,
          warehouseId: product.warehouseId,
          warehouseName: product.warehouseName,
          isNewModal: product.isNewModal
        })
      })
    }
    const shipDate = data?.shippingDate || new Date()
    setDate(formatDate(data?.dueDate))
    setShippingDate(new Date(shipDate))
    setValue('customerId', data?.customer?.id)
    setValue('grandTotal', data?.grandTotal)
    setValue('notes', data?.notes)
    setValue('grandTotalCustomer', data?.grandTotalCustomer) // Update total sales order
    setValue('grandTotalBarter', data?.grandTotalBarter)
    setCustomer({
      email: data?.customer?.email,
      address: data?.customer?.address,
      phoneNumber: data?.customer?.phoneNumber,
      rankName: data?.customer?.rankName
    })
  }, [dispatch, append])

  useEffect(() => {
    calculateTotals()
  }, [formField, formBarter])

  const calculateTotals = () => {
    // Calculate Sales Order total
    const salesOrderTotal = formField?.reduce((acc, item) => {
      return acc + Number(item.quantity) * Number(item.price)
    }, 0)

    // Calculate Barter Product total
    const barterTotal = formBarter?.reduce((acc, item) => {
      return acc + Number(item.quantity) * Number(item.price)
    }, 0)

    // Calculate grand total
    setValue('grandTotal', salesOrderTotal - barterTotal) // Update grand total
    setValue('grandTotalCustomer', salesOrderTotal) // Update total sales order
    setValue('grandTotalBarter', barterTotal) // Update total barter
  }

  const handlePriceChange = ({ event, index, fieldName, setValue, formStateField, onChange, isCalculation }) => {
    const input = event.target
    const cursorPosition = input.selectionStart // Save cursor position
    const rawValue = input.value.replace(/\D/g, '') // Remove non-digit characters
    const formattedValue = priceFormat(+rawValue)

    // Determine the new cursor position after formatting
    const unformattedBeforeCursor = input.value.slice(0, cursorPosition).replace(/\D/g, '') // Remove formatting before the cursor
    const newCursorIndex = unformattedBeforeCursor.length

    onChange(rawValue)
    input.value = formattedValue

    // Calculate where the cursor should be in the formatted string
    let cursorIndexInFormatted = 0
    for (let i = 0, digitsCount = 0; i < formattedValue.length; i++) {
      if (/\d/.test(formattedValue[i])) {
        digitsCount++
      }
      if (digitsCount === newCursorIndex) {
        cursorIndexInFormatted = i + 1
        break
      }
    }
    input.setSelectionRange(cursorIndexInFormatted, cursorIndexInFormatted)

    if (isCalculation) {
      const newPrice = +rawValue
      const currentQuantity = formStateField[index]?.quantity || 0
      const newSubTotal = currentQuantity * newPrice

      if (parseInt(newSubTotal, 10) > 0) {
        setValue(`${fieldName}[${index}].subTotal`, newSubTotal)
      }

      if (
        formStateField[index].quantity &&
        formStateField[index].price &&
        parseInt(formStateField[index].quantity, 10) > 0
      ) {
        calculateTotals()
      }
    }
  }

  const grandTotalIsNegative = Number(grandTotalWatch) < 0

  return (
    <>
      <DatePickerHighZIndexStyles />
      <form onSubmit={handleSubmit(onSubmit)}>
        <PageHeader
          title='Form Edit Sales Order'
          subtitle={`Sales Order: ${salesOrderCode}`}
          onBack={() => router.back()}
          breadcrumbs={[{ label: 'Sales Order', href: '/sales-order' }, { label: 'Edit' }]}
        />

        {/* No `spacing` on this container: `FormActionBar`'s negative margins are
            measured against the content column, and grid gutters would offset it. */}
        <Grid container>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <SectionHeading number={1} title='Informasi Customer' />
                <Card elevation={0} sx={{ ...surfaceCardSx, mb: 4 }}>
                  <CardContent sx={{ p: 5 }}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6}>
                        <CustomTextField fullWidth label='Customer' disabled value={data?.customer?.name || ''} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          selected={date}
                          id='basic'
                          popperPlacement={popperPlacement}
                          popperClassName='high-z-index-popper'
                          onChange={date => setDate(date)}
                          fullWidth
                          customInput={<PickersComponent label='Tanggal Jatuh Tempo' />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          {customer?.email && (
                            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
                              {customer.email}
                            </Typography>
                          )}
                          {customer?.address && (
                            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
                              {customer.address}
                            </Typography>
                          )}
                          {customer?.phoneNumber && (
                            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
                              {customer.phoneNumber}
                            </Typography>
                          )}
                          {customer?.rankName && (
                            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
                              {customer.rankName}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          selected={shippingDate}
                          id='basic'
                          popperPlacement={popperPlacement}
                          popperClassName='high-z-index-popper'
                          onChange={date => setShippingDate(date)}
                          fullWidth
                          customInput={<PickersComponent label='Tanggal Pengiriman' />}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 16 }}>
                  <Card elevation={0} sx={surfaceCardSx}>
                    <CardContent sx={{ p: 5 }}>
                      <Controller
                        name='notes'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            multiline
                            rows={4}
                            fullWidth
                            label='Catatan'
                            placeholder='Catatan...'
                            value={value || ''}
                            onChange={e => onChange(e.target.value)}
                          />
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: `${radii.lg}px`,
                      border: `1px solid ${statusTokens.success.border}`,
                      boxShadow: shadows.xs,
                      backgroundColor: statusTokens.success.bg
                    }}
                  >
                    <CardContent sx={{ p: 5 }}>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.foreground, mb: 3 }}>
                        Ringkasan
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }}>Total Sales</Typography>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.foreground }}>
                          {priceFormatWIthCurrency(getValues('grandTotalCustomer')) || 'Rp0'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5 }}>
                        <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }}>Total Barter</Typography>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.foreground }}>
                          - {priceFormatWIthCurrency(getValues('grandTotalBarter')) || 'Rp0'}
                        </Typography>
                      </Box>
                      <Divider sx={{ borderBottomWidth: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2 }}>
                        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.foreground }}>
                          Grand Total
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '1.0625rem',
                            fontWeight: 700,
                            color: grandTotalIsNegative ? colors.destructive : colors.foreground
                          }}
                        >
                          {grandTotalWatch < 0 ? '-' : ''}
                          {priceFormatWIthCurrency(Math.abs(grandTotalWatch || 0)) || 'Rp0'}
                        </Typography>
                      </Box>
                      {grandTotalIsNegative && (
                        <Typography sx={{ fontSize: '0.75rem', color: colors.destructive, mt: 2 }}>
                          Karena Total Barter &gt; Total Sales maka Anda perlu membayar senilai Grand Total kepada
                          customer
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <SectionHeading number={2} title='Barang Sales' />
                <Card elevation={0} sx={{ ...surfaceCardSx, mb: 4 }}>
                  <CardContent sx={{ p: 5 }}>
                    {fields.map((item, index) => (
                      <Box key={item.id} sx={index !== fields.length - 1 ? productRowSx : { mb: 4 }}>
                        <Grid container spacing={4} alignItems='flex-start'>
                          <Grid item xs={12} md={3}>
                            <Controller
                              name={`data[${index}].warehouseName`}
                              control={control}
                              render={({ field: { value } }) => (
                                <CustomTextField fullWidth value={value} disabled label='Gudang Sumber' />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={9}>
                            <Controller
                              name={`data[${index}].productName`}
                              control={control}
                              render={({ field: { value } }) => (
                                <CustomTextField fullWidth label='Produk' disabled value={value} />
                              )}
                            />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                              <Chip
                                size='small'
                                label={`Rak: ${getValues(`data[${index}].rackName`) || '-'}`}
                                sx={infoChipSx}
                              />
                              <Chip
                                size='small'
                                label={`Unit: ${getValues(`data[${index}].unitName`) || '-'}`}
                                sx={infoChipSx}
                              />
                              {getValues(`data[${index}].qty`) !== undefined &&
                                getValues(`data[${index}].qty`) !== '' && (
                                  <Chip
                                    size='small'
                                    label={`Stok: ${getValues(`data[${index}].qty`)}`}
                                    sx={toneChipSx(
                                      stockTone(
                                        getValues(`data[${index}].qty`),
                                        getValues(`data[${index}].minimumStock`)
                                      )
                                    )}
                                  />
                                )}
                            </Box>
                          </Grid>

                          <Grid item xs={6} md={isAdmin ? 3 : 4}>
                            <Controller
                              name={`data[${index}].quantity`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <CustomTextField
                                  fullWidth
                                  label='Kuantiti'
                                  value={value}
                                  onChange={e => {
                                    const newQuantity = +e.target.value
                                    const currentPrice = formField[index].price || 0
                                    const newSubTotal = newQuantity * currentPrice

                                    // Update the quantity and the subtotal
                                    onChange(newQuantity || '')
                                    if (parseInt(newSubTotal, 10) > 0) {
                                      setValue(`data[${index}].subTotal`, newSubTotal)
                                    }
                                    if (
                                      formField[index].quantity &&
                                      formField[index].price &&
                                      parseInt(formField[index].quantity, 10) > 0
                                    ) {
                                      calculateTotals()
                                    }
                                  }}
                                  type='number'
                                  error={Boolean(errors?.data?.[index]?.quantity)}
                                  {...(errors?.data?.[index]?.quantity && {
                                    helperText: errors?.data?.[index]?.quantity.message
                                  })}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={6} md={isAdmin ? 3 : 4}>
                            <Controller
                              name={`data[${index}].price`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <CustomTextField
                                  fullWidth
                                  label='Harga'
                                  value={value ? priceFormat(value) : ''}
                                  onChange={e => {
                                    handlePriceChange({
                                      event: e,
                                      index,
                                      fieldName: 'data',
                                      setValue,
                                      formStateField: formField,
                                      onChange,
                                      isCalculation: true
                                    })
                                  }}
                                  type='text'
                                  error={Boolean(errors?.data?.[index]?.price)}
                                  {...(errors?.data?.[index]?.price && {
                                    helperText: errors?.data?.[index]?.price.message
                                  })}
                                  sx={isPriceBelowModal(formField[index]) ? priceBelowModalSx : undefined}
                                />
                              )}
                            />
                          </Grid>
                          {isAdmin && (
                            <Grid item xs={6} md={3}>
                              <Controller
                                name={`data[${index}].modal`}
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <CustomTextField
                                    fullWidth
                                    label='Modal'
                                    value={priceFormat(value || 0)}
                                    type='text'
                                    onChange={e => {
                                      handlePriceChange({
                                        event: e,
                                        index,
                                        fieldName: 'data',
                                        setValue,
                                        formStateField: formField,
                                        onChange
                                      })
                                    }}
                                    error={Boolean(errors?.data?.[index]?.modal)}
                                    {...(errors?.data?.[index]?.modal && {
                                      helperText: errors?.data?.[index]?.modal.message
                                    })}
                                  />
                                )}
                              />
                            </Grid>
                          )}
                          <Grid item xs={6} md={isAdmin ? 3 : 4}>
                            <Controller
                              name={`data[${index}].subTotal`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <CustomTextField
                                  fullWidth
                                  label='Sub Total'
                                  value={priceFormat(value || 0)}
                                  disabled
                                  type='text'
                                  error={Boolean(errors?.data?.[index]?.subTotal)}
                                  {...(errors?.data?.[index]?.subTotal && {
                                    helperText: errors?.data?.[index]?.subTotal.message
                                  })}
                                  sx={{
                                    '& .MuiFilledInput-root.Mui-disabled': {
                                      backgroundColor: `${statusTokens.info.bg} !important`,
                                      border: `1px solid ${statusTokens.info.border}`
                                    },
                                    '& .MuiInputBase-input.Mui-disabled': {
                                      WebkitTextFillColor: statusTokens.info.fg,
                                      fontWeight: 600
                                    }
                                  }}
                                />
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    ))}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          borderRadius: `${radii.full}px`,
                          border: `1px solid ${statusTokens.info.border}`,
                          backgroundColor: statusTokens.info.bg,
                          px: 3,
                          py: 1.5
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: statusTokens.info.fg }}>
                          Total Sales Order
                        </Typography>
                        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: statusTokens.info.fg }}>
                          {priceFormatWIthCurrency(getValues('grandTotalCustomer')) || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {barterFields.length > 0 && (
                <Grid item xs={12} md={8}>
                  <SectionHeading number={3} title='Barang Barter' />
                  <Card elevation={0} sx={{ ...surfaceCardSx, mb: 4 }}>
                    <CardContent sx={{ p: 5 }}>
                      {barterFields.map((item, index) => (
                        <Box key={item.id} sx={index !== barterFields.length - 1 ? productRowSx : { mb: 4 }}>
                          <Grid container spacing={4} alignItems='flex-start'>
                            <Grid item xs={12} md={3}>
                              <Controller
                                name={`barterProduct[${index}].warehouseName`}
                                control={control}
                                render={({ field: { value } }) => (
                                  <CustomTextField fullWidth value={value} disabled label='Gudang Sumber' />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={9}>
                              <Controller
                                name={`barterProduct[${index}].productName`}
                                control={control}
                                render={({ field: { value } }) => (
                                  <CustomTextField fullWidth label='Produk' disabled value={value} />
                                )}
                              />
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                                <Chip
                                  size='small'
                                  label={`Rak: ${getValues(`barterProduct[${index}].rackName`) || '-'}`}
                                  sx={infoChipSx}
                                />
                                <Chip
                                  size='small'
                                  label={`Unit: ${getValues(`barterProduct[${index}].unitName`) || '-'}`}
                                  sx={infoChipSx}
                                />
                                {getValues(`barterProduct[${index}].qty`) !== undefined &&
                                  getValues(`barterProduct[${index}].qty`) !== '' && (
                                    <Chip
                                      size='small'
                                      label={`Stok: ${getValues(`barterProduct[${index}].qty`)}`}
                                      sx={toneChipSx(
                                        stockTone(
                                          getValues(`barterProduct[${index}].qty`),
                                          getValues(`barterProduct[${index}].minimumStock`)
                                        )
                                      )}
                                    />
                                  )}
                              </Box>
                            </Grid>

                            <Grid item xs={6} md={3}>
                              <Controller
                                name={`barterProduct[${index}].quantity`}
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <CustomTextField
                                    fullWidth
                                    label='Kuantiti'
                                    value={value}
                                    onChange={e => {
                                      const newQuantity = +e.target.value
                                      const currentPrice = formBarter[index].price || 0
                                      const newSubTotal = newQuantity * currentPrice

                                      // Update the quantity and the subtotal
                                      onChange(newQuantity || '')
                                      if (parseInt(newSubTotal, 10) > 0) {
                                        setValue(`barterProduct[${index}].subTotal`, newSubTotal)
                                      }
                                      if (
                                        formBarter[index].quantity &&
                                        formBarter[index].price &&
                                        parseInt(formBarter[index].quantity, 10) > 0
                                      ) {
                                        calculateTotals()
                                      }
                                    }}
                                    type='number'
                                    error={Boolean(errors?.barterProduct?.[index]?.quantity)}
                                    {...(errors?.barterProduct?.[index]?.quantity && {
                                      helperText: errors?.barterProduct?.[index]?.quantity.message
                                    })}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Controller
                                name={`barterProduct[${index}].price`}
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <CustomTextField
                                    fullWidth
                                    label='Harga'
                                    value={value ? priceFormat(value) : ''}
                                    onChange={e => {
                                      handlePriceChange({
                                        event: e,
                                        index,
                                        fieldName: 'barterProduct',
                                        setValue,
                                        formStateField: formBarter,
                                        onChange,
                                        isCalculation: true
                                      })
                                    }}
                                    type='text'
                                    error={Boolean(errors?.barterProduct?.[index]?.price)}
                                    {...(errors?.barterProduct?.[index]?.price && {
                                      helperText: errors?.barterProduct?.[index]?.price.message
                                    })}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={6} md={1.5}>
                              <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground, mb: 1 }}>
                                Modal Baru
                              </Typography>
                              <Controller
                                name={`barterProduct[${index}].isNewModal`}
                                control={control}
                                defaultValue={false}
                                render={({ field: { value, onChange } }) => (
                                  <Checkbox checked={value} onChange={e => onChange(e.target.checked)} sx={{ p: 0 }} />
                                )}
                              />
                            </Grid>
                            <Grid item xs={6} md={4.5}>
                              <Controller
                                name={`barterProduct[${index}].subTotal`}
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <CustomTextField
                                    fullWidth
                                    label='Sub Total'
                                    value={priceFormat(value || 0)}
                                    disabled
                                    type='text'
                                    error={Boolean(errors?.barterProduct?.[index]?.subTotal)}
                                    {...(errors?.barterProduct?.[index]?.subTotal && {
                                      helperText: errors?.barterProduct?.[index]?.subTotal.message
                                    })}
                                    sx={{
                                      '& .MuiFilledInput-root.Mui-disabled': {
                                        backgroundColor: `${barterTone.bg} !important`,
                                        border: `1px solid ${barterTone.border}`
                                      },
                                      '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: barterTone.fg,
                                        fontWeight: 600
                                      }
                                    }}
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      ))}

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            borderRadius: `${radii.full}px`,
                            border: `1px solid ${barterTone.border}`,
                            backgroundColor: barterTone.bg,
                            px: 3,
                            py: 1.5
                          }}
                        >
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: barterTone.fg }}>
                            Total Barter
                          </Typography>
                          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: barterTone.fg }}>
                            {priceFormatWIthCurrency(getValues('grandTotalBarter')) || '0'}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <FormActionBar
              onCancel={() => router.back()}
              loading={loadingUpdateFormSalesOrder}
              submitLabel='Submit'
              cancelLabel='Cancel'
              loadingLabel='Submitting...'
            />
          </Grid>
        </Grid>
      </form>
    </>
  )
}
