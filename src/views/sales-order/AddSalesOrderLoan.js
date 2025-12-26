import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, Checkbox, CircularProgress, Divider, FormControlLabel, Grid, IconButton, Typography, useTheme } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { fetchInvoiceListProductByWarehouseId } from 'src/store/apps/delivery-order'
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import OptionsGroup from 'src/helpers/groupedInput'
import { fetchMasterDataCustomer } from 'src/store/apps/master/customer'
import PickersComponent from '../forms/form-elements/pickers/PickersCustomInput'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { priceFormat } from 'src/helpers/priceFormatter'
import { fetchOneMasterDataProductPrice } from 'src/store/apps/master/product-price'
import { fetchOneMasterDataModal } from 'src/store/apps/master/modal'
import { Box } from '@mui/system'
import ModalAddMasterCustomer from '../master/customer/ModalAddMasterCustomer'
import { UseAuth } from 'src/hooks/useAuth'
import { returnFormatDateIsoString } from 'src/helpers/formatDate'
import { createSalesOrder } from 'src/store/apps/sales-order'

export default function AddSalesOrderLoan({}) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { user } = UseAuth()

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [date, setDate] = useState(new Date())
  const [shippingDate, setShippingDate] = useState(new Date())
  const [customerData, setCustomerData] = useState({})
  const [openModalCustomer, setOpenModalCustomer] = useState(false)
  const [warehouseId, setWarehouseId] = useState()
  const [helperTextChanges, setHelperTextChanges] = useState(false)
  const [dataWarehouseIds, setDataWarehouseIds] = useState({})

  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
  const { data: masterCustomer } = useSelector(state => state.masterCustomer)
  const { loadingCreateSalesOrder } = useSelector(state => state.salesOrder)

  const schema = yup.object({
    customerId: yup.string().required('Customer harus diisi'),
    grandTotal: yup.number().typeError('Grand Total harus ada'),
    grandTotalCustomer: yup.number().typeError('Total Sales order harus ada'),
    grandTotalBarter: yup.number().typeError('Total Barter harus ada'),
    notes: yup.string().optional(),
    shippingDate: yup.date().typeError('Tanggal Pengiriman harus diisi'),
    data: yup.array().of(
      yup.object({
        warehouseId: yup.number().typeError('Gudang asal harus ada'),
        warehouseProductId: yup.number().typeError('Id product warehouse harus diisi'),
        price: yup.number().typeError('Price product harus diisi'),
        quantity: yup
          .number()
          .typeError('Kuantiti harus diisi')
          .test('is-greater-than-zero', 'Jumlah stok minimal harus lebih dari 0', function (value) {
            const num = Number(value)
            return num >= 0
          }),
        subTotal: yup.number().typeError('Sub Total Product harus diisi'),
        modal: yup.number().typeError('Harga Modal Product harus diisi')
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
            warehouseProductId: yup.number(),
            warehouseId: yup.number(),
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
    getValues,
    watch,
    clearErrors,
    trigger
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // Barang Sales Order Loan
  const { fields, remove, append, update } = useFieldArray({
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
    setError(`data[${lastIndex}].warehouseProductId`, {
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
        customerId: +data.customerId,
        grandTotal: data.grandTotal,
        grandTotalCustomer: data.grandTotalCustomer,
        grandTotalBarter: data.grandTotalBarter,
        dueDate: date.toLocaleDateString('en-GB'),
        shippingDate: returnFormatDateIsoString(shippingDate),
        notes: data.notes,
        listProduct: listItems,
        listBarterProduct: listBarter,
        isLoanStockSO: true
      }
      dispatch(createSalesOrder({ data: sendData, router }))
    }
  }

  const addMore = () => {
    append({ warehouseProductId: '', price: '', quantity: '', subTotal: '', warehouseId: '', modal: '' })
  }

  const deleteItem = itemIndex => {
    remove(itemIndex)
  }

  const calculateTotals = () => {
    // Calculate Sales Order total
    const updatedFormField = getValues('data') // Fetch latest form values
    const updatedFormBarter = getValues('barterProduct')

    const salesOrderTotal = updatedFormField?.reduce((acc, item) => {
      return acc + Number(item.quantity) * Number(item.price)
    }, 0)

    // Calculate Barter Product total
    const barterTotal = updatedFormBarter?.reduce((acc, item) => {
      return acc + Number(item.quantity) * Number(item.price)
    }, 0)

    // Calculate grand total
    setValue('grandTotal', salesOrderTotal - barterTotal) // Update grand total
    setValue('grandTotalCustomer', salesOrderTotal) // Update total sales order
    setValue('grandTotalBarter', barterTotal) // Update total barter
  }

  useEffect(() => {
    calculateTotals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formField, formBarter])

  useEffect(() => {
    if (fields.length === 0) {
      append({
        warehouseProductId: '',
        price: '',
        quantity: '',
        subTotal: '',
        warehouseId: '',
        modal: ''
      })
    }
    dispatch(fetchMasterDataWarehouse())
    dispatch(fetchMasterDataCustomer())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // Set WarehouseId and Fetch data list product by warehouse Id
  const handleWarehouseSelect = newWarehouseId => {
    // Don't proceed if the warehouseId is null or undefined
    if (!newWarehouseId) return

    // Update the selected warehouseId
    setWarehouseId(newWarehouseId)

    // Check if data for the selected warehouseId already exists
    if (!dataWarehouseIds[newWarehouseId]) {
      // Fetch data only if it doesn't exist in the state
      dispatch(fetchInvoiceListProductByWarehouseId(newWarehouseId))
        .then(response => {
          if (response && response.payload) {
            // Initialize with empty array if data is falsy
            const productData = response.payload.data || []

            setDataWarehouseIds(prevState => ({
              ...prevState,
              [newWarehouseId]: productData // Store the fetched data by warehouseId
            }))
          }
        })
        .catch(error => {
          console.error('Failed to fetch data:', error)
          // Initialize with empty array on error
          setDataWarehouseIds(prevState => ({
            ...prevState,
            [newWarehouseId]: []
          }))
        })
    }
  }

  const titleProductInfo = index => {
    const infos = {
      titleProduct: `Rack: ${getValues(`data[${index}].rackName`) || '-'} | Unit: ${getValues(`data[${index}].unitName`) || '-'
        }`,
      titleQuantity: `QTY: ${getValues(`data[${index}].qty`) || '-'}`
    }
    return infos
  }

  const titleBarterInfo = index => {
    const infos = {
      titleProduct: `Rack: ${getValues(`barterProduct[${index}].rackName`) || '-'} | Unit: ${getValues(`barterProduct[${index}].unitName`) || '-'
        }`,
      titleQuantity: `QTY: ${getValues(`barterProduct[${index}].qty`) || '-'}`
    }
    return infos
  }

  const isAdmin = useMemo(() => {
    return user?.roleId === 1
  }, [user])

  const handleAddCustomer = () => {
    setOpenModalCustomer(true)
  }

  useEffect(() => {
    // For transformation product
  }, [helperTextChanges, dataWarehouseIds])

  const handlePriceChange = ({ event, index, fieldName, setValue, formStateField, onChange, isCalculation }) => {
    const input = event.target
    const cursorPosition = input.selectionStart // Save cursor position
    const rawValue = input.value.replace(/\D/g, '') // Remove non-digit characters
    const formattedValue = priceFormat(+rawValue)

    // Determine the new cursor position after formatting
    const unformattedBeforeCursor = input.value.slice(0, cursorPosition).replace(/\D/g, '') // Remove formatting before the cursor
    const newCursorIndex = unformattedBeforeCursor.length

    onChange(rawValue)
    // Update the input value and adjust the cursor position
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
                      name={`customerId`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomAutocomplete
                          options={masterCustomer}
                          id='autocomplete-custom'
                          sx={{ flexGrow: 1 }}
                          getOptionLabel={option => option.name || ''}
                          onChange={(event, newValue) => {
                            onChange(+newValue?.id || '')
                            setCustomerData(newValue)
                          }}
                          renderInput={params => (
                            <CustomTextField
                              value={value}
                              {...params}
                              error={Boolean(errors?.customerId)}
                              {...(errors?.customerId && {
                                helperText: errors?.customerId.message
                              })}
                              label='Customer'
                            />
                          )}
                        />
                      )}
                    />
                    <Button
                      onClick={handleAddCustomer}
                      variant='contained'
                      sx={{
                        ml: 2,
                        mt: errors?.customerId ? 0.5 : 4.5
                      }}
                    >
                      <Icon fontSize='1.125rem' icon='tabler:plus' />
                    </Button>
                  </Box>

                  {/* Customer Data Info */}
                  <Box sx={{ textAlign: 'left', width: '100%', mt: 2 }}>
                    <Typography sx={{ color: 'text.secondary' }}>{customerData?.email}</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{customerData?.address}</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{customerData?.phoneNumber}</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>{customerData?.rankName}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Card */}
          <Grid item xs={12} md={6} sx={{ textAlign: 'left' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Grid container spacing={6} >
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      selected={date}
                      id='basic'
                      popperPlacement={popperPlacement}
                      onChange={date => setDate(date)}
                      fullWidth
                      customInput={<PickersComponent label='Tanggal Jatuh Tempo' />}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <DatePicker
                      selected={shippingDate}
                      id='basic'
                      popperPlacement={popperPlacement}
                      onChange={date => setShippingDate(date)}
                      fullWidth
                      customInput={<PickersComponent
                        label='Tanggal Pengiriman' />}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <Typography fontSize={20} sx={{ paddingTop: 2, ml: 5, mt: 3 }}>
                Barang Sales Order
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
                                handleWarehouseSelect(+newValue?.id)
                              }}
                              value={masterDataWarehouse.find(option => option.id === value) || null}
                              renderInput={params => (
                                <CustomTextField
                                  {...params}
                                  sx={{ zIndex: 0 }}
                                  error={Boolean(errors?.data?.[index]?.warehouseId)}
                                  {...(errors?.data?.[index]?.warehouseId && {
                                    helperText: errors?.data?.[index]?.warehouseId.message
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
                          name={`data[${index}].warehouseProductId`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => {
                            const currentWarehouseId = getValues(`data[${index}].warehouseId`)
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
                                      setValue(`data[${index}].qty`, selectedProduct.quantity)
                                      setValue(`data[${index}].masterProductId`, selectedProduct.masterProductId)
                                      setValue(`data[${index}].rackName`, selectedProduct.rackName)
                                      setValue(`data[${index}].unitName`, selectedProduct.unitName)
                                      setHelperTextChanges(!helperTextChanges)
                                      // Fetch price base on selected product
                                      handleFetchDefaultBasePrice({
                                        productId: selectedProduct.masterProductId,
                                        unitId: selectedProduct.masterUnitId,
                                        index,
                                        fieldName: 'data'
                                      })
                                      // Fetch modal base on selected product
                                      handleFetchDefaultBaseModal({
                                        productId: selectedProduct.masterProductId,
                                        unitId: selectedProduct.masterUnitId,
                                        index,
                                        fieldName: 'data'
                                      })
                                      handleResetValueAndForm({
                                        fieldName: 'data',
                                        index
                                      })
                                    } else {
                                      setValue(`data[${index}].qty`, '')
                                      setValue(`data[${index}].masterProductId`, '')
                                      setValue(`data[${index}].rackName`, '')
                                    }
                                  }}
                                  renderInput={params => (
                                    <CustomTextField
                                      value={item.warehouseProductId}
                                      {...params}
                                      sx={{ zIndex: 0 }}
                                      error={Boolean(errors?.data?.[index]?.warehouseProductId)}
                                      {...(errors?.data?.[index]?.warehouseProductId && {
                                        helperText: errors?.data?.[index]?.warehouseProductId.message
                                      })}
                                      label='Produk'
                                    />
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
                      <Grid key={getValues(`data[${index}].warehouseProductId`)} item xs={5} md={isAdmin ? 1.5 : 3}>
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
                                  // to trigger transform
                                  trigger(`data[${index}].quantity`)
                                  if (parseInt(newSubTotal, 10) > 0) {
                                    setHelperTextChanges(!helperTextChanges)
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
                                sx={{ display: 'block' }}
                                error={Boolean(errors?.data?.[index]?.quantity)}
                                {...(errors?.data?.[index]?.quantity && {
                                  helperText: errors?.data?.[index]?.quantity.message
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
                      {isAdmin && (
                        <Grid item xs={5} md={2}>
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
                                disabled
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
                                sx={{ display: 'block', zIndex: 0 }}
                                error={Boolean(errors?.data?.[index]?.modal)}
                                {...(errors?.data?.[index]?.modal && {
                                  helperText: errors?.data?.[index]?.modal.message
                                })}
                              />
                            )}
                          />
                        </Grid>
                      )}
                      <Grid item xs={5} md={2}>
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
                              sx={{ display: 'block', zIndex: 0 }}
                              error={Boolean(errors?.data?.[index]?.subTotal)}
                              {...(errors?.data?.[index]?.subTotal && {
                                helperText: errors?.data?.[index]?.subTotal.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={1} md={0.5} sx={{ marginTop: '1.2rem', ml: -4 }}>
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
                  <Grid item xs={12} md={9.5} sx={{ marginTop: '1rem' }}>
                    <Button onClick={addMore} startIcon={<Icon icon='tabler:plus' />}>
                      Tambahkan produk
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Controller
                      name={`grandTotalCustomer`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Total Sales Order'
                          value={value ? priceFormat(value) : '0'}
                          type='text'
                          disabled
                          sx={{ display: 'block' }}
                          error={Boolean(errors?.grandTotalCustomer)}
                          {...(errors?.grandTotalCustomer && {
                            helperText: errors?.grandTotalCustomer.message
                          })}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
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
                              renderInput={params => (
                                <CustomTextField
                                  value={value}
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
                      <Grid item xs={12} md={2} sx={{ marginTop: '1rem' }}>
                        <Controller
                          name={`barterProduct[${index}].isNewModal`}
                          control={control}
                          defaultValue={false}
                          render={({ field: { value, onChange } }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={value}
                                  onChange={e => onChange(e.target.checked)}
                                />
                              }
                              label='Modal Baru'
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
                          // rules={{ required: true }}
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

                                      // Fetch price base on selected product
                                      handleFetchDefaultBasePrice({
                                        productId: selectedProduct.masterProductId,
                                        unitId: selectedProduct.masterUnitId,
                                        index,
                                        fieldName: 'barterProduct'
                                      })
                                      handleResetValueAndForm({
                                        fieldName: 'barterProduct',
                                        index
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
                                      sx={{ zIndex: 0 }}
                                      error={Boolean(errors?.barterProduct?.[index]?.warehouseProductId)}
                                      {...(errors?.barterProduct?.[index]?.warehouseProductId && {
                                        helperText: errors?.barterProduct?.[index]?.warehouseProductId.message
                                      })}
                                      label='Produk'
                                    />
                                  )}
                                />
                                <Typography variant='body2' color='textSecondary' sx={{ marginTop: '4px' }}>
                                  {titleBarterInfo(index).titleProduct}
                                </Typography>
                              </div>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={5} md={1.5}>
                        <Controller
                          name={`barterProduct[${index}].quantity`}
                          control={control}
                          // rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <div>
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
                                sx={{ display: 'block' }}
                                error={Boolean(errors?.barterProduct?.[index]?.quantity)}
                                {...(errors?.barterProduct?.[index]?.quantity && {
                                  helperText: errors?.barterProduct?.[index]?.quantity.message
                                })}
                              />
                              <Typography variant='body2' color='textSecondary'>
                                {titleBarterInfo(index).titleQuantity}
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
                      <Grid item xs={5} md={4}>
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
                      <Grid item xs={0.5} md={0.5} sx={{ marginTop: '1.2rem', ml: -4 }}>
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
                  <Grid item xs={12} md={9.5} sx={{ marginTop: '1rem' }}>
                    <Button
                      onClick={() =>
                        appendBarterProduct({
                          warehouseProductId: '',
                          price: '',
                          quantity: '',
                          subTotal: '',
                          warehouseId: ''
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
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={12} md={9.5} sx={{ marginTop: '1rem' }}></Grid>
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
          <Grid
            container
            sx={{ paddingLeft: '25px', marginTop: '20px' }}
            display='flex'
            justifyContent='flex-end'
            gap={6}
          >
            {
              loadingCreateSalesOrder ? (
                <Button variant='contained' disabled>
                  <CircularProgress size={20} sx={{ color: 'white', mr: 2 }} />
                  Submitting...
                </Button>
              ) : (
                <>
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
                </>
              )
            }
          </Grid>
        </Grid>
      </form>
      {openModalCustomer && (
        <ModalAddMasterCustomer open={openModalCustomer} setOpen={setOpenModalCustomer} typeModal={'ADD'} />
      )}
    </>
  )
}
