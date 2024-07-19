import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, Divider, Grid, IconButton, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import { fetchMasterDataProduct } from 'src/store/apps/master/product'
import { fetchMasterDataUnit } from 'src/store/apps/master/unit'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { createDeliveryOrder, fetchInvoiceListProductByWarehouseId } from 'src/store/apps/delivery-order'
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import OptionsGroup from 'src/helpers/groupedInput'

export default function AddInvoice({ warehouse }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
  const { dataListProductWarehouse: listProduct } = useSelector(state => state.deliveryOrder)

  const schema = yup.object({
    warehouseOrigin: yup.string().required('Gudang asal harus diisi'),
    warehouseDestination: yup
      .string()
      .notOneOf([yup.ref('warehouseOrigin')], 'Gudang tujuan tidak boleh sama dengan gudang asal')
      .required('Gudang tujuan harus diisi'),
    data: yup.array().of(
      yup.object().shape({
        productWarehouseId: yup.number().typeError('Produk harus dipilih'),
        quantity: yup.number().typeError('Produk harus dipilih'),
        qty: yup
          .number()
          .typeError('Kuantiti harus diisi')
          .test('max', 'Kuantiti tidak boleh lebih besar dari stock tersedia', function (value) {
            const { quantity } = this.parent
            return value <= quantity
          })
      })
    )
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'data'
  })

  const onSubmit = data => {
    const listItems = data.data
    const lastIndexMap = new Map()
    let duplicate = true
    let lastIndex = -1
    for (let i = 0; i < listItems.length; i++) {
      const { productWarehouseId } = listItems[i]
      const key = `${productWarehouseId}`
      if (lastIndexMap.has(key)) {
        lastIndex = lastIndexMap.get(key)
      }
      lastIndexMap.set(key, i)
    }
    // Check duplicate index
    lastIndex !== -1 ? (lastIndex += 1) : (duplicate = false)
    setError(`data[${lastIndex}].productWarehouseId`, {
      type: 'duplicate',
      message: `Produk dan Satuan sudah dipilih`
    })
    if (!duplicate) {
      let sendData = {
        warehouseOriginId: data.warehouseOrigin,
        warehouseDestinationId: data.warehouseDestination,
        data: listItems,
        notes: data.notes
      }
      dispatch(createDeliveryOrder({ data: sendData, router }))
    }
  }

  const addMore = () => {
    append({ productWarehouseId: '', qty: '' })
  }

  const deleteItem = itemIndex => {
    remove(itemIndex)
  }

  useEffect(() => {
    append({
      productWarehouseId: '',
      quantity: '',
      qty: '',
      masterProductId: ''
    })
    dispatch(fetchMasterDataWarehouse())
  }, [dispatch, append, listProduct])

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
                      name={`warehouseOrigin`}
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
                              error={Boolean(errors?.warehouseOrigin)}
                              {...(errors?.warehouseOrigin && {
                                helperText: errors?.warehouseOrigin.message
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
                      name={`warehouseDestination`}
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
                              error={Boolean(errors?.warehouseDestination)}
                              {...(errors?.warehouseDestination && {
                                helperText: errors?.warehouseDestination.message
                              })}
                              label='Gudang Tujuan'
                            />
                          )}
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
              {fields.map((item, index) => (
                <>
                  <CardContent key={index}>
                    <Grid container spacing={6}>
                      <Grid item xs={12} md={7}>
                        <Controller
                          name={`data[${index}].productWarehouseId`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomAutocomplete
                              key={index}
                              // options={listProduct}
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
                                  setValue(`data[${index}].quantity`, selectedProduct.quantity)
                                  setValue(`data[${index}].masterProductId`, selectedProduct.masterProductId)
                                } else {
                                  setValue(`data[${index}].quantity`, '')
                                  setValue(`data[${index}].masterProductId`, '')
                                }
                              }}
                              renderInput={params => (
                                <CustomTextField
                                  value={item.productWarehouseId}
                                  {...params}
                                  error={Boolean(errors?.data?.[index]?.productWarehouseId)}
                                  {...(errors?.data?.[index]?.productWarehouseId && {
                                    helperText: errors?.data?.[index]?.productWarehouseId.message
                                  })}
                                  label='Produk'
                                />
                              )}
                            />
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
                          name={`data[${index}].qty`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Kuantiti'
                              value={value}
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
                      <Grid item xs={1} md={1} sx={{ marginTop: 'auto' }}>
                        {index !== 0 && fields.length - 1 === index && (
                          <IconButton onClick={() => deleteItem(index)} sx={{ color: 'text.primary' }}>
                            <Icon icon='tabler:trash' />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                </>
              ))}
              <CardContent>
                <Grid item>
                  <Button onClick={addMore} startIcon={<Icon icon='tabler:plus' />}>
                    Tambahkan produk
                  </Button>
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
