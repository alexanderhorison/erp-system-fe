import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import PickersComponent from 'src/views/forms/form-elements/pickers/PickersCustomInput'

// ** Shared Components
import AppModal from 'src/views/common/AppModal'
import DatePickerHighZIndexStyles from 'src/views/common/DatePickerHighZIndexStyles'

// ** Store
import { createMonthlyNonCurrentAsset } from 'src/store/apps/asset/non-current'

const defaultValues = {
  nonCurrentDate: '',
  notes: ''
}

const schema = yup.object({
  nonCurrentDate: yup.date().required('Waktu harus diisi'),
  notes: yup.string().nullable()
})

/**
 * ModalFormGenerateNonCurrentAssets
 * -------------------------------------------------------------------------------------
 * Add dialog for generating a monthly non-current-asset entry (Figma: "Tambah
 * Aset Tidak Lancar"). Uses the shared `AppModal` shell; the month/year picker
 * matches Sales Order's DatePicker usage (`PickersComponent` + `popperPlacement`).
 */
export default function ModalFormGenerateNonCurrentAssets({ open, setOpen }) {
  const dispatch = useDispatch()
  const { loadingAction } = useSelector(state => state.nonCurrentAsset)

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues
  })

  const handleClose = () => {
    reset(defaultValues)
    setOpen(false)
  }

  const onSubmit = data => {
    const formattedData = {
      date: `${data.nonCurrentDate.getFullYear()}-${String(data.nonCurrentDate.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(data.nonCurrentDate.getDate()).padStart(2, '0')}`,
      notes: data.notes || ''
    }
    dispatch(createMonthlyNonCurrentAsset({ data: formattedData, setOpen }))
  }

  useEffect(() => {
    // Reset form when modal opens
    if (open) {
      reset(defaultValues)
    }
  }, [open, reset])

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title='Buat Aset Tidak Lancar Bulanan'
      size='sm'
      loading={loadingAction}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Controller
            name='nonCurrentDate'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <DatePicker
                selected={value ? new Date(value) : null}
                onChange={date => onChange(date)}
                dateFormat='MMM yyyy'
                showMonthYearPicker
                popperPlacement={popperPlacement}
                popperProps={{ strategy: 'fixed' }}
                popperClassName='high-z-index-popper'
                maxDate={
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() - 1,
                    new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()
                  )
                }
                placeholderText='Pilih bulan & tahun'
                customInput={
                  <PickersComponent
                    fullWidth
                    label='Pilih bulan & tahun'
                    error={Boolean(errors.nonCurrentDate)}
                    helperText={errors.nonCurrentDate?.message}
                  />
                }
              />
            )}
          />
          <DatePickerHighZIndexStyles />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name='notes'
            control={control}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                value={value || ''}
                label='Catatan'
                onChange={onChange}
                error={Boolean(errors.notes)}
                placeholder='Masukkan Catatan (Opsional)'
                helperText={errors.notes?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
