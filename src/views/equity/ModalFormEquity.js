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
import { addEquity, editEquity, fetchEquityDetail, resetEquityState } from 'src/store/apps/equity'

// ** Helpers
import { priceFormat } from 'src/helpers/priceFormatter'

const schema = yup.object({
  date: yup
    .date()
    .required()
    .typeError('Tanggal harus diisi')
    .test('is-current-or-past-month', 'Hanya bisa memilih bulan ini atau sebelumnya', function (value) {
      if (!value) return false
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth()
      const selectedYear = value.getFullYear()
      const selectedMonth = value.getMonth()

      // Allow if selected date is current month or before
      return selectedYear < currentYear || (selectedYear === currentYear && selectedMonth <= currentMonth)
    }),
  shareCapital: yup
    .number()
    .transform(value => (isNaN(value) ? null : value))
    .required('Modal Saham harus diisi')
    .min(0, 'Nilai harus bernilai positif'),
  notes: yup.string().nullable()
})

// Format date transformation helper
function transformDetailEquity(data) {
  if (!data) return null

  // Ensure date is properly formatted
  let transformedDate = null
  if (data.date) {
    transformedDate = new Date(data.date)
    // If invalid date, try alternative parsing
    if (isNaN(transformedDate.getTime())) {
      transformedDate = new Date(data.date.replace(/-/g, '/'))
    }
  }

  return {
    ...data,
    date: transformedDate,
    shareCapital: data.shareCapital ? String(data.shareCapital) : '',
    notes: data.notes || ''
  }
}

/**
 * ModalFormEquity
 * -------------------------------------------------------------------------------------
 * Add/Edit dialog for a monthly equity entry (Figma: "Tambah Ekuitas"). Uses the
 * shared `AppModal` shell.
 */
export default function ModalFormEquity({ open, setOpen, typeModal = 'ADD', id }) {
  const dispatch = useDispatch()
  const { detailEquity, loadingDetailEquity, loading } = useSelector(state => state.equity)

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
    resolver: yupResolver(schema)
  })

  const handleClose = () => {
    dispatch(resetEquityState())
    reset()
    setOpen(false)
  }

  // Clear detail equity when modal opens to prevent stale data
  useEffect(() => {
    if (open && typeModal === 'ADD') {
      dispatch(resetEquityState())
    }
  }, [open, typeModal, dispatch])

  useEffect(() => {
    if (typeModal === 'ADD') {
      reset({
        date: null,
        shareCapital: '',
        notes: ''
      })
    } else if (typeModal === 'EDIT' && id) {
      dispatch(fetchEquityDetail(id))
    }
  }, [typeModal, id, dispatch, reset, open])

  useEffect(() => {
    if (typeModal === 'EDIT' && detailEquity && !loadingDetailEquity && id) {
      const transformedData = transformDetailEquity(detailEquity)
      if (transformedData) {
        reset({
          date: transformedData.date,
          shareCapital: transformedData.shareCapital,
          notes: transformedData.notes
        })
      }
    }
  }, [detailEquity, typeModal, loadingDetailEquity, id, reset])

  const onSubmit = data => {
    // Format date to YYYY-MM-DD using local timezone
    const formattedData = {
      ...data,
      date: data.date
        ? `${data.date.getFullYear()}-${String(data.date.getMonth() + 1).padStart(2, '0')}-${String(
            data.date.getDate()
          ).padStart(2, '0')}`
        : '',
      shareCapital: data.shareCapital,
      notes: data.notes
    }

    if (typeModal === 'EDIT') {
      dispatch(editEquity({ id, data: formattedData, setOpen }))
    } else {
      dispatch(addEquity({ data: formattedData, setOpen }))
    }
  }

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Tambah Ekuitas' : 'Ubah Ekuitas'}
      size='sm'
      loading={loading}
      loadingPage={loadingDetailEquity && typeModal === 'EDIT'}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='date'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <DatePicker
                selected={value}
                onChange={onChange}
                dateFormat='MMM yyyy'
                showMonthYearPicker
                popperPlacement={popperPlacement}
                popperProps={{ strategy: 'fixed' }}
                popperClassName='high-z-index-popper'
                disabled={typeModal === 'EDIT'}
                placeholderText='Pilih bulan & tahun'
                maxDate={new Date(new Date().getFullYear(), new Date().getMonth(), 0)}
                filterDate={date => {
                  const currentDate = new Date()
                  const currentYear = currentDate.getFullYear()
                  const currentMonth = currentDate.getMonth()

                  // Allow dates up to and including current month
                  return date <= new Date(currentYear, currentMonth + 1, 0)
                }}
                customInput={
                  <PickersComponent
                    fullWidth
                    label='Periode'
                    error={Boolean(errors.date)}
                    helperText={errors.date?.message}
                  />
                }
              />
            )}
          />
          <DatePickerHighZIndexStyles />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name='shareCapital'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Modal Saham'
                onChange={e => {
                  const numericValue = e.target.value.replace(/[^\d]/g, '')
                  onChange(numericValue)
                }}
                error={Boolean(errors.shareCapital)}
                placeholder='Masukkan modal saham'
                helperText={errors.shareCapital?.message}
                InputProps={{
                  value: value ? priceFormat(value) : ''
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name='notes'
            control={control}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                multiline
                rows={4}
                value={value || ''}
                label='Catatan'
                onChange={onChange}
                placeholder='Masukkan catatan (opsional)'
                error={Boolean(errors.notes)}
                helperText={errors.notes?.message}
              />
            )}
          />
        </Grid>
      </Grid>
    </AppModal>
  )
}
