import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'

import Icon from 'src/@core/components/icon'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { createDeliveryOrderReceive } from 'src/store/apps/receive-order'

// ** Shared Components
import PageHeader from 'src/views/common/PageHeader'
import FormActionBar from 'src/views/common/FormActionBar'
import SectionHeading from 'src/views/common/SectionHeading'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens, stone } from 'src/configs/designTokens'

const surfaceCardSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs
}

const tableHeadCellSx = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: colors.foreground,
  borderColor: colors.border
}

const tableCellSx = {
  fontSize: '0.875rem',
  color: colors.foreground,
  borderColor: colors.border
}

export default function ReceiveDelivery({ data }) {
  const dispatch = useDispatch()
  const router = useRouter()

  const { loadingCreateReceiveOrder } = useSelector(state => state.receiveOrder)

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
      notes: data.notes
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, append])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title='Form Penerimaan Surat Jalan'
        subtitle={`Kode Surat: ${data?.code || ''}`}
        onBack={() => router.back()}
        breadcrumbs={[{ label: 'Penerimaan Surat Jalan', href: '/receive-order' }, { label: 'Tambah' }]}
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
                      <CustomTextField
                        fullWidth
                        label='Gudang Sumber'
                        disabled
                        value={data?.warehouseOrigin?.name || ''}
                      />
                    </Box>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.border,
                        color: colors.mutedForeground
                      }}
                    >
                      <Icon icon='tabler:arrow-right' fontSize='1.125rem' />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <CustomTextField
                        fullWidth
                        label='Gudang Tujuan'
                        disabled
                        value={data?.warehouseDestination?.name || ''}
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
                    rules={{ required: true }}
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
          <Box sx={{ mb: 4 }}>
            {/* The `MuiCard` theme override forces `.MuiTableContainer-root` inside a
                Card to `border-radius: 0` with a two-class selector, which outranks a
                plain `sx` rule on this element — hence the `&&` to match it. */}
            <TableContainer
              sx={{
                '&&': { borderRadius: `${radii.lg}px` },
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.background,
                overflowX: 'auto'
              }}
            >
              <Table size='small'>
                <TableHead sx={{ backgroundColor: stone[100] }}>
                  <TableRow>
                    <TableCell sx={tableHeadCellSx}>Produk</TableCell>
                    <TableCell sx={tableHeadCellSx}>Unit</TableCell>
                    <TableCell sx={tableHeadCellSx}>Rak</TableCell>
                    <TableCell sx={tableHeadCellSx}>Kuantiti Asal</TableCell>
                    <TableCell sx={tableHeadCellSx}>Kuantiti Diterima</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((item, index) => (
                    <TableRow key={item.id} sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
                      <TableCell sx={tableCellSx}>
                        <Controller
                          name={`data[${index}].productName`}
                          control={control}
                          render={({ field: { value } }) => value}
                        />
                      </TableCell>
                      <TableCell sx={tableCellSx}>
                        <Controller
                          name={`data[${index}].unitName`}
                          control={control}
                          render={({ field: { value } }) => value || '-'}
                        />
                      </TableCell>
                      <TableCell sx={tableCellSx}>
                        <Controller
                          name={`data[${index}].rackName`}
                          control={control}
                          render={({ field: { value } }) => value || '-'}
                        />
                      </TableCell>
                      <TableCell sx={tableCellSx}>
                        <Controller
                          name={`data[${index}].quantity`}
                          control={control}
                          render={({ field: { value } }) => value ?? '-'}
                        />
                      </TableCell>
                      <TableCell sx={{ ...tableCellSx, minWidth: 160 }}>
                        <Controller
                          name={`data[${index}].receiveQuantity`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              size='small'
                              value={value}
                              onChange={e => onChange(e.target.value)}
                              type='number'
                              error={Boolean(errors?.data?.[index]?.receiveQuantity)}
                              {...(errors?.data?.[index]?.receiveQuantity && {
                                helperText: errors?.data?.[index]?.receiveQuantity.message
                              })}
                            />
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Card elevation={0} sx={{ ...surfaceCardSx, mb: 4 }}>
            <CardContent sx={{ p: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
                <Typography
                  sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground }}
                >
                  Informasi Tambahan
                </Typography>
                <Chip
                  size='small'
                  label='Important!'
                  sx={{
                    height: 20,
                    borderRadius: `${radii.full}px`,
                    backgroundColor: statusTokens.warning.bg,
                    border: `1px solid ${statusTokens.warning.border}`,
                    '& .MuiChip-label': {
                      px: 1.5,
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      lineHeight: '16px',
                      color: statusTokens.warning.fg
                    }
                  }}
                />
              </Box>
              <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground, mb: 2 }}>
                Tanpa approval, stock akan langsung masuk ke gudang sesuai kuantiti yang di terima.
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', lineHeight: '20px', color: colors.mutedForeground }}>
                Jika terdapat selisih antara kuantiti diterima dengan kuantiti asal akan masuk ke dalam surat
                outstanding.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <FormActionBar
            onCancel={() => router.back()}
            loading={loadingCreateReceiveOrder}
            submitLabel='Submit'
            cancelLabel='Cancel'
            loadingLabel='Submitting...'
          />
        </Grid>
      </Grid>
    </form>
  )
}
