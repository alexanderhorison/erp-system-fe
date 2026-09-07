import { useTheme } from '@emotion/react'
import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchInvoiceListProductByWarehouseId } from 'src/store/apps/delivery-order'
import { fetchMasterDataProduct } from 'src/store/apps/master/product'
import { fetchMasterDataVendor } from 'src/store/apps/master/vendor'
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import PickersComponent from '../forms/form-elements/pickers/PickersCustomInput'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import * as yup from 'yup'
import Icon from 'src/@core/components/icon'
import OptionsGroup from 'src/helpers/groupedInput'
import { priceFormat, priceFormatWIthCurrency } from 'src/helpers/priceFormatter'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'
import { fetchOneMasterDataProductPrice } from 'src/store/apps/master/product-price'
import ModalTransformProductSalesOrder from '../sales-order/ModalTransformProductSalesOrder'
import { createPurchaseOrder } from 'src/store/apps/purchase-order'
import ModalAddMasterVendor from '../master/vendor/ModalAddMasterVendor'
import ModalTransformPrice from './ModalTransformPrice'
import { fetchOneMasterDataModal } from 'src/store/apps/master/modal'
import { notifyError } from 'src/helpers/notify'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import FormActionBar from 'src/views/common/FormActionBar'
import SectionHeading from 'src/views/common/SectionHeading'

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

// ** designTokens.js has no orange ramp. `status.warning` is amber, already used
// elsewhere, so it cannot double as the barter tint the sales-order baseline
// uses ("orange/400", distinct from amber). Same literal Tailwind orange-400 /
// orange-50 pair as AddSalesOrder.js — a deliberate, called-out exception.
const barterTone = { fg: '#FB923C', bg: '#FFF7ED', border: '#FDBA74' }

