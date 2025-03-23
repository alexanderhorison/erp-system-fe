import { useTheme } from '@emotion/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, IconButton, Grid, Typography, Divider } from '@mui/material'
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
import { Box } from '@mui/system'
import * as yup from 'yup'
import Icon from 'src/@core/components/icon'
import OptionsGroup from 'src/helpers/groupedInput'
import { priceFormat } from 'src/helpers/priceFormatter'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'
import { fetchOneMasterDataProductPrice } from 'src/store/apps/master/product-price'
import ModalTransformProductSalesOrder from '../sales-order/ModalTransformProductSalesOrder'
import { createPurchaseOrder } from 'src/store/apps/purchase-order'
import ModalAddMasterVendor from '../master/vendor/ModalAddMasterVendor'
import ModalTransformPrice from './ModalTransformPrice'
import { fetchOneMasterDataModal } from 'src/store/apps/master/modal'

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
  const { dataListProductWarehouse: listProductBarter } = useSelector(state => state.deliveryOrder)
  const { data: listMasterUnit } = useSelector(state => state.unit)

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
        disabledTransform: yup.boolean().default(true)
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
    setError(`data[${lastIndex}].masterProductId`, {
      type: 'duplicate',
      message: `Produk dan Satuan sudah dipilih`
    })
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
      setError(`barterProduct[${lastIndex}].warehouseProductId`, {
        type: 'duplicate',
        message: `Produk dan Satuan sudah dipilih`
      })
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
  }, [dispatch])

  useEffect(() => {
    // For transformation product
  }, [helperTextChanges, dataWarehouseIds])

  const titleProductInfo = index => {
    const infos = {
      titleProduct: `Rack: ${getValues(`barterProduct[${index}].rackName`) || '-'} | Unit: ${
        getValues(`barterProduct[${index}].unitName`) || '-'
      }`,
      titleQuantity: `QTY: ${getValues(`barterProduct[${index}].qty`) || '-'}`,
      titleTransformation: getValues(`barterProduct[${index}].quantity`) > 0 ? '| Transformasi Produk' : ''
    }
    return infos
  }

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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          {/* left Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display='flex' alignItems='center' flexDirection='column'>
                  <Box display='flex' alignItems='center' width='100%' mb={2}>
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
                          sx={{ flexGrow: 1 }}
                          renderInput={params => (
                            <CustomTextField
                              value={value}
                              {...params}
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
                    <Button
                      onClick={handleAddVendor}
                      variant='contained'
                      sx={{
                        ml: 2,
                        mt: errors?.vendorId ? 0.5 : 4.5
                      }}
                    >
                      <Icon fontSize='1.125rem' icon='tabler:plus' />
                    </Button>
                  </Box>
                  <Box sx={{ textAlign: 'left', width: '100%', mt: 2 }}>
                    <Typography sx={{ color: 'text.secondary' }}>{vendorData?.email}</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{vendorData?.address}</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{vendorData?.phoneNumber}</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{vendorData?.rankName}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Right Card */}
          <Grid item xs={12} md={6} sx={{ textAlign: 'left' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <DatePicker
                  selected={date}
                  id='basic'
                  popperPlacement={popperPlacement}
                  onChange={date => setDate(date)}
                  fullWidth
                  customInput={<PickersComponent label='Tanggal Jatuh Tempo' />}
                />
              </CardContent>
            </Card>
          </Grid>
          {/* BODY PURCHASE ORDER */}
          <Grid item xs={12}>
            <Card>
              <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 3 }}>
                Barang Purchase Order
              </Typography>
              {fields.map((item, index) => (
                <React.Fragment key={item.id}>
                  <CardContent>
                    <Grid container spacing={6}>
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
                                  sx={{ zIndex: 0 }}
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
                      <Grid item xs={12} md={3}>
                        <Button
                          variant='contained'
                          sx={{
                            marginTop: '1rem',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleTransformHarga(index)}
                          disabled={getValues(`data[${index}].disabledTransform`)}
                        >
                          Transformasi Harga
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container spacing={6} sx={{ marginTop: 1 }}>
                      <Grid item xs={12} md={3}>
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
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                  <Box display='flex' alignItems='center' mb={0}>
                                    <Box
                                      component='span'
                                      sx={{
                                        fontWeight: '',
                                        fontSize: '0.85rem',
                                        mr: 1
                                      }}
                                    >
                                      {`Produk `}
                                    </Box>
                                  </Box>
                                  <CustomTextField
                                    value={item.masterProductId}
                                    {...params}
                                    sx={{ zIndex: 0 }}
                                    error={Boolean(errors?.data?.[index]?.masterProductId)}
                                    {...(errors?.data?.[index]?.masterProductId && {
                                      helperText: errors?.data?.[index]?.masterProductId.message
                                    })}
                                  />
                                </Box>
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
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
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                  <Box display='flex' alignItems='center' mb={0}>
                                    <Box
                                      component='span'
                                      sx={{
                                        fontWeight: '',
                                        fontSize: '0.85rem',
                                        mr: 1
                                      }}
                                    >
                                      {`Unit `}
                                    </Box>
                                  </Box>
                                  <CustomTextField
                                    value={item.unitId}
                                    {...params}
                                    sx={{ zIndex: 0 }}
                                    error={Boolean(errors?.data?.[index]?.unitId)}
                                    {...(errors?.data?.[index]?.unitId && {
                                      helperText: errors?.data?.[index]?.unitId.message
                                    })}
                                  />
                                </Box>
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={3} md={1.5}>
                        <Controller
                          name={`data[${index}].quantity`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <div>
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
                                sx={{ display: 'block' }}
                                error={Boolean(errors?.data?.[index]?.quantity)}
                                {...(errors?.data?.[index]?.quantity && {
                                  helperText: errors?.data?.[index]?.quantity.message
                                })}
                              />
                            </div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={2}>
                        <Controller
                          name={`data[${index}].price`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Price'
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
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.data?.[index]?.price)}
                              {...(errors?.data?.[index]?.price && {
                                helperText: errors?.data?.[index]?.price.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={2.5}>
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
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.data?.[index]?.subTotal)}
                              {...(errors?.data?.[index]?.subTotal && {
                                helperText: errors?.data?.[index]?.subTotal.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={1} md={1} sx={{ marginTop: '1.2rem' }}>
                        {fields.length > 1 && (
                          <IconButton onClick={() => deleteItem(index)} sx={{ color: 'text.primary' }}>
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                </React.Fragment>
              ))}
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={12} md={9} sx={{ marginTop: '1rem' }}>
                    <Button onClick={addMore} startIcon={<Icon icon='tabler:plus' />}>
                      Tambahkan produk
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Controller
                      name={`grandTotalVendor`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Total Purchase Order'
                          value={value ? priceFormat(value) : '0'}
                          type='text'
                          disabled
                          sx={{ display: 'block', zIndex: 0 }}
                          error={Boolean(errors?.grandTotalVendor)}
                          {...(errors?.grandTotalVendor && {
                            helperText: errors?.grandTotalVendor.message
                          })}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* BODY PURCHASE ORDER BARTER */}
          <Grid item xs={12}>
            <Card>
              <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 3 }}>
                Barang Barter
              </Typography>
              {barterFields.map((item, index) => (
                <React.Fragment key={item.id}>
                  <CardContent>
                    <Grid container spacing={6}>
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
                                  error={Boolean(errors?.barterProduct?.[index]?.warehouseId)}
                                  {...(errors?.barterProduct?.[index]?.warehouseId && {
                                    helperText: errors?.barterProduct?.[index]?.warehouseId.message
                                  })}
                                  label='Gudang Sumber'
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={6} sx={{ marginTop: 1 }}>
                      <Grid item xs={12} md={4}>
                        <Controller
                          name={`barterProduct[${index}].warehouseProductId`}
                          control={control}
                          render={({ field: { value, onChange } }) => {
                            const currentWarehouseId = getValues(`barterProduct[${index}].warehouseId`)
                            let listProductWarehouse = []

                            if (currentWarehouseId && dataWarehouseIds[currentWarehouseId]) {
                              listProductWarehouse = dataWarehouseIds[currentWarehouseId]
                            }

                            return (
                              <div>
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
                                      // Fetch price base on selected product
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
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                      <Box display='flex' alignItems='center' mb={0}>
                                        <Box
                                          component='span'
                                          sx={{
                                            fontWeight: '',
                                            fontSize: '0.85rem',
                                            mr: 1
                                          }}
                                        >
                                          {`Produk `}
                                        </Box>
                                        <Box
                                          component='span'
                                          sx={{
                                            fontSize: '0.85rem',
                                            marginTop: '',
                                            cursor: 'pointer',
                                            ':hover': { color: 'blue' }
                                          }}
                                          onClick={() => onSelectTransform(index)}
                                        >
                                          {titleProductInfo(index).titleTransformation}
                                        </Box>
                                      </Box>
                                      <CustomTextField
                                        value={item.warehouseProductId}
                                        {...params}
                                        sx={{ zIndex: 0 }}
                                        error={Boolean(errors?.barterProduct?.[index]?.warehouseProductId)}
                                        {...(errors?.barterProduct?.[index]?.warehouseProductId && {
                                          helperText: errors?.barterProduct?.[index]?.warehouseProductId.message
                                        })}
                                      />
                                    </Box>
                                  )}
                                />
                                <Typography variant='body2' color='textSecondary' sx={{ marginTop: '4px' }}>
                                  {titleProductInfo(index).titleProduct}
                                </Typography>
                              </div>
                            )
                          }}
                        />
                      </Grid>
                      <Grid key={getValues(`barterProduct[${index}].warehouseProductId`)} item xs={5} md={1}>
                        <Controller
                          name={`barterProduct[${index}].quantity`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <div>
                              <CustomTextField
                                fullWidth
                                label='Kuantiti'
                                value={value}
                                onChange={e => {
                                  const newQuantity = +e.target.value
                                  const currentPrice = formBarter[index]?.price || 0
                                  const newSubTotal = newQuantity * currentPrice

                                  onChange(newQuantity || '')
                                  // to trigger transform
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
                                sx={{ display: 'block' }}
                                error={Boolean(errors?.barterProduct?.[index]?.quantity)}
                                {...(errors?.barterProduct?.[index]?.quantity && {
                                  helperText: errors?.barterProduct?.[index]?.quantity.message
                                })}
                              />
                              <Typography variant='body2' color='textSecondary'>
                                {titleProductInfo(index).titleQuantity}
                              </Typography>
                            </div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={2}>
                        <Controller
                          name={`barterProduct[${index}].price`}
                          control={control}
                          // rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Price'
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
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.barterProduct?.[index]?.price)}
                              {...(errors?.barterProduct?.[index]?.price && {
                                helperText: errors?.barterProduct?.[index]?.price.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={2}>
                        <Controller
                          name={`barterProduct[${index}].modal`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value } }) => (
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
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.barterProduct?.[index]?.modal)}
                              {...(errors?.barterProduct?.[index]?.modal && {
                                helperText: errors?.barterProduct?.[index]?.modal.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={2}>
                        <Controller
                          name={`barterProduct[${index}].subTotal`}
                          control={control}
                          // rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Sub Total'
                              value={priceFormat(value || 0)}
                              disabled
                              type='text'
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.barterProduct?.[index]?.subTotal)}
                              {...(errors?.barterProduct?.[index]?.subTotal && {
                                helperText: errors?.barterProduct?.[index]?.subTotal.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={1} md={1} sx={{ marginTop: '1.2rem' }}>
                        <IconButton onClick={() => removeBarterProduct(index)} sx={{ color: 'text.primary' }}>
                          <Icon icon='tabler:trash' />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                </React.Fragment>
              ))}
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={12} md={9} sx={{ marginTop: '1rem' }}>
                    <Button
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
                      startIcon={<Icon icon='tabler:plus' />}
                    >
                      Tambahkan produk
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Controller
                      name={`grandTotalBarter`}
                      control={control}
                      // rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Total Barter'
                          value={value ? priceFormat(value) : '0'}
                          type='text'
                          disabled
                          sx={{ display: 'block' }}
                          error={Boolean(errors?.grandTotalBarter)}
                          {...(errors?.grandTotalBarter && {
                            helperText: errors?.grandTotalBarter.message
                          })}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* GRAND TOTAL */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={12} md={9} sx={{ marginTop: '1rem' }}></Grid>
                  <Grid item xs={12} md={2}>
                    <Controller
                      name={`grandTotal`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Grand Total'
                          value={value ? priceFormat(value) : '0'}
                          type='text'
                          disabled
                          sx={{ display: 'block' }}
                          error={Boolean(errors?.grandTotal)}
                          {...(errors?.grandTotal && {
                            helperText: errors?.grandTotal.message
                          })}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`notes`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField
                        multiline
                        rows={3}
                        fullWidth
                        label='Catatan'
                        placeholder={'Catatan...'}
                        value={value}
                        onChange={e => {
                          onChange(e.target.value)
                        }}
                        type='text'
                        sx={{ display: 'block' }}
                      />
                    )}
                  />
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* BUTTON SUBMIT */}
          <Grid
            container
            sx={{ paddingLeft: '25px', marginTop: '20px' }}
            display='flex'
            justifyContent='flex-end'
            gap={6}
          >
            <Button
              variant='tonal'
              color='secondary'
              onClick={() => router.back()}
              startIcon={<Icon icon='tabler:x' />}
            >
              Cancel
            </Button>
            <Button variant='contained' type='submit' startIcon={<Icon icon='tabler:send' />}>
              Submit
            </Button>
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
