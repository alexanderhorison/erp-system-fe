// ** React Imports
import { useEffect } from 'react'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Form Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// ** MUI Imports
import { Grid, Typography, Box, Divider } from '@mui/material'

// ** Custom Component Imports
import BaseModal from '../common/BaseModal'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Store Imports
import { fetchProductWarehouseDetail } from 'src/store/apps/product-warehouse'
import { payLoanStock } from 'src/store/apps/loan-stock'

// ** Validation Schema
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

export default function ModalPayLoanStock({ open, setOpen, loanData }) {
  const dispatch = useDispatch()

  const { detailProductWarehouse } = useSelector(state => state.productWarehouse)

  const {
    control,
    handleSubmit,
    reset,
    setValue,
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

    dispatch(payLoanStock({data: payload, modalTrigger: setOpen}))
  }

  const handleClose = () => {
    setOpen(false)
  }

  if (!loanData) return null

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title='Bayar Pinjaman Stok'
      size='sm'
      submitLabel='Bayar'
      cancelLabel='Batal'
    >
      <Grid container spacing={6}>
        {/* Product Information Section */}
        <Grid item xs={12}>
          <Typography variant='subtitle2' sx={{ mb: 3, fontWeight: 600, color: 'text.secondary', display: 'flex', justifyContent: 'center' }}>
            Informasi Produk
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Product Name */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='body2' color='text.secondary' sx={{ minWidth: '140px' }}>
                Nama Produk
              </Typography>
              <Typography variant='body1' sx={{ fontWeight: 600, textAlign: 'right', flex: 1 }}>
                {loanData.productName}
              </Typography>
            </Box>

            {/* Warehouse */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='body2' color='text.secondary' sx={{ minWidth: '140px' }}>
                Gudang
              </Typography>
              <Typography variant='body1' sx={{ textAlign: 'right', flex: 1 }}>
                {loanData.warehouseName}
              </Typography>
            </Box>

            {/* Loan Quantity */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='body2' color='text.secondary' sx={{ minWidth: '140px' }}>
                Stok Pinjaman
              </Typography>
              <Typography variant='body1' sx={{ fontWeight: 600, color: 'error.main', textAlign: 'right', flex: 1 }}>
                {loanData.quantity} {loanData.unitName}
              </Typography>
            </Box>

            {/* Available Stock */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant='body2' color='text.secondary' sx={{ minWidth: '140px' }}>
                Stok Tersedia
              </Typography>
              <Typography variant='body1' sx={{ fontWeight: 600, color: 'success.main', textAlign: 'right', flex: 1 }}>
                {detailProductWarehouse?.quantity || 0} {loanData.unitName}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Payment Input Section */}
        <Grid item xs={12}>
          <Typography variant='subtitle2' sx={{ mb: 3, fontWeight: 600, color: 'text.secondary' }}>
            Pembayaran
          </Typography>

          <Controller
            name='quantity'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='number'
                label='Jumlah yang Dibayar'
                placeholder='Masukkan jumlah pembayaran'
                error={Boolean(errors.quantity)}
                helperText={errors.quantity?.message}
                InputProps={{
                  inputProps: {
                    min: 1,
                    max: Math.min(detailProductWarehouse?.quantity || 0, loanData.quantity),
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

          {/* Helper Info */}
          <Box sx={{ mt: 2, p: 2, borderRadius: 1, bgcolor: 'action.hover' }}>
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1 }}>
              Maksimal pembayaran
            </Typography>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              {Math.min(detailProductWarehouse?.quantity || 0, loanData.quantity)} {loanData.unitName}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </BaseModal>
  )
}
