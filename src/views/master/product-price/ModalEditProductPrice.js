import { Grid } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import CustomTextField from 'src/@core/components/mui/text-field'
import BaseModal from 'src/views/common/BaseModal'
import { addMasterDataProductPrice } from 'src/store/apps/master/product-price'
import { forceUpdateMasterDataModal } from 'src/store/apps/master/modal'

const formatToRupiah = value => {
  if (value == 0) return '0'
  if (!value) return ''
  return value
    .toString()
    .replace(/[^,\d]/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const parseRupiah = value => (value ? parseInt(value.replace(/\./g, ''), 10) : 0)

const schema = yup.object().shape({
  basePrice: yup
    .number()
    .typeError('Base Price harus berupa angka')
    .min(0, 'Base Price harus lebih dari atau sama dengan 0')
    .required('Base Price harus diisi'),
  basePricePos: yup
    .number()
    .typeError('Base Price Pos harus berupa angka')
    .min(0, 'Base Price Pos harus lebih dari atau sama dengan 0')
    .required('Base Price Pos harus diisi'),
  masterModal: yup
    .number()
    .typeError('Master Modal harus berupa angka')
    .min(0, 'Master Modal harus lebih dari atau sama dengan 0')
    .required('Master Modal harus diisi')
})

export default function ModalEditProductPrice({ open, setOpen, row }) {
  const dispatch = useDispatch()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      basePrice: 0,
      basePricePos: 0,
      masterModal: 0
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // Populate form when a row is selected
  useEffect(() => {
    if (row) {
      reset({
        basePrice: row.basePrice ?? 0,
        basePricePos: row.basePricePos ?? 0,
        masterModal: row.masterModal ?? 0
      })
    }
  }, [row, reset])

  const handleClose = () => {
    setOpen(false)
  }

  const onSubmit = values => {
    // Update base price & base price pos
    if (values.basePrice !== row.basePrice || values.basePricePos !== row.basePricePos) {
      dispatch(
        addMasterDataProductPrice({
          ...row,
          basePrice: values.basePrice,
          basePricePos: values.basePricePos
        })
      )
    }

    // Update master modal
    if (values.masterModal !== row.masterModal) {
      dispatch(
        forceUpdateMasterDataModal({
          productId: row.productId,
          unitId: row.unitId,
          modal: values.masterModal
        })
      )
    }

    setOpen(false)
  }

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={`Edit Price — ${row?.productName} (${row?.unitName})`}
      size='sm'
      submitLabel='Simpan'
      cancelLabel='Batal'
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Controller
            name='basePrice'
            control={control}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='text'
                inputMode='numeric'
                label='Base Price'
                value={formatToRupiah(value)}
                onChange={e => {
                  const input = e.target
                  const start = input.selectionStart
                  const raw = parseRupiah(input.value)
                  const formatted = formatToRupiah(raw)
                  onChange(raw)
                  const end = start + (formatted.length - input.value.length)
                  setTimeout(() => input.setSelectionRange(end, end), 0)
                }}
                error={Boolean(errors.basePrice)}
                {...(errors.basePrice && { helperText: errors.basePrice.message })}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name='basePricePos'
            control={control}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='text'
                inputMode='numeric'
                label='Base Price Pos'
                value={formatToRupiah(value)}
                onChange={e => {
                  const input = e.target
                  const start = input.selectionStart
                  const raw = parseRupiah(input.value)
                  const formatted = formatToRupiah(raw)
                  onChange(raw)
                  const end = start + (formatted.length - input.value.length)
                  setTimeout(() => input.setSelectionRange(end, end), 0)
                }}
                error={Boolean(errors.basePricePos)}
                {...(errors.basePricePos && { helperText: errors.basePricePos.message })}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name='masterModal'
            control={control}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='text'
                inputMode='numeric'
                label='Master Modal'
                value={formatToRupiah(value)}
                onChange={e => {
                  const input = e.target
                  const start = input.selectionStart
                  const raw = parseRupiah(input.value)
                  const formatted = formatToRupiah(raw)
                  onChange(raw)
                  const end = start + (formatted.length - input.value.length)
                  setTimeout(() => input.setSelectionRange(end, end), 0)
                }}
                error={Boolean(errors.masterModal)}
                {...(errors.masterModal && { helperText: errors.masterModal.message })}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>Rp</InputAdornment>
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </BaseModal>
  )
}
