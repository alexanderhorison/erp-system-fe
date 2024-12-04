import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, Divider, Grid, Typography, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { updateFormPurchaseOrder } from 'src/store/apps/purchase-order'
import PickersComponent from '../forms/form-elements/pickers/PickersCustomInput'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { priceFormat } from 'src/helpers/priceFormatter'
import { Box } from '@mui/system'

export default function EditPurchaseOrderPage({ data, purchaseOrderCode }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'
  const [date, setDate] = useState(new Date())
  const [vendor, setVendor] = useState({})

  const schema = yup.object({
    vendorId: yup.string().required('Vendor harus diisi'),
    grandTotal: yup.number().typeError('Grand Total harus ada'),
    grandTotalVendor: yup.number().typeError('Total Purchase order harus ada'),
    grandTotalBarter: yup.number().typeError('Total Barter harus ada'),
    notes: yup.string().optional(),
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
        subTotal: yup.number().typeError('Sub Total Product harus diisi')
      })
    ),
    barterProduct: yup.lazy(value => {
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
            price: yup.number(),
            quantity: yup.number(),
            subTotal: yup.number(),
            warehouseId: yup.number()
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

  // Barang Purchase Order
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

  const onSubmit = data => {
    const listItems = data.data
    const listBarter = data.barterProduct

    // Map Barang Purchase order
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
        vendorId: +data.vendorId,
        grandTotal: data.grandTotal,
        grandTotalVendor: data.grandTotalVendor,
        grandTotalBarter: data.grandTotalBarter,
        dueDate: date.toLocaleDateString('en-GB'),
        notes: data.notes,
        listProduct: listItems,
        listBarterProduct: listBarter
      }
      dispatch(updateFormPurchaseOrder({ data: sendData, code: purchaseOrderCode, router }))
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
        warehouseId: product.warehouseId,
        warehouseName: product.warehouseName
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
          warehouseId: product.warehouseId,
          warehouseName: product.warehouseName
        })
      })
    }
    setDate(formatDate(data?.dueDate))
    setValue('vendorId', data?.vendor?.id)
    setValue('grandTotal', data?.grandTotal)
    setValue('notes', data?.notes)
    setValue('grandTotalVendor', data?.grandTotalVendor) // Update total purchase order
    setValue('grandTotalBarter', data?.grandTotalBarter)
    setVendor({
      email: data?.vendor?.email,
      address: data?.vendor?.address,
      phoneNumber: data?.vendor?.phoneNumber,
      rankName: data?.vendor?.rankName
    })
  }, [dispatch, append])

  useEffect(() => {
    calculateTotals()
  }, [formField, formBarter])

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

  const titleProductInfo = index => {
    const infos = {
      titleProduct: `Rack: ${getValues(`data[${index}].rackName`) || '-'} | Unit: ${
        getValues(`data[${index}].unitName`) || '-'
      }`,
      titleQuantity: `QTY: ${getValues(`data[${index}].qty`) || '-'}`
    }
    return infos
  }

  const titleBarterInfo = index => {
    const infos = {
      titleProduct: `Rack: ${getValues(`barterProduct[${index}].rackName`) || '-'} | Unit: ${
        getValues(`barterProduct[${index}].unitName`) || '-'
      }`,
      titleQuantity: `QTY: ${getValues(`barterProduct[${index}].qty`) || '-'}`
    }
    return infos
  }

  const handlePriceChange = ({ event, index, fieldName, setValue, formStateField, onChange }) => {
    const input = event.target
    const cursorPosition = input.selectionStart // Save cursor position
    const rawValue = input.value.replace(/\D/g, '') // Remove non-digit characters
    const formattedValue = priceFormat(+rawValue)

    onChange(rawValue)

    setTimeout(() => {
      input.value = formattedValue // Set formatted value in the input
      input.setSelectionRange(cursorPosition, cursorPosition) // Restore cursor position
    }, 0)

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
                      name={`vendorId`}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Vendor'
                          disabled
                          value={data?.vendor?.name}
                          sx={{ display: 'block' }}
                        />
                      )}
                    />
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
                      <Typography sx={{ color: 'text.secondary' }}>{vendor?.email}</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{vendor?.address}</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{vendor?.phoneNumber}</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{vendor?.rankName}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
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
                          name={`data[${index}].warehouseName`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              value={value}
                              disabled
                              label='Gudang Tujuan'
                              sx={{ zIndex: 0, display: 'block' }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={6} sx={{ marginTop: 1 }}>
                      <Grid item xs={12} md={4}>
                        <Controller
                          name={`data[${index}].productName`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <div>
                              <CustomTextField
                                fullWidth
                                label='Produk'
                                disabled
                                value={value}
                                sx={{ display: 'block', zIndex: 0 }}
                              />
                              <Typography
                                variant='body2' // Adjusts the size (you can change this to 'body1' or 'subtitle2' for larger text)
                                color='textSecondary' // This can be customized to another color, like 'primary', 'secondary', etc.
                                sx={{ marginTop: '4px' }} // Adds some spacing between the input and the text
                              >
                                {titleProductInfo(index).titleProduct}
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
                                  onChange
                                })
                                // const rawValue = e.target.value.replace(/\D/g, '') // Remove non-digit characters
                                // const newPrice = +rawValue
                                // const currentQuantity = formField[index].quantity || 0
                                // const newSubTotal = currentQuantity * newPrice

                                // // Update the price and the subtotal
                                // onChange(rawValue)
                                // if (parseInt(newSubTotal, 10) > 0) {
                                //   setValue(`data[${index}].subTotal`, newSubTotal)
                                // }
                                // if (
                                //   formField[index].quantity &&
                                //   formField[index].price &&
                                //   parseInt(formField[index].quantity, 10) > 0
                                // ) {
                                //   calculateTotals()
                                // }
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
                          sx={{ display: 'block' }}
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
          {barterFields.length > 0 && (
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
                            name={`barterProduct[${index}].warehouseName`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                              <CustomTextField
                                value={value}
                                disabled
                                label='Gudang Sumber'
                                sx={{ zIndex: 0, display: 'block' }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={6} sx={{ marginTop: 1 }}>
                        <Grid item xs={12} md={4}>
                          <Controller
                            name={`barterProduct[${index}].productName`}
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <div>
                                <CustomTextField
                                  fullWidth
                                  label='Produk'
                                  disabled
                                  value={value}
                                  sx={{ display: 'block', zIndex: 0 }}
                                />
                                <Typography
                                  variant='body2' // Adjusts the size (you can change this to 'body1' or 'subtitle2' for larger text)
                                  color='textSecondary' // This can be customized to another color, like 'primary', 'secondary', etc.
                                  sx={{ marginTop: '4px' }} // Adds some spacing between the input and the text
                                >
                                  {titleBarterInfo(index).titleProduct}
                                </Typography>
                              </div>
                            )}
                          />
                        </Grid>
                        <Grid item xs={5} md={2}>
                          <Controller
                            name={`barterProduct[${index}].quantity`}
                            control={control}
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
                                    onChange
                                  })
                                  // const rawValue = e.target.value.replace(/\D/g, '') // Remove non-digit characters
                                  // const newPrice = +rawValue
                                  // const currentQuantity = formBarter[index].quantity || 0
                                  // const newSubTotal = currentQuantity * newPrice

                                  // // Update the price and the subtotal
                                  // onChange(rawValue)
                                  // if (parseInt(newSubTotal, 10) > 0) {
                                  //   setValue(`barterProduct[${index}].subTotal`, newSubTotal)
                                  // }
                                  // if (
                                  //   formBarter[index].quantity &&
                                  //   formBarter[index].price &&
                                  //   parseInt(formBarter[index].quantity, 10) > 0
                                  // ) {
                                  //   calculateTotals()
                                  // }
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
                        name={`grandTotalBarter`}
                        control={control}
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
          )}
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
