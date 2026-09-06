import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { createDeliveryOrder, fetchInvoiceListProductByWarehouseId } from 'src/store/apps/delivery-order'
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import OptionsGroup from 'src/helpers/groupedInput'
import { notifyError } from 'src/helpers/notify'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import FormActionBar from 'src/views/common/FormActionBar'
import SectionHeading from 'src/views/common/SectionHeading'

// ** Design Tokens
import { colors, radii, shadows, stone } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

export default function AddInvoice({ warehouse }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { data: masterDataWarehouse } = useSelector(state => state.warehouse)
  const { dataListProductWarehouse: listProduct } = useSelector(state => state.deliveryOrder)
  const { loadingCreateDeliveryOrder } = useSelector(state => state.deliveryOrder)

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
          .test(
            'is-greater-than-zero',
            'Jumlah stok minimal harus lebih dari 0',
            function (value) {
              const num = Number(value);
              return num >= 0;
            }
          )
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
    lastIndex !== -1 ? (lastIndex) : (duplicate = false)
    if (duplicate) {
      setError(`data[${lastIndex}].productWarehouseId`, {
        type: 'duplicate',
        message: `Produk dan Satuan sudah dipilih`
      })
      notifyError('Produk dan Satuan sudah dipilih')
    }
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title='Pembuatan Surat Jalan'
        onBack={() => router.back()}
        breadcrumbs={[
          { label: 'Surat Jalan', href: '/delivery-order' },
          { label: 'Tambah' }
        ]}
      />

      {/* No `spacing` on this container: `FormActionBar`'s negative margins are
          measured against the content column, and grid gutters would offset it. */}
      <Grid container>
        <Grid item xs={12}>
          <SectionHeading number={1} title='Informasi Gudang' />
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card elevation={0} sx={surfaceCardSx}>
                <CardContent sx={{ p: 5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Box sx={{ flex: 1 }}>
                      <Controller
                        name='warehouseOrigin'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomAutocomplete
                            options={masterDataWarehouse}
                            id='autocomplete-warehouse-origin'
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
                                fullWidth
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
                    </Box>

                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        mt: 3,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: stone[100],
                        color: colors.mutedForeground
                      }}
                    >
                      <Icon icon='tabler:arrow-right' fontSize='1.125rem' />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Controller
                        name='warehouseDestination'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomAutocomplete
                            options={masterDataWarehouse}
                            id='autocomplete-warehouse-destination'
                            getOptionLabel={option => option.name || ''}
                            onChange={(event, newValue) => {
                              onChange(+newValue?.id)
                            }}
                            renderInput={params => (
                              <CustomTextField
                                value={value}
                                {...params}
                                fullWidth
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
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ ...surfaceCardSx, height: '100%' }}>
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
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <SectionHeading number={2} title='Produk' />
          <Card elevation={0} sx={{ ...surfaceCardSx, mb: 4 }}>
            <CardContent sx={{ p: 5 }}>
              {fields.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    pb: 4,
                    mb: index !== fields.length - 1 ? 4 : 0,
                    borderBottom: index !== fields.length - 1 ? `1px solid ${colors.border}` : 'none'
                  }}
                >
                  <Grid container spacing={4} alignItems='flex-start'>
                    <Grid item xs={12} md={5}>
                      <Controller
                        name={`data[${index}].productWarehouseId`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
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
                                setValue(`data[${index}].quantity`, selectedProduct.quantity)
                                setValue(`data[${index}].masterProductId`, selectedProduct.masterProductId)
                                setValue(`data[${index}].rackName`, selectedProduct.rackName)
                              } else {
                                setValue(`data[${index}].quantity`, '')
                                setValue(`data[${index}].masterProductId`, '')
                                setValue(`data[${index}].rackName`, '')
                              }
                            }}
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                fullWidth
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
                    <Grid item xs={4} md={2}>
                      <Controller
                        name={`data[${index}].rackName`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            label='Rak'
                            disabled
                            value={value}
                            onChange={e => onChange(e.target.value)}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} md={2}>
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
                            error={Boolean(errors?.data?.[index]?.quantity)}
                            {...(errors?.data?.[index]?.quantity && {
                              helperText: errors?.data?.[index]?.quantity.message
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4} md={2}>
                      <Controller
                        name={`data[${index}].qty`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <CustomTextField
                            fullWidth
                            label='Kuantiti'
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            type='number'
                            error={Boolean(errors?.data?.[index]?.qty)}
                            {...(errors?.data?.[index]?.qty && {
                              helperText: errors?.data?.[index]?.qty.message
                            })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: { xs: 'flex-end', md: 'center' }, pt: { md: 2 } }}>
                      {fields.length > 1 && (
                        <IconButton onClick={() => deleteItem(index)} color='error' size='small'>
                          <Icon icon='tabler:trash' fontSize='1.125rem' />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              ))}

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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <FormActionBar
            onCancel={() => router.back()}
            loading={loadingCreateDeliveryOrder}
            submitLabel='Submit'
            cancelLabel='Cancel'
            loadingLabel='Submitting...'
          />
        </Grid>
      </Grid>
    </form>
  )
}
