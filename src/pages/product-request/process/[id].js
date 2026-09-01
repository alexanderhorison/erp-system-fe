import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

// ** Store Imports
import { fetchDetailRequestOrder, processRequestOrder } from 'src/store/apps/product-request-order'
import { fetchMasterDataWarehouse } from 'src/store/apps/master/warehouse'
import { findProductWarehouse } from 'src/store/apps/product-warehouse'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import FormActionBar from 'src/views/common/FormActionBar'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

const fieldLabelSx = {
  fontSize: '0.8125rem',
  fontWeight: 500,
  lineHeight: '20px',
  color: colors.foreground,
  mb: 1
}

export default function ProcessProductRequest() {
  const router = useRouter()
  const dispatch = useDispatch()
  const id = router.query.id

  const schema = yup.object().shape({
    notes: yup.string().optional(),
    data: yup.array().of(
      yup.object().shape({
        warehouseId: yup.number().typeError('Gudang harus diisi').required('Gudang harus diisi'),
        stock: yup.number().typeError('Stock harus diisi').required('Stock harus diisi').default(0),
        qtyGive: yup
          .number()
          .typeError('Kuantitas Diberikan harus diisi')
          .required('Kuantitas Diberikan harus diisi')
          .min(0, 'Kuantitas minimal 0')
          .test(
            'qty-give-not-exceed-stock', // unique test name
            'Kuantitas tidak boleh lebih dari stok', // error message
            function (value) {
              const { stock } = this.parent // 👈 access sibling field
              if (value == null || stock == null) return true // skip if empty
              return value <= stock
            }
          )
      })
    )
  })

  const { detailRequestOrder, loadingProcessRequestOrder } = useSelector(state => state.productRequest)
  const { data: masterWarehouse } = useSelector(state => state.warehouse)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      data: []
    }
  })

  const { fields } = useFieldArray({
    control,
    name: 'data'
  })

  useEffect(() => {
    if (id) {
      dispatch(fetchDetailRequestOrder(id))
    }
    dispatch(fetchMasterDataWarehouse())
  }, [id, dispatch])

  useEffect(() => {
    if (detailRequestOrder?.listProducts?.length) {
      reset({
        notes: detailRequestOrder.notes || '',
        data: detailRequestOrder.listProducts.map(p => ({
          productWarehouseId: '',
          warehouseId: '',
          qtyGive: '',
          productName: p.productName,
          unitName: p.unitName,
          qtyRequest: p.quantityRequested,
          productId: p.productId,
          unitId: p.unitId
        }))
      })
    }
  }, [detailRequestOrder, reset])

  const onSubmit = values => {
    const dataSend = {
      ...values,
      code: detailRequestOrder.code,
      warehouseDestinationId: detailRequestOrder.warehouseDestinationId
    }
    dispatch(processRequestOrder({ data: dataSend, router }))
  }

  const handleFindProductWarehouse = (productId, unitId, warehouseId, index) => {
    dispatch(findProductWarehouse({ productId, unitId, warehouseId })).then(({ payload }) => {
      if (payload.data) {
        setValue(`data.${index}.productWarehouseId`, payload.data.id)
        setValue(`data.${index}.stock`, payload.data.quantity)
      } else {
        setValue(`data.${index}.stock`, '0')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title='Product Request'
        subtitle={detailRequestOrder?.code}
        onBack={() => router.back()}
        breadcrumbs={[
          { label: 'Home' },
          { label: 'Product Request', href: '/product-request' },
          { label: detailRequestOrder?.code || 'Proses' }
        ]}
      />

      {/* No `spacing` on this container: `FormActionBar`'s negative margins are
          measured against the content column, and grid gutters would offset it. */}
      <Grid container>
        {/* Left column: the products being fulfilled. Right column: the note
            that came with the request, kept alongside rather than below. */}
        <Grid item xs={12} lg={8.5} sx={{ pr: { lg: 4 } }}>
          <Card elevation={0} sx={surfaceCardSx}>
            <CardContent>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: `${radii['3xl']}px`,
                    border: `1px solid ${colors.border}`,
                    '&:last-of-type': { mb: 0 }
                  }}
                >
                  <Grid container spacing={3} alignItems='flex-start'>
                    {/* Product */}
                    <Grid item xs={12} md={3}>
                      <Typography sx={fieldLabelSx}>Transformasi Produk</Typography>
                      <Typography sx={{ fontSize: '0.875rem', lineHeight: '20px', color: colors.mutedForeground }}>
                        {`${field.productName} (${field.unitName})`}
                      </Typography>
                    </Grid>

                    {/* Request Qty */}
                    <Grid item xs={6} md={2}>
                      <Typography sx={fieldLabelSx}>Request</Typography>
                      <CustomTextField fullWidth value={field.qtyRequest} disabled />
                    </Grid>

                    {/* Warehouse Select */}
                    <Grid item xs={12} md={3}>
                      <Typography sx={fieldLabelSx}>
                        Gudang <Box component='span' sx={{ color: colors.destructive }}>*</Box>
                      </Typography>
                      <Controller
                        name={`data.${index}.warehouseId`}
                        rules={{ required: true }}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <CustomAutocomplete
                            options={masterWarehouse.filter(data => data.id !== 6)} // hardcode warehouse gudang depan
                            getOptionLabel={option => option.name || ''}
                            onChange={(e, newVal) => {
                              handleFindProductWarehouse(field.productId, field.unitId, newVal?.id, index)
                              onChange(newVal?.id || '')
                            }}
                            renderInput={params => (
                              <CustomTextField
                                {...params}
                                placeholder='Select'
                                error={!!errors?.data?.[index]?.warehouseId}
                                helperText={errors?.data?.[index]?.warehouseId?.message}
                              />
                            )}
                          />
                        )}
                      />
                    </Grid>

                    {/* Stock */}
                    <Grid item xs={6} md={2}>
                      <Typography sx={fieldLabelSx}>Stock</Typography>
                      <Controller
                        name={`data.${index}.stock`}
                        rules={{ required: true }}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            placeholder='0'
                            error={!!errors?.data?.[index]?.stock}
                            helperText={errors?.data?.[index]?.stock?.message}
                            disabled
                          />
                        )}
                      />
                    </Grid>

                    {/* Qty Give */}
                    <Grid item xs={6} md={2}>
                      <Typography sx={fieldLabelSx}>Jumlah Diberikan</Typography>
                      <Controller
                        name={`data.${index}.qtyGive`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            placeholder='0'
                            error={!!errors?.data?.[index]?.qtyGive}
                            helperText={errors?.data?.[index]?.qtyGive?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3.5} sx={{ mt: { xs: 4, lg: 0 } }}>
          <Card elevation={0} sx={surfaceCardSx}>
            <CardContent>
              <Typography
                sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground, mb: 3 }}
              >
                Catatan
              </Typography>
              <Controller
                name={`notes`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    multiline
                    rows={4}
                    fullWidth
                    placeholder={'Catatan...'}
                    value={value}
                    disabled
                    onChange={e => {
                      onChange(e.target.value)
                    }}
                    type='text'
                    sx={{ display: 'block' }}
                  />
                )}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <FormActionBar
            onCancel={() => router.back()}
            loading={loadingProcessRequestOrder}
            submitLabel='Submit'
            cancelLabel='Cancel'
            loadingLabel='Submitting...'
          />
        </Grid>
      </Grid>
    </form>
  )
}
