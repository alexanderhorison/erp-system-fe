import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, Divider, Grid, IconButton, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
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

export default function AddSalesOrder({ warehouse }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [date, setDate] = useState(new Date())

  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
  const { data: masterCustomer } = useSelector(state => state.masterCustomer)
  const { dataListProductWarehouse: listProduct } = useSelector(state => state.deliveryOrder)

  const schema = yup.object({
    customerId: yup.string().required('Customer harus diisi'),
    warehouseId: yup.string().required('Gudang asal harus diisi'),
    grandTotal: yup.number().typeError('Grand Total harus ada'),
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
    )
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    watch
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'data'
  })
  const formField = watch('data') // Watch for changes in 'data' to update totals

  const onSubmit = data => {
    const listItems = data.data
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

    if (!duplicate) {
      let sendData = {
        warehouseId: +data.warehouseId,
        customerId: +data.customerId,
        grandTotal: data.grandTotal,
        dueDate: date.toLocaleDateString('en-GB'),
        notes: data.notes,
        listProduct: listItems
      }
      dispatch(createSalesOrder({ data: sendData, router }))
    }
  }

  const addMore = () => {
    append({ warehouseProductId: '', price: '', quantity: '', subTotal: '' })
  }

  const deleteItem = itemIndex => {
    remove(itemIndex)
    calculateGrandTotal(itemIndex)
  }

  // Calculate grand total when subTotals change
  const calculateGrandTotal = useCallback(
    index => {
      if (index || index === 0) {
        setValue('grandTotal', control._formValues.grandTotal - formField[index].subTotal) // Update grand total
      } else {
        const calculatedGrandTotal = formField?.reduce((acc, item) => acc + (item.quantity * item.price || 0), 0)
        setValue('grandTotal', calculatedGrandTotal) // Update grand total
      }
    },
    [formField, setValue]
  )

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
                            dispatch(fetchInvoiceListProductByWarehouseId(+newValue?.id))
                            remove()
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
                  <Grid item xs={12} md={2}>
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
                <Grid container display='flex' gap={4} justifyContent='flex-end' sx={{ marginTop: '1rem' }}>
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
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
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
                                  setValue(`data[${index}].qty`, selectedProduct.quantity)
                                  setValue(`data[${index}].masterProductId`, selectedProduct.masterProductId)
                                  setValue(`data[${index}].rackName`, selectedProduct.rackName)

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
                                  error={Boolean(errors?.data?.[index]?.warehouseProductId)}
                                  {...(errors?.data?.[index]?.warehouseProductId && {
                                    helperText: errors?.data?.[index]?.warehouseProductId.message
                                  })}
                                  label='Produk'
                                />
                              )}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={1}>
                        <Controller
                          name={`data[${index}].rackName`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Rak'
                              disabled
                              value={value}
                              onChange={e => {
                                onChange(e.target.value)
                              }}
                              sx={{ display: 'block' }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={1}>
                        <Controller
                          name={`data[${index}].qty`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Stok Tersedia'
                              value={value}
                              disabled
                              onChange={e => {
                                const newValue = parseInt(e.target.value, 10)
                                if (!isNaN(newValue) && newValue >= 0) {
                                  onChange(+newValue)
                                }
                              }}
                              type='number'
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.data?.[index]?.qty)}
                              {...(errors?.data?.[index]?.qty && {
                                helperText: errors?.data?.[index]?.qty.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={1}>
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
                                  calculateGrandTotal()
                                }
                              }}
                              type='number'
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.data?.[index]?.quantity)}
                              {...(errors?.data?.[index]?.quantity && {
                                helperText: errors?.data?.[index]?.quantity.message
                              })}
                            />
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
                                  calculateGrandTotal()
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
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.data?.[index]?.subTotal)}
                              {...(errors?.data?.[index]?.subTotal && {
                                helperText: errors?.data?.[index]?.subTotal.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={1} md={1} sx={{ marginTop: 'auto' }}>
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
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
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
                        type='number'
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
    </>
  )
}
