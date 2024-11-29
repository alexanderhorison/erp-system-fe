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
        subTotal: yup.number().typeError('Sub Total Product harus diisi')
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
            subTotal: yup.number().typeError('Sub Total Product harus diisi').required('Sub Total barter harus diisi')
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
            subTotal: yup.number()
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
    watch
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
    append({ warehouseId: '', masterProductId: '', unitId: '', price: '', quantity: '', subTotal: '' })
  }

  const deleteItem = itemIndex => {
    remove(itemIndex)
  }

  // ** Calculate Totals
  const calculateTotals = () => {
    // Calculate Purchase Order total
    const purchaseOrderTotal = formField?.reduce((acc, item) => {
      return acc + Number(item.quantity) * Number(item.price)
    }, 0)

    // Calculate Barter Product total
    const barterTotal = formBarter?.reduce((acc, item) => {
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
    console.log(data)

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
  }, [formField, formBarter])

  useEffect(() => {
    if (fields.length === 0) {
      append({ warehouseId: '', masterProductId: '', unitId: '', price: '', quantity: '', subTotal: '' })
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
  }

  const handleAddVendor = () => {
    setOpenModalVendor(true)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          {/* HEADER */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container display='flex' gap={4} justifyContent='space-between'>
                  <Grid item xs={12} md={4}>
                    <Box display='flex' alignItems={'center'} width={'100%'}>
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
                          mt: 4,
                          width: '100%',
                          '@media (min-width: 600px)': {
                            width: 'auto'
                          }
                        }}
                      >
                        <Icon fontSize='1.125rem' icon='tabler:plus' />
                        Tambah Vendor
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <DatePicker
                      selected={date}
                      id='basic'
                      popperPlacement={popperPlacement}
                      onChange={date => setDate(date)}
                      fullWidth
                      customInput={<PickersComponent label='Tanggal Jatuh Tempo' />}
                    />
                  </Grid>
                </Grid>
                <Grid container display='flex' gap={3} sx={{ marginTop: '1rem' }}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex-column', alignItems: 'left', textAlign: 'left' }}>
                      <Typography sx={{ color: 'text.secondary' }}>{vendorData?.email}</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{vendorData?.address}</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{vendorData?.phoneNumber}</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{vendorData?.rankName}</Typography>
                    </Box>
                  </Grid>
                </Grid>
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
                                // setWarehouseId(+newValue?.id)
                                // dispatch(fetchInvoiceListProductByWarehouseId(+newValue?.id))
                                // removeBarterProduct()
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
                              getOptionLabel={option => option.name || ''}
                              value={listMasterProduct.find(product => product.id === value) || null}
                              onChange={(event, newValue) => {
                                onChange(+newValue?.id)
                                setValue(`data[${index}].unitId`, null)
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
                                  dispatch(
                                    fetchOneMasterDataProductPrice({
                                      productId: selectedProduct,
                                      unitId: newValue?.id
                                    })
                                  ).then(({ payload }) => {
                                    if (payload.data) {
                                      setValue(`data[${index}].price`, payload.data.basePrice)
                                    } else {
                                      setValue(`data[${index}].price`, null)
                                    }
                                  })
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
                      <Grid key={getValues(`data[${index}].warehouseProductId`)} item xs={3} md={1.5}>
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
                                const rawValue = e.target.value.replace(/\D/g, '') // Remove non-digit characters
                                const newPrice = +rawValue
                                const currentQuantity = formField[index].quantity || 0
                                const newSubTotal = currentQuantity * newPrice

                                // Update the price and the subtotal
                                onChange(rawValue)
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
                                      dispatch(
                                        fetchOneMasterDataProductPrice({
                                          productId: selectedProduct.masterProductId,
                                          unitId: selectedProduct.masterUnitId
                                        })
                                      ).then(({ payload }) => {
                                        // if price exist then switch to replace
                                        if (payload.data) {
                                          setValue(`barterProduct[${index}].price`, payload.data.basePrice)
                                        } else {
                                          setValue(`barterProduct[${index}].price`, 0)
                                        }
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
                      <Grid key={getValues(`barterProduct[${index}].warehouseProductId`)} item xs={5} md={2}>
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
                                const rawValue = e.target.value.replace(/\D/g, '') // Remove non-digit characters
                                const newPrice = +rawValue
                                const currentQuantity = formBarter[index].quantity || 0
                                const newSubTotal = currentQuantity * newPrice

                                // Update the price and the subtotal
                                onChange(rawValue)
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
                      <Grid item xs={5} md={3}>
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
    </>
  )
}
