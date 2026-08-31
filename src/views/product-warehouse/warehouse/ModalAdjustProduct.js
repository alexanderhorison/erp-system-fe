// ** React Imports
import { useEffect, useState } from 'react'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

import { editProductWarehouse } from 'src/store/apps/product-warehouse'
import AppModal from 'src/views/common/AppModal'
import ProductInfoHeader from 'src/views/common/ProductInfoHeader'

// ** Design Tokens
import { colors } from 'src/configs/designTokens'

/**
 * ModalAdjustProduct
 * -------------------------------------------------------------------------------------
 * Single "Sesuaikan Stok" dialog covering what used to be three separate modals
 * (PLUS / MINUS / MINIMUM_STOCK). The direction is now chosen with a
 * Tambah/Kurangi radio instead of a dedicated button per action, and the minimum
 * stock is edited alongside it.
 *
 * `adjustmentType` is still sent to `editProductWarehouse`, so the request shape
 * is unchanged — only where the value comes from.
 */
export default function ModalAdjustProduct({ open, setOpen, typeModal, warehouseId }) {
  const dispatch = useDispatch()

  const { detailProductWarehouse, loadingDetailProductWarehouse, loadingEditProduct } = useSelector(
    state => state.productWarehouse
  )

  // ** Direction defaults to whichever action opened the dialog, so the existing
  // per-row buttons keep working.
  const [adjustmentType, setAdjustmentType] = useState(typeModal === 'MINUS' ? 'MINUS' : 'PLUS')

  const schema = yup.object().shape({
    quantityAdjustment: yup
      .string()
      .required('Jumlah adjustment harus diisi')
      .test('is-valid-number', 'Jumlah adjustment harus berupa angka', value => !isNaN(Number(value)))
      .test('is-non-negative', 'Jumlah adjustment tidak boleh minus', value => Number(value) >= 0)
      .test('quantity-adjustment', 'Jumlah tidak boleh lebih besar dari Kuantiti', function (value) {
        const num = Number(value)
        if (adjustmentType === 'MINUS' && num > Number(this.parent.quantity)) {
          return this.createError({
            path: 'quantityAdjustment',
            message: 'Jumlah tidak boleh lebih besar dari Kuantiti jika mengurangi produk'
          })
        }

        return true
      }),
    minimumStock: yup
      .string()
      .required('Jumlah stok minimal harus diisi')
      .test(
        'is-non-negative',
        'Jumlah stok minimal tidak boleh minus',
        value => !isNaN(Number(value)) && Number(value) >= 0
      )
  })

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    values: detailProductWarehouse,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = data => {
    const idProduct = data.id
    const sendData = {
      quantityAdjustment: data.quantityAdjustment,
      quantity: data.quantity,
      minimumStock: data.minimumStock,
      adjustmentType
    }
    dispatch(editProductWarehouse({ id: idProduct, data: sendData, warehouseId }))
    setOpen(false)
  }

  useEffect(() => {
    // disable warn for select if select not have a child item
    console.warn = () => {}
  }, [dispatch])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title='Sesuaikan Stok'
      size='sm'
      showActions={typeModal !== 'VIEW'}
      loading={loadingEditProduct}
      loadingPage={loadingDetailProductWarehouse}
    >
      <ProductInfoHeader data={detailProductWarehouse} />

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground }}>Jumlah</Typography>
            <RadioGroup
              row
              value={adjustmentType}
              onChange={event => setAdjustmentType(event.target.value)}
              sx={{ gap: 2 }}
            >
              <FormControlLabel
                value='PLUS'
                control={<Radio size='small' />}
                label='Tambah'
                sx={{ mr: 0, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
              <FormControlLabel
                value='MINUS'
                control={<Radio size='small' />}
                label='Kurangi'
                sx={{ mr: 0, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            </RadioGroup>
          </Box>
          <Controller
            name='quantityAdjustment'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                onChange={e => onChange(e.target.value)}
                type='number'
                sx={{ display: 'block' }}
                error={Boolean(errors.quantityAdjustment)}
                {...(errors.quantityAdjustment
                  ? { helperText: errors.quantityAdjustment.message }
                  : {
                      helperText: adjustmentType === 'MINUS' ? 'Stok akan dikurangi' : 'Stok akan ditambahkan'
                    })}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: colors.foreground, mt: 2}}>Stock Minimal</Typography>
          </Box>
          <Controller
            name='minimumStock'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={value}
                onChange={e => onChange(e.target.value)}
                type='number'
                sx={{ display: 'block' }}
                error={Boolean(errors.minimumStock)}
                {...(errors.minimumStock && { helperText: errors.minimumStock.message })}
              />
            )}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
