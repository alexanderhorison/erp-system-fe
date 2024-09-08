import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@mui/material'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { createDeliveryOrderReceive } from 'src/store/apps/receive-order'
import CustomChip from 'src/@core/components/mui/chip'


export default function ReceiveDelivery({ data }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const schema = yup.object({
    deliveryOrderId: yup.number().required('Delivery order id harus ada'),
    data: yup.array().of(
      yup.object().shape({
        deliveryOrderProductId: yup.number().typeError('Produk harus ada'),
        quantity: yup.number().typeError('Kuantiti stok harus ada'),
        receiveQuantity: yup
          .number()
          .typeError('Jumlah kuantiti diterima harus ada')
          .test('max', 'Kuantiti diterima tidak boleh lebih besar dari kuantiti asal', function (value) {
            const { quantity } = this.parent
            return value <= quantity
          })
      })
    ),
    notes: yup.string().optional()
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'data'
  })

  const onSubmit = data => {
    let sendData = {
      data: data.data,
      deliveryOrderId: data.deliveryOrderId,
      notes: data.notes,
    }
    dispatch(createDeliveryOrderReceive({ data: sendData, router }))
  }

  useEffect(() => {
    remove()
    data?.listProducts.forEach(product => {
      append({
        productName: product.productName,
        rackName: product.rackName,
        unitName: product.unitName,
        receiveQuantity: product.quantity,
        deliveryOrderProductId: product.deliveryOrderProductId,
        quantity: product.quantity
      })
    })
    setValue('deliveryOrderId', data?.id)
  }, [dispatch, append])

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
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Gudang Sumber'
                          disabled
                          value={data?.warehouseOrigin?.name}
                          sx={{ display: 'block' }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name={`warehouseDestination`}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <CustomTextField
                          fullWidth
                          label='Gudang Tujuan'
                          disabled
                          value={data?.warehouseDestination?.name}
                          sx={{ display: 'block' }}
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
                              sx={{ display: 'block' }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={5} md={2}>
                        <Controller
                          name={`data[${index}].unitName`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Unit'
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
                      <Grid item xs={5} md={2}>
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
                      <Grid item xs={5} md={2}>
                        <Controller
                          name={`data[${index}].quantity`}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Kuantiti Asal'
                              disabled
                              value={value}
                              onChange={e => {
                                onChange(e.target.value)
                              }}
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
                          name={`data[${index}].receiveQuantity`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              label='Kuantiti Diterima'
                              value={value}
                              onChange={e => {
                                onChange(e.target.value)
                              }}
                              type='number'
                              sx={{ display: 'block' }}
                              error={Boolean(errors?.data?.[index]?.receiveQuantity)}
                              {...(errors?.data?.[index]?.receiveQuantity && {
                                helperText: errors?.data?.[index]?.receiveQuantity.message
                              })}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Divider />
                </>
              ))}
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
                        sx={{ display: 'block' }}
                      />
                    )}
                  />
                </Grid>
              </CardContent>
            </Card>
            <Card sx={{ marginTop: '1rem' }}>
              <CardHeader
                title='Informasi Tambahan'
                action={<CustomChip rounded label={`Important!`} skin='light' color={`warning`} />}
              />
              <CardContent>
                <Typography variant='body2' color='text.secondary'>
                  Tanpa approval, stock akan langsung masuk ke gudang sesuai kuantiti yang di terima
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Jika terdapat selisih antara kuantiti diterima dengan kuantiti asal akan masuk ke dalam surat outstanding
                </Typography>
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
