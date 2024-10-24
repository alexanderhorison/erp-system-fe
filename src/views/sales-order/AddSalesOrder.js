import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, Divider, Grid, IconButton, Typography, useTheme } from '@mui/material'
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
import { createSalesOrder } from 'src/store/apps/sales-order'
import PickersComponent from '../forms/form-elements/pickers/PickersCustomInput'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { priceFormat } from 'src/helpers/priceFormatter'
import { fetchOneMasterDataProductPrice } from 'src/store/apps/master/product-price'
import { Box } from '@mui/system'
import ModalTransformProductSalesOrder from './ModalTransformProductSalesOrder'

export default function AddSalesOrder({ }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [date, setDate] = useState(new Date())
  const [customerData, setCustomerData] = useState({})
  const [openModalTransformation, setOpenModalTransformation] = useState(false)
  const [transformationData, setTransformationData] = useState({})
  const [warehouseId, setWarehouseId] = useState()

  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
  const { data: masterCustomer } = useSelector(state => state.masterCustomer)
  const { dataListProductWarehouse: listProduct } = useSelector(state => state.deliveryOrder)

  const schema = yup.object({
    customerId: yup.string().required('Customer harus diisi'),
    warehouseId: yup.string().required('Gudang asal harus diisi'),
    grandTotal: yup.number().typeError('Grand Total harus ada'),
    grandTotalCustomer: yup.number().typeError('Total Sales order harus ada'),
    grandTotalBarter: yup.number().typeError('Total Barter harus ada'),
    notes: yup.string().optional(),
    data: yup.array().of(
      yup.object({
        warehouseProductId: yup.number().typeError('Id product warehouse harus diisi'),
        price: yup.number().typeError('Price product harus diisi'),
        quantity: yup
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
        subTotal: yup.number().typeError('Sub Total Product harus diisi')
      })
    ),
    barterProduct: yup.lazy(value => {
      // If there are items in the barterProduct array, require all fields within the objects
      if (value && value.length > 0) {
        return yup.array().of(
          yup.object({
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
            price: yup.number(),
            quantity: yup.number(),
            subTotal: yup.number()
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
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // Barang Sales Order
  const { fields, remove, append, update } = useFieldArray({
    control,
    name: 'data'
  })
  const formField = watch('data') // Watch for changes in 'data' to update totals

  console.log(fields, formField);

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
        warehouseId: +data.warehouseId,
        customerId: +data.customerId,
        grandTotal: data.grandTotal,
        grandTotalCustomer: data.grandTotalCustomer,
        grandTotalBarter: data.grandTotalBarter,
        dueDate: date.toLocaleDateString('en-GB'),
        notes: data.notes,
        listProduct: listItems,
        listBarterProduct: listBarter
      }
      dispatch(createSalesOrder({ data: sendData, router }))
    }
  }

  const addMore = () => {
    append({ warehouseProductId: '', price: '', quantity: '', subTotal: '' })
  }

  const deleteItem = itemIndex => {
    remove(itemIndex)
  }

  const onSelectTransform = (itemIndex) => {
    let temp = getValues(`data.${itemIndex}`)
    setTransformationData({ ...temp, indexForm: itemIndex })
    setOpenModalTransformation(true)
  }

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

  useEffect(() => {
    if (fields.length === 0) {
      append({
        warehouseProductId: '',
        price: '',
        quantity: '',
        subTotal: ''
      })
    }
    dispatch(fetchMasterDataWarehouse())
    dispatch(fetchMasterDataCustomer())
  }, [dispatch, listProduct])

  // const titleInfo = useMemo((index) => {
  //   return `Rack: ${getValues(`data[${index}].rackName`) || '-'} | Qty:${' '} ${getValues(`data[${index}].qty`) || '0'} | Unit: ${getValues(`data[${index}].unitName`) || '-'}`
  // })

  const titleInfo = (index) => {
    return `Rack: ${getValues(`data[${index}].rackName`) || '-'} | Qty:${' '} ${getValues(`data[${index}].qty`) || '0'} | Unit: ${getValues(`data[${index}].unitName`) || '-'}`
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container display='flex' gap={4} justifyContent='space-between'>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name={`warehouseId`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomAutocomplete
                          options={masterDataWarehouse}
                          id='autocomplete-custom'
                          getOptionLabel={option => option.name || ''}
                          onChange={(event, newValue) => {
                            onChange(+newValue?.id)
                            setWarehouseId(+newValue?.id)
                            dispatch(fetchInvoiceListProductByWarehouseId(+newValue?.id))
                            remove()
                            removeBarterProduct()
                          }}
                          renderInput={params => (
                            <CustomTextField
                              value={value}
                              {...params}
                              error={Boolean(errors?.warehouseId)}
                              {...(errors?.warehouseId && {
                                helperText: errors?.warehouseId.message
                              })}
                              label='Gudang Sumber'
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name={`customerId`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <CustomAutocomplete
                          options={masterCustomer}
                          id='autocomplete-custom'
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
                  </Grid>
                </Grid>
                <Grid container display='flex' gap={3} justifyContent='space-between' sx={{ marginTop: '1rem' }}>
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
                    <Box sx={{ display: 'flex-column', alignItems: 'left', textAlign: 'right' }}>
                      <Typography sx={{ color: 'text.secondary' }}>{customerData?.email}</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{customerData?.address}</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{customerData?.phoneNumber}</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{customerData?.rankName}</Typography>
                    </Box>
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
                          name={`data[${index}].warehouseProductId`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <div>
                              <CustomAutocomplete
                                key={item.id}
                                options={OptionsGroup(listProduct, 'categoryName')}
                                groupBy={option => option.categoryName}
                                id='autocomplete-grouped'
                                getOptionLabel={option => option.productName || ''}
                                value={listProduct.find(product => product.productWarehouseId === value) || null}
                                onChange={(event, newValue) => {
                                  onChange(+newValue?.productWarehouseId)
                                  const selectedProduct = listProduct.find(
                                    product => product.productWarehouseId === +newValue?.productWarehouseId
                                  )
                                  if (selectedProduct) {
                                    setValue(`data[${index}].qty`, selectedProduct.quantity)
                                    setValue(`data[${index}].masterProductId`, selectedProduct.masterProductId)
                                    setValue(`data[${index}].rackName`, selectedProduct.rackName)
                                    setValue(`data[${index}].unitName`, selectedProduct.unitName)
                                    // Fetch price base on selected product
                                    dispatch(
                                      fetchOneMasterDataProductPrice({
                                        productId: selectedProduct.masterProductId,
                                        unitId: selectedProduct.masterUnitId
                                      })
                                    ).then(({ payload }) => {
                                      // if price exist then switch to replace
                                      if (payload.data) {
                                        setValue(`data[${index}].price`, payload.data.basePrice)
                                      }
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
                                    // {...}
                                    label='Produk'
                                  />
                                )}
                              />
                              <Typography
                                variant='body2' // Adjusts the size (you can change this to 'body1' or 'subtitle2' for larger text)
                                color='textSecondary' // This can be customized to another color, like 'primary', 'secondary', etc.
                                sx={{ marginTop: '4px' }} // Adds some spacing between the input and the text
                              >
                                {titleInfo(index)}
                              </Typography>
                            </div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={2}>
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
                                sx={{ display: 'block' }}
                                error={Boolean(errors?.data?.[index]?.quantity)}
                                {...(errors?.data?.[index]?.quantity && {
                                  helperText: errors?.data?.[index]?.quantity.message
                                })}
                              />
                              {
                                getValues(`data[${index}].quantity`) > 0 &&
                                <Typography
                                  variant='body2'
                                  color='textSecondary'
                                  sx={{ marginTop: '4px', cursor: 'pointer', ":hover": { color: 'blue' } }}
                                  onClick={() => onSelectTransform(index)
                                  }
                                >
                                  Transformasi Produk
                                </Typography>
                              }
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
                      <Grid item xs={5} md={3}>
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
                          name={`barterProduct[${index}].warehouseProductId`}
                          control={control}
                          // rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <div>
                              <CustomAutocomplete
                                key={item.id}
                                options={OptionsGroup(listProduct, 'categoryName')}
                                groupBy={option => option.categoryName}
                                id='autocomplete-grouped'
                                getOptionLabel={option => option.productName || ''}
                                onChange={(event, newValue) => {
                                  onChange(+newValue?.productWarehouseId)
                                  const selectedProduct = listProduct.find(
                                    product => product.productWarehouseId === +newValue?.productWarehouseId
                                  )
                                  if (selectedProduct) {
                                    setValue(`barterProduct[${index}].qty`, selectedProduct.quantity)
                                    setValue(`barterProduct[${index}].masterProductId`, selectedProduct.masterProductId)
                                    setValue(`barterProduct[${index}].rackName`, selectedProduct.rackName)

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
                                      }
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
                              <Typography
                                variant='body2' // Adjusts the size (you can change this to 'body1' or 'subtitle2' for larger text)
                                color='textSecondary' // This can be customized to another color, like 'primary', 'secondary', etc.
                                sx={{ marginTop: '4px' }} // Adds some spacing between the input and the text
                              >
                                Rack: {getValues(`barterProduct[${index}].rackName`) || '-'} | Qty:{' '}
                                {getValues(`barterProduct[${index}].qty`) || '0'}
                              </Typography>
                            </div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={2}>
                        <Controller
                          name={`barterProduct[${index}].quantity`}
                          control={control}
                          // rules={{ required: true }}
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
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.barterProduct?.[index]?.quantity)}
                              {...(errors?.barterProduct?.[index]?.quantity && {
                                helperText: errors?.barterProduct?.[index]?.quantity.message
                              })}
                            />
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
                        appendBarterProduct({ warehouseProductId: '', price: '', quantity: '', subTotal: '' })
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
      {
        openModalTransformation &&
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
        />
      }
    </>
  )
}
