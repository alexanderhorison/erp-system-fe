// ** React Imports
import { useEffect } from 'react'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Form Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Component Imports
import AppModal from 'src/views/common/AppModal'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Store Imports
import { fetchProductWarehouseDetail } from 'src/store/apps/product-warehouse'
import { payLoanStock } from 'src/store/apps/loan-stock'

// ** Design Tokens
import { colors, radii, shadows, status as statusTokens, stone } from 'src/configs/designTokens'

// ** Validation Schema — messages stay in Bahasa (docs/REVAMP_BASELINE.md §0).
const schema = yup.object().shape({
  quantity: yup
    .number()
    .transform((value, originalValue) => {
      // Handle empty string or invalid input
      return originalValue === '' || originalValue === null ? undefined : value
    })
    .typeError('Jumlah harus berupa angka')
    .required('Jumlah harus diisi')
    .positive('Jumlah harus lebih dari 0')
    .integer('Jumlah harus berupa bilangan bulat')
    .min(1, 'Jumlah minimal adalah 1')
    .test('max-quantity', 'Jumlah tidak boleh melebihi stok tersedia', function (value) {
      return value <= this.parent.maxQuantity
    })
})

// ** Bordered panel wrapping each group of the dialog, matching the shared
// surface treatment used by the detail toolbars.
const panelSx = {
  borderRadius: `${radii.lg}px`,
  border: `1px solid ${colors.border}`,
  boxShadow: shadows.xs,
  overflow: 'hidden'
}

const panelHeaderSx = {
  px: 4,
  py: 3,
  backgroundColor: stone[100],
  borderBottom: `1px solid ${colors.border}`
}

/** One label/value line inside the product panel. */
const InfoRow = ({ label, value, tone }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
    <Typography sx={{ fontSize: '0.875rem', lineHeight: '20px', color: colors.mutedForeground }}>{label}</Typography>
    <Typography
      sx={{
        fontSize: '0.875rem',
        lineHeight: '20px',
        fontWeight: tone ? 600 : 500,
        textAlign: 'right',
        color: tone || colors.foreground
      }}
    >
      {value}
    </Typography>
  </Box>
)

export default function ModalPayLoanStock({ open, setOpen, loanData }) {
  const dispatch = useDispatch()

  const { detailProductWarehouse } = useSelector(state => state.productWarehouse)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      quantity: '',
      maxQuantity: 0
    }
  })

  useEffect(() => {
    if (open && loanData) {
      dispatch(fetchProductWarehouseDetail(loanData?.productWarehouseId))
    }
  }, [open, loanData, dispatch])

  useEffect(() => {
    if (open && loanData && detailProductWarehouse) {
      const availableStock = detailProductWarehouse?.quantity || 0
      const loanQuantity = loanData?.quantity || 0
      const maxAllowed = Math.min(availableStock, loanQuantity)

      reset({
        quantity: '',
        maxQuantity: maxAllowed
      })
    } else if (!open) {
      reset({
        quantity: '',
        maxQuantity: 0
      })
    }
  }, [open, loanData, detailProductWarehouse, reset])

  const onSubmit = data => {
    const payload = {
      quantity: data.quantity,
      productWarehouseId: loanData.productWarehouseId
    }

    dispatch(payLoanStock({ data: payload, modalTrigger: setOpen }))
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (!loanData) return null

  const availableStock = detailProductWarehouse?.quantity || 0
  const maxPayable = Math.min(availableStock, loanData.quantity)

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title='Bayar Pinjaman Stok'
      size='sm'
      submitLabel='Bayar'
      cancelLabel='Batal'
      submitIcon='tabler:cash'
    >
      <Grid container spacing={4}>
        {/* Product Information */}
        <Grid item xs={12}>
          <Box sx={panelSx}>
            <Box sx={panelHeaderSx}>
              <Typography
                sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground }}
              >
                Informasi Produk
              </Typography>
            </Box>
            <Box sx={{ px: 4, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <InfoRow label='Nama Produk' value={loanData.productName} />
              <InfoRow label='Gudang' value={loanData.warehouseName} />
              <InfoRow
                label='Stok Pinjaman'
                value={`${loanData.quantity} ${loanData.unitName}`}
                tone={statusTokens.danger.fg}
              />
              {/* Available stock decides how much can be paid, so it is toned to
                  read at a glance: nothing on hand is a blocker, not a reading. */}
              <InfoRow
                label='Stok Tersedia'
                value={`${availableStock} ${loanData.unitName}`}
                tone={availableStock > 0 ? statusTokens.success.fg : statusTokens.danger.fg}
              />
            </Box>
          </Box>
        </Grid>

        {/* Payment */}
        <Grid item xs={12}>
          <Box sx={panelSx}>
            <Box sx={panelHeaderSx}>
              <Typography
                sx={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '20px', color: colors.foreground }}
              >
                Pembayaran
              </Typography>
            </Box>
            <Box sx={{ px: 4, py: 3 }}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='quantity'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        fullWidth
                        type='number'
                        label='Jumlah yang Dibayar'
                        placeholder='0'
                        error={Boolean(errors.quantity)}
                        helperText={errors.quantity?.message}
                        InputProps={{
                          inputProps: {
                            min: 1,
                            max: maxPayable,
                            step: 1
                          }
                        }}
                        onChange={e => {
                          const value = e.target.value
                          // Only allow positive integers
                          if (value === '' || (Number(value) >= 0 && !value.includes('-'))) {
                            field.onChange(value)
                          }
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Read-only ceiling, shown beside the input so the limit is
                    visible while typing rather than below the field. */}
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    disabled
                    label='Maksimal Pembayaran'
                    value={`${maxPayable} ${loanData.unitName}`}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </AppModal>
  )
}