export default function AddPurchaseOrder({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // ** States
  const [date, setDate] = useState(new Date())
  const [vendorData, setVendorData] = useState({})
  const [warehouseId, setWarehouseId] = useState()
  const [openModalTransformation, setOpenModalTransformation] = useState(false)
  const [openModalVendor, setOpenModalVendor] = useState(false)
  const [helperTextChanges, setHelperTextChanges] = useState(false)
  const [transformationData, setTransformationData] = useState({})
  const [dataWarehouseIds, setDataWarehouseIds] = useState({})
  const [openModalTransformPrice, setOpenModalTransformPrice] = useState(false)
  const [transformPriceData, setTransformPriceData] = useState({})
  const [lastTransformData, setLastTransformData] = useState({})

  // ** Redux
  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
  const { data: masterVendor } = useSelector(state => state.masterVendor)
  const { data: listMasterProduct } = useSelector(state => state.masterProduct)
  const { data: listMasterUnit } = useSelector(state => state.unit)
  const { loadingCreatePurchaseOrder } = useSelector(state => state.purchaseOrder)

  // ** Validation
  const schema = yup.object({
    vendorId: yup.string().required('Vendor harus diisi'),
    grandTotal: yup.number().typeError('Grand Total harus ada'),
    grandTotalVendor: yup.number().typeError('Total Purchase order harus ada'),
    grandTotalBarter: yup.number().typeError('Total Barter harus ada'),
    notes: yup.string().optional(),
    data: yup.array().of(
      yup.object({
        warehouseId: yup.number().typeError('Gudang tujuan harus diisi'),
        masterProductId: yup.number().typeError('Produk harus diisi'),
        unitId: yup.number().typeError('Satuan harus diisi').nonNullable('Satuan harus diisi'),
        price: yup.number().typeError('Price product harus diisi').nonNullable('Price product harus diisi'),
        quantity: yup.number().min(0, 'Kuantiti tidak boleh minus').typeError('Kuantiti harus diisi'),
        subTotal: yup.number().typeError('Sub Total Product harus diisi'),
        disabledTransform: yup.boolean().default(true),
        isNewModal: yup.boolean().default(false)
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
              .test('max', 'Kuantiti tidak boleh lebih besar dari stock tersedia', function (value) {
                const { qty } = this.parent
                return value <= qty
              })
              .test('is-greater-than-zero', 'Jumlah stok minimal harus lebih dari 0', function (value) {
                return Number(value) >= 0
              }),
            subTotal: yup.number().typeError('Sub Total Product harus diisi').required('Sub Total barter harus diisi'),
            modal: yup.number().typeError('Modal Product harus diisi').required('Modal barter harus diisi')
          })
        )
      }
      // If no barter products, make it optional
      return yup
        .array()
        .of(
          yup.object({
            warehouseProductId: yup.number(),
            warehouseId: yup.number(),
            price: yup.number(),
            quantity: yup.number(),
            subTotal: yup.number(),
            modal: yup.number()
          })
        )
        .optional()
    })
  })

  // ** Forms
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    getValues,
    watch,
    clearErrors,
    trigger
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // ** Barang Purchase Order
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'data'
  })
  const formField = watch('data')

  // ** Barang Barter
  const {
    fields: barterFields,
    remove: removeBarterProduct,
    append: appendBarterProduct,
    update
  } = useFieldArray({
    control,
    name: 'barterProduct'
  })
  const formBarter = watch('barterProduct')
  const grandTotalWatch = watch('grandTotal')

  const addMore = () => {
    append({
      warehouseId: '',
      masterProductId: '',
      unitId: '',
      price: '',
      quantity: '',
      subTotal: '',
      disabledTransform: true
    })
  }

  const deleteItem = itemIndex => {
    remove(itemIndex)
  }

  // ** Calculate Totals
  const calculateTotals = () => {
    const updatedFormField = getValues('data') // Fetch latest form values
    const updatedFormBarter = getValues('barterProduct')

    // Calculate Purchase Order total
    const purchaseOrderTotal = updatedFormField?.reduce((acc, item) => {
      return acc + Number(item.quantity) * Number(item.price)
    }, 0)

    // Calculate Barter Product total
    const barterTotal = updatedFormBarter?.reduce((acc, item) => {
      return acc + Number(item.quantity) * Number(item.price)
    }, 0)

    // Calculate grand total
    setValue('grandTotal', purchaseOrderTotal - barterTotal) // Update grand total
    setValue('grandTotalVendor', purchaseOrderTotal) // Update total purchase order
    setValue('grandTotalBarter', barterTotal) // Update total barter
  }

  // ** Handle Submit
  const onSubmit = data => {
    const listItems = data.data
    const listBarter = data.barterProduct

    // Map Barang Purchase order
    const lastIndexMap = new Map()
    let duplicate = true
    let lastIndex = -1
    for (let i = 0; i < listItems.length; i++) {
      const { masterProductId, unitId } = listItems[i]
      const key = `${masterProductId}-${unitId}`
      if (lastIndexMap.has(key)) {
        lastIndex = lastIndexMap.get(key)
      }
      lastIndexMap.set(key, i)
    }
    // Check duplicate index
    lastIndex !== -1 ? lastIndex : (duplicate = false)
    if (duplicate) {
      setError(`data[${lastIndex}].masterProductId`, {
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
        vendorId: +data.vendorId,
        grandTotal: data.grandTotal,
        grandTotalVendor: data.grandTotalVendor,
        grandTotalBarter: data.grandTotalBarter,
        dueDate: date.toLocaleDateString('en-GB'),
        notes: data.notes,
        listProduct: listItems,
        listBarterProduct: listBarter
      }
      dispatch(createPurchaseOrder({ data: sendData, router }))
    }
  }

  // ** Handle Transform
  const onSelectTransform = itemIndex => {
    let temp = getValues(`barterProduct.${itemIndex}`)
    setWarehouseId(getValues(`barterProduct.${itemIndex}.warehouseId`))
    setTransformationData({ ...temp, indexForm: itemIndex })
    setOpenModalTransformation(true)
  }

  useEffect(() => {
    calculateTotals()
    checkDisabledTransform()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formField, formBarter])

  useEffect(() => {
    if (fields.length === 0) {
      append({
        warehouseId: '',
        masterProductId: '',
        unitId: '',
        price: '',
        quantity: '',
        subTotal: '',
        disabledTransform: true
      })
    }
    dispatch(fetchMasterDataWarehouse())
    dispatch(fetchMasterDataVendor())
    dispatch(fetchMasterDataProduct())
    dispatch(fetchMasterDataUnit())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    // For transformation product
  }, [helperTextChanges, dataWarehouseIds])

  const handleWarehouseSelect = newWarehouseId => {
    setWarehouseId(newWarehouseId) // Update the selected warehouseId
    // Check if data for the selected warehouseId already exists
    if (!dataWarehouseIds[newWarehouseId]) {
      // Fetch data only if it doesn't exist in the state
      dispatch(fetchInvoiceListProductByWarehouseId(newWarehouseId))
        .then(response => {
          setDataWarehouseIds(prevState => ({
            ...prevState,
            [newWarehouseId]: response.payload.data // Store the fetched data by warehouseId
          }))
        })
        .catch(error => console.error('Failed to fetch data:', error))
    }
  }

  const handleTransformProductUpdate = (warehouseId, indexForm, transformedProduct) => {
    // belum handle jika penambahan product baru yang di transformasi maka si dropdown select akan kosong
    setDataWarehouseIds(prevState => {
      // Copy the previous state for immutability
      const updatedWarehouseData = { ...prevState }

      // To update product so immutable
      const currentProducts = updatedWarehouseData[warehouseId]
        ? [...updatedWarehouseData[warehouseId]] // Create a shallow copy of the array
        : []

      // Check if data exists for the specified warehouseId
      // Add or replace the transformed product in the list
      const existingIndex = currentProducts.findIndex(
        product => product.productWarehouseId == transformedProduct.productWarehouseId
      )

      if (existingIndex >= 0) {
        // Replace the existing product
        currentProducts[existingIndex] = transformedProduct
      } else {
        // Add the transformed product
        currentProducts.push(transformedProduct)
      }

      // Update the state with the modified array
      updatedWarehouseData[warehouseId] = currentProducts

      return updatedWarehouseData // Return the updated state
    })
    setValue(`barterProduct[${indexForm}].warehouseId`, +warehouseId)
    setValue(`barterProduct[${indexForm}].warehouseProductId`, transformedProduct.productWarehouseId)
    handleFetchDefaultBasePrice({
      productId: transformedProduct.masterProductId,
      unitId: transformedProduct?.masterUnitId,
      index: indexForm,
      fieldName: 'barterProduct'
    })
    handleFetchDefaultBaseModal({
      productId: transformedProduct.masterProductId,
      unitId: transformedProduct?.masterUnitId,
      index: indexForm,
      fieldName: 'barterProduct'
    })
  }

  const handleAddVendor = () => {
    setOpenModalVendor(true)
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

  const handleFetchDefaultBasePrice = ({ productId, unitId, index, fieldName }) => {
    dispatch(
      fetchOneMasterDataProductPrice({
        productId,
        unitId
      })
    ).then(({ payload }) => {
      // if price exist then switch to replace
      if (payload.data) {
        setValue(`${fieldName}[${index}].price`, payload.data.basePrice)
        const dataIndex = getValues(`${fieldName}[${index}]`)
        setValue(`${fieldName}[${index}].subTotal`, Number(dataIndex.price) * dataIndex.quantity, {
          shouldValidate: true, // Ensures validation runs
          shouldDirty: true
        })
        setTimeout(() => {
          calculateTotals()
        }, 0)
      } else {
        setValue(`${fieldName}[${index}].price`, '')
      }
    })
  }

  const handleFetchDefaultBaseModal = ({ productId, unitId, index, fieldName }) => {
    dispatch(
      fetchOneMasterDataModal({
        productId,
        unitId
      })
    ).then(({ payload }) => {
      // if price exist then switch to replace
      if (payload.data) {
        setValue(`${fieldName}[${index}].modal`, payload.data.modal)
      } else {
        setValue(`${fieldName}[${index}].modal`, '')
      }
    })
  }

  const handleTransformHarga = index => {
    setOpenModalTransformPrice(true)
    let temp = getValues(`data.${index}`)
    const findUnit = listMasterUnit.find(unit => unit.id == temp.unitId)
    setTransformPriceData({ ...temp, unitName: findUnit.name, noIndex: index })
  }

  const checkDisabledTransform = () => {
    formField?.forEach((item, index) => {
      const isDisabled = disabledTransform(item)
      if (item.disabledTransform !== isDisabled) {
        setValue(`data[${index}].disabledTransform`, isDisabled, { shouldValidate: true })
      }
    })
  }

  const disabledTransform = item => {
    return !item.masterProductId || !item.unitId || !item.quantity
  }

  const handleSaveTransformData = (index, data) => {
    setLastTransformData(prev => ({ ...prev, [index]: data }))
  }

  const handleResetValueAndForm = ({ fieldName, index }) => {
    setValue(`${fieldName}[${index}].subTotal`, '')
    setValue(`${fieldName}[${index}].quantity`, '')
    setValue(`${fieldName}[${index}].price`, '')
    setValue(`${fieldName}[${index}].modal`, '')
    clearErrors(`${fieldName}.${index}.subTotal`)
    clearErrors(`${fieldName}.${index}.quantity`)
    clearErrors(`${fieldName}.${index}.price`)
    clearErrors(`${fieldName}.${index}.modal`)
    calculateTotals()
  }

  const grandTotalIsNegative = grandTotalWatch < 0

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PageHeader
          title='Pembuatan Purchase Order'
          onBack={() => router.back()}
          breadcrumbs={[{ label: 'Purchase Order', href: '/purchase-order' }, { label: 'Tambah' }]}
        />

        {/* No `spacing` on this container: `FormActionBar`'s negative margins are
            measured against the content column, and grid gutters would offset it. */}
        <Grid container>
          <Grid item xs={12}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <SectionHeading number={1} title='Informasi Vendor' />
                <Card elevation={0} sx={{ ...surfaceCardSx, mb: 4 }}>
                  <CardContent sx={{ p: 5 }}>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Controller
                              name={`vendorId`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <CustomAutocomplete
                                  options={masterVendor}
                                  id='autocomplete-custom'
                                  getOptionLabel={option => option.name || ''}
                                  onChange={(event, newValue) => {
                                    onChange(+newValue?.id || '')
                                    setVendorData(newValue)
                                  }}
                                  renderInput={params => (
                                    <CustomTextField
                                      value={value}
                                      {...params}
                                      fullWidth
                                      error={Boolean(errors?.vendorId)}
                                      {...(errors?.vendorId && {
                                        helperText: errors?.vendorId.message
                                      })}
                                      label='Vendor'
                                    />
                                  )}
                                />
                              )}
                            />
                          </Box>
                          <IconButton
                            onClick={handleAddVendor}
                            size='small'
                            sx={{
                              width: 40,
                              height: 40,
                              flexShrink: 0,
                              borderRadius: `${radii.md}px`,
                              backgroundColor: colors.foreground,
                              color: colors.primaryForeground,
                              '&:hover': { backgroundColor: colors.foreground }
                            }}
                          >
                            <Icon fontSize='1.125rem' icon='tabler:plus' />
                          </IconButton>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          selected={date}
                          id='basic'
                          popperPlacement={popperPlacement}
                          onChange={date => setDate(date)}
                          fullWidth
                          customInput={<PickersComponent label='Tanggal Jatuh Tempo' />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box>
                          {vendorData?.email && (
                            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
                              {vendorData.email}
                            </Typography>
                          )}
                          {vendorData?.address && (
                            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
                              {vendorData.address}
                            </Typography>
                          )}
                          {vendorData?.phoneNumber && (
                            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
                              {vendorData.phoneNumber}
                            </Typography>
                          )}
                          {vendorData?.rankName && (
                            <Typography sx={{ fontSize: '0.8125rem', color: colors.mutedForeground }}>
                              {vendorData.rankName}
                            </Typography>
                          )}
                        </Box>
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
                        <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }}>
                          Total Purchase Order
                        </Typography>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: colors.foreground }}>
                          {priceFormatWIthCurrency(getValues('grandTotalVendor')) || 'Rp0'}
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
                          Karena Total Barter &gt; Total Purchase Order maka vendor perlu membayar senilai Grand Total
                          kepada Anda
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <SectionHeading number={2} title='Barang Purchase Order' />
                <Card elevation={0} sx={{ ...surfaceCardSx, mb: 4 }}>
                  <CardContent sx={{ p: 5 }}>
                    {fields.map((item, index) => (
                      <Box key={item.id} sx={index !== fields.length - 1 ? productRowSx : { mb: 4 }}>
                        <Grid container spacing={4} alignItems='flex-start'>
                          <Grid item xs={12} md={4}>
                            <Controller
                              name={`data[${index}].warehouseId`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <CustomAutocomplete
                                  options={masterDataWarehouse}
                                  id='autocomplete-custom'
                                  getOptionLabel={option => option.name || ''}
                                  onChange={(event, newValue) => {
                                    onChange(+newValue?.id)
                                  }}
                                  renderInput={params => (
                                    <CustomTextField
                                      value={value}
                                      {...params}
                                      fullWidth
                                      error={Boolean(errors?.data?.[index]?.warehouseId)}
                                      {...(errors?.data?.[index]?.warehouseId && {
                                        helperText: errors?.data?.[index]?.warehouseId.message
                                      })}
                                      label='Gudang Tujuan'
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={7}>
                            <Controller
                              name={`data[${index}].masterProductId`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <CustomAutocomplete
                                  key={item.id}
                                  options={OptionsGroup(listMasterProduct, 'category')}
                                  groupBy={option => option.category}
                                  id='autocomplete-grouped'
                                  getOptionLabel={option => option?.name || ''}
                                  value={listMasterProduct.find(product => product?.id == value) || null}
                                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                                  onChange={(event, newValue) => {
                                    onChange(+newValue?.id)
                                    checkDisabledTransform()
                                  }}
                                  renderInput={params => (
                                    <CustomTextField
                                      value={item.masterProductId}
                                      {...params}
                                      fullWidth
                                      error={Boolean(errors?.data?.[index]?.masterProductId)}
                                      {...(errors?.data?.[index]?.masterProductId && {
                                        helperText: errors?.data?.[index]?.masterProductId.message
                                      })}
                                      label='Produk'
                                    />
                                  )}
                                />
                              )}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                                <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }}>
                                  Transformasi
                                </Typography>
                                <IconButton
                                  onClick={() => handleTransformHarga(index)}
                                  disabled={getValues(`data[${index}].disabledTransform`)}
                                  size='small'
                                  aria-label='Transformasi Harga'
                                  sx={{
                                    border: `1px solid ${colors.border3}`,
                                    backgroundColor: colors.background,
                                    color: colors.foreground,
                                    '&:hover': { backgroundColor: colors.background }
                                  }}
                                >
                                  <Icon icon='lucide:arrow-left-right' fontSize='1.125rem' />
                                </IconButton>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={1}
                            sx={{ display: 'flex', justifyContent: { xs: 'flex-end', md: 'center' } }}
                          >
                            {fields.length > 1 && (
                              <IconButton
                                onClick={() => deleteItem(index)}
                                size='small'
                                sx={{ color: colors.destructive }}
                              >
                                <Icon icon='tabler:trash' fontSize='1.125rem' />
                              </IconButton>
                            )}
                          </Grid>
                        </Grid>

                        <Grid container spacing={4} alignItems='center' sx={{ mt: 0 }}>
                          <Grid item xs={6} md={2.5}>
                            <Controller
                              name={`data[${index}].unitId`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value, onChange } }) => (
                                <CustomAutocomplete
                                  key={item.id}
                                  options={listMasterUnit}
                                  id='autocomplete-grouped'
                                  getOptionLabel={option => option.name || ''}
                                  value={listMasterUnit.find(unit => unit.id === value) || null}
                                  onChange={(event, newValue) => {
                                    onChange(+newValue?.id)
                                    const selectedProduct = getValues(`data[${index}].masterProductId`)
                                    if (selectedProduct && newValue) {
                                      handleFetchDefaultBasePrice({
                                        productId: selectedProduct,
                                        unitId: newValue?.id,
                                        index,
                                        fieldName: 'data'
                                      })
                                    }
                                    checkDisabledTransform()
                                  }}
                                  renderInput={params => (
                                    <CustomTextField
                                      value={item.unitId}
                                      {...params}
                                      fullWidth
                                      error={Boolean(errors?.data?.[index]?.unitId)}
                                      {...(errors?.data?.[index]?.unitId && {
                                        helperText: errors?.data?.[index]?.unitId.message
                                      })}
                                      label='Unit'
                                    />
                                  )}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={6} md={2}>
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
                                    checkDisabledTransform()
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
                          <Grid item xs={6} md={3.3}>
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
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={6} md={1.2}>
                            <Typography sx={{ fontSize: '0.75rem', color: colors.mutedForeground, mb: 1 }}>
                              Modal Baru
                            </Typography>
                            <Controller
                              name={`data[${index}].isNewModal`}
                              control={control}
                              defaultValue={false}
                              render={({ field: { value, onChange } }) => (
                                <Checkbox checked={value} onChange={e => onChange(e.target.checked)} sx={{ p: 0 }} />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Controller
                              name={`data[${index}].subTotal`}
                              control={control}
                              rules={{ required: true }}
                              render={({ field: { value } }) => (
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

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 4
                      }}
                    >
                      <Button
                        variant='outlined'
                        color='secondary'
                        onClick={addMore}
                        startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
                        sx={{
                          color: colors.foreground,
                          borderColor: colors.border3,
                          boxShadow: shadows.xs,
                          '&:hover': { borderColor: colors.border3 }
                        }}
                      >
                        Tambah Produk
                      </Button>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          borderRadius: `${radii.full}px`,
                          border: `1px solid ${statusTokens.info.border}`,
                          backgroundColor: statusTokens.info.bg,
                          px: 3,
                          py: 1.5,
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: statusTokens.info.fg }}>
                          Total Purchase Order
                        </Typography>
                        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: statusTokens.info.fg }}>
                          {priceFormatWIthCurrency(getValues('grandTotalVendor')) || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <SectionHeading number={3} title='Barang Barter' />
                <Card elevation={0} sx={{ ...surfaceCardSx, mb: 4 }}>
                  <CardContent sx={{ p: 5 }}>
                    {barterFields.map((item, index) => {
                      const currentWarehouseId = getValues(`barterProduct[${index}].warehouseId`)
                      let listProductWarehouse = []
                      if (currentWarehouseId && dataWarehouseIds[currentWarehouseId]) {
                        listProductWarehouse = dataWarehouseIds[currentWarehouseId]
                      }
                      const selectedProductWarehouseId = getValues(`barterProduct[${index}].warehouseProductId`)
                      const selectedProduct = listProductWarehouse.find(
                        product => product.productWarehouseId === selectedProductWarehouseId
                      )
                      const tone = selectedProduct
                        ? stockTone(selectedProduct.quantity, selectedProduct.minimumStock)
                        : null

                      return (
                        <Box key={item.id} sx={index !== barterFields.length - 1 ? productRowSx : { mb: 4 }}>
                          <Grid container spacing={4} alignItems='flex-start'>
                            <Grid item xs={12} md={4}>
                              <Controller
                                name={`barterProduct[${index}].warehouseId`}
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <CustomAutocomplete
                                    options={masterDataWarehouse}
                                    id='autocomplete-custom'
                                    getOptionLabel={option => option.name || ''}
                                    onChange={(event, newValue) => {
                                      onChange(+newValue?.id)
                                      handleWarehouseSelect(+newValue?.id)
                                    }}
                                    value={masterDataWarehouse.find(option => option.id === value) || null}
                                    renderInput={params => (
                                      <CustomTextField
                                        {...params}
                                        fullWidth
                                        error={Boolean(errors?.barterProduct?.[index]?.warehouseId)}
                                        {...(errors?.barterProduct?.[index]?.warehouseId && {
                                          helperText: errors?.barterProduct?.[index]?.warehouseId.message
                                        })}
                                        label='Gudang Sumber*'
                                      />
                                    )}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={12} md={7}>
                              <Controller
                                name={`barterProduct[${index}].warehouseProductId`}
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <CustomAutocomplete
                                    key={item.id}
                                    options={OptionsGroup(listProductWarehouse, 'categoryName')}
                                    groupBy={option => option.categoryName}
                                    id='autocomplete-grouped'
                                    getOptionLabel={option => option.productName || ''}
                                    value={
                                      listProductWarehouse.find(product => product.productWarehouseId === value) || null
                                    }
                                    onChange={(event, newValue) => {
                                      onChange(+newValue?.productWarehouseId)
                                      const selectedProduct = listProductWarehouse.find(
                                        product => product.productWarehouseId === +newValue?.productWarehouseId
                                      )
                                      if (selectedProduct) {
                                        setValue(`barterProduct[${index}].qty`, selectedProduct.quantity)
                                        setValue(
                                          `barterProduct[${index}].masterProductId`,
                                          selectedProduct.masterProductId
                                        )
                                        setValue(`barterProduct[${index}].rackName`, selectedProduct.rackName)
                                        setValue(`barterProduct[${index}].unitName`, selectedProduct.unitName)
                                        setHelperTextChanges(!helperTextChanges)
                                        handleFetchDefaultBasePrice({
                                          productId: selectedProduct.masterProductId,
                                          unitId: selectedProduct?.masterUnitId,
                                          index,
                                          fieldName: 'barterProduct'
                                        })
                                        handleResetValueAndForm({
                                          fieldName: 'barterProduct',
                                          index
                                        })
                                        handleFetchDefaultBaseModal({
                                          productId: selectedProduct.masterProductId,
                                          unitId: selectedProduct.masterUnitId,
                                          index,
                                          fieldName: 'barterProduct'
                                        })
                                      } else {
                                        setValue(`barterProduct[${index}].qty`, '')
                                        setValue(`barterProduct[${index}].masterProductId`, '')
                                        setValue(`barterProduct[${index}].rackName`, '')
                                      }
                                    }}
                                    renderInput={params => (
                                      <CustomTextField
                                        value={item.warehouseProductId}
                                        {...params}
                                        fullWidth
                                        error={Boolean(errors?.barterProduct?.[index]?.warehouseProductId)}
                                        {...(errors?.barterProduct?.[index]?.warehouseProductId && {
                                          helperText: errors?.barterProduct?.[index]?.warehouseProductId.message
                                        })}
                                        label='Produk*'
                                      />
                                    )}
                                  />
                                )}
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
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
                                {selectedProduct && (
                                  <Chip
                                    size='small'
                                    label={`Stok: ${selectedProduct.quantity}`}
                                    sx={toneChipSx(tone)}
                                  />
                                )}
                                {getValues(`barterProduct[${index}].quantity`) > 0 && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
                                    <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground }}>
                                      Transformasi
                                    </Typography>
                                    <IconButton
                                      onClick={() => onSelectTransform(index)}
                                      size='small'
                                      aria-label='Transformasi Produk'
                                      sx={{
                                        border: `1px solid ${colors.border3}`,
                                        backgroundColor: colors.background,
                                        color: colors.foreground,
                                        '&:hover': { backgroundColor: colors.background }
                                      }}
                                    >
                                      <Icon icon='lucide:arrow-left-right' fontSize='1.125rem' />
                                    </IconButton>
                                  </Box>
                                )}
                              </Box>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={1}
                              sx={{ display: 'flex', justifyContent: { xs: 'flex-end', md: 'center' } }}
                            >
                              <IconButton
                                onClick={() => removeBarterProduct(index)}
                                size='small'
                                sx={{ color: colors.destructive }}
                              >
                                <Icon icon='tabler:trash' fontSize='1.125rem' />
                              </IconButton>
                            </Grid>
                          </Grid>

                          <Grid container spacing={4} sx={{ mt: 0 }}>
                            <Grid item xs={6} md={3}>
                              <Controller
                                name={`barterProduct[${index}].quantity`}
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                  <CustomTextField
                                    fullWidth
                                    label='Kuantiti'
                                    value={value}
                                    onChange={e => {
                                      const newQuantity = +e.target.value
                                      const currentPrice = formBarter[index]?.price || 0
                                      const newSubTotal = newQuantity * currentPrice

                                      onChange(newQuantity || '')
                                      trigger(`barterProduct[${index}].quantity`)
                                      if (parseInt(newSubTotal, 10) > 0) {
                                        setHelperTextChanges(!helperTextChanges)
                                        setValue(`barterProduct[${index}].subTotal`, newSubTotal)
                                      }
                                      if (
                                        formBarter[index]?.quantity &&
                                        formBarter[index]?.price &&
                                        parseInt(formBarter[index]?.quantity, 10) > 0
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
                            <Grid item xs={6} md={3}>
                              <Controller
                                name={`barterProduct[${index}].modal`}
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
                                        fieldName: 'barterProduct',
                                        setValue,
                                        formStateField: formBarter,
                                        onChange
                                      })
                                    }}
                                    error={Boolean(errors?.barterProduct?.[index]?.modal)}
                                    {...(errors?.barterProduct?.[index]?.modal && {
                                      helperText: errors?.barterProduct?.[index]?.modal.message
                                    })}
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Controller
                                name={`barterProduct[${index}].subTotal`}
                                control={control}
                                render={({ field: { value } }) => (
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
                      )
                    })}

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 4
                      }}
                    >
                      <Button
                        variant='outlined'
                        color='secondary'
                        onClick={() =>
                          appendBarterProduct({
                            warehouseProductId: '',
                            price: '',
                            quantity: '',
                            subTotal: '',
                            warehouseId: '',
                            modal: ''
                          })
                        }
                        startIcon={<Icon icon='tabler:plus' fontSize='1rem' />}
                        sx={{
                          color: colors.foreground,
                          borderColor: colors.border3,
                          boxShadow: shadows.xs,
                          '&:hover': { borderColor: colors.border3 }
                        }}
                      >
                        Tambah Produk
                      </Button>
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
                          {priceFormatWIthCurrency(getValues('grandTotalBarter')) || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <FormActionBar
              onCancel={() => router.back()}
              loading={loadingCreatePurchaseOrder}
              submitLabel='Submit'
              cancelLabel='Cancel'
              loadingLabel='Submitting...'
            />
          </Grid>
        </Grid>
      </form>
      {openModalTransformation && (
        <ModalTransformProductSalesOrder
          open={openModalTransformation}
          setOpen={setOpenModalTransformation}
          warehouseProductId={transformationData?.warehouseProductId}
          quantity={transformationData?.quantity}
          setValue={setValue}
          getValues={getValues}
          indexForm={transformationData?.indexForm}
          update={update}
          warehouseId={warehouseId}
          handleTransformProductUpdate={handleTransformProductUpdate}
          setDataWarehouseIds={setDataWarehouseIds}
        />
      )}
      {openModalVendor && (
        <ModalAddMasterVendor open={openModalVendor} setOpen={setOpenModalVendor} typeModal={'ADD'} />
      )}
      {openModalTransformPrice && (
        <ModalTransformPrice
          open={openModalTransformPrice}
          setOpen={setOpenModalTransformPrice}
          data={transformPriceData}
          setValueForm={setValue}
          handleCalculate={calculateTotals}
          savedData={lastTransformData[transformPriceData.noIndex] || {}}
          handleSave={(index, data) => handleSaveTransformData(index, data)}
        />
      )}
    </>
  )
}
