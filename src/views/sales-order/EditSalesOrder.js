import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, Divider, Grid, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { updateFormSalesOrder } from 'src/store/apps/sales-order'
import PickersComponent from '../forms/form-elements/pickers/PickersCustomInput'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { priceFormat } from 'src/helpers/priceFormatter'
import zIndex from '@mui/material/styles/zIndex'

export default function EditSalesOrderPage({ data, salesOrderCode }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [date, setDate] = useState(new Date())

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
        qty: product.qty
      })
    })
    setDate(formatDate(data?.dueDate))
    setValue('customerId', data?.customer?.id)
    setValue('warehouseId', data?.warehouseId)
    setValue('grandTotal', data?.grandTotal)
    setValue('notes', data?.notes)
  }, [dispatch, append])

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
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Gudang Sumber'
                          disabled
                          value={data?.warehouseName}
                          sx={{ display: 'block' }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name={`customerId`}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Customer'
                          disabled
                          value={data?.customer?.name}
                          sx={{ display: 'block' }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid container display='flex' gap={4} justifyContent='flex-start' sx={{ marginTop: '1rem' }}>
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
                          name={`data[${index}].productName`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Produk'
                              disabled
                              value={value}
                              sx={{ display: 'block', zIndex: 0 }}
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
                    </Grid>
                  </CardContent>
                  <Divider />
                </React.Fragment>
              ))}
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
                        sx={{ display: 'block' }}
                        onChange={e => {
                          onChange(e.target.value)
                        }}
                        type='text'
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
