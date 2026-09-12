import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
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
import { addLongTerm, editLongTerm, fetchLongTermDetail } from 'src/store/apps/liabilities/long-term'

// ** Helpers
import { priceFormat } from 'src/helpers/priceFormatter'

// ** Design Tokens
import { colors, radii, shadows } from 'src/configs/designTokens'

const schema = yup.object({
  date: yup
    .date()
    .required()
    .typeError('Tanggal harus diisi')
    .test('is-previous-month', 'Hanya dapat memilih bulan sebelum bulan ini', function (value) {
      if (!value) return false
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      const selectedMonth = value.getMonth()
      const selectedYear = value.getFullYear()

      // Allow previous months in current year or any month in previous years
      return selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)
    }),
  shareholderLoans: yup
    .number()
    .transform(value => (isNaN(value) ? null : value))
    .required('Pinjaman Kepada Pemegang Saham harus diisi')
    .min(0, 'Nilai harus bernilai positif'),
  longTermBankLoans: yup
    .number()
    .transform(value => (isNaN(value) ? null : value))
    .required('Hutang Bank Jangka Panjang harus diisi')
    .min(0, 'Nilai harus bernilai positif'),
  otherLongtermLiabilities: yup
    .number()
    .transform(value => (isNaN(value) ? null : value))
    .required('Kewajiban Jangka Panjang Lainnya harus diisi')
    .min(0, 'Nilai harus bernilai positif'),
  totalLongtermLiabilities: yup
    .number()
    .transform(value => (isNaN(value) ? null : value))
    .required('Jumlah Liabilitas Jangka Panjang harus diisi')
    .min(0, 'Nilai harus bernilai positif'),
  notes: yup.string().nullable()
})

// Format date transformation helper
function transformDetailLongTerm(data) {
  if (!data) return null
  return {
    ...data,
    date: data.date ? new Date(data.date) : null,
    shareholderLoans: data.shareHolderLoans || '',
    longTermBankLoans: data.longTermBankLoans || '',
    otherLongtermLiabilities: data.otherLongtermLiabilities || '',
    totalLongtermLiabilities: data.totalLongtermLiabilities || '',
    notes: data.notes || ''
  }
}

/**
 * ModalFormLongTerm
 * -------------------------------------------------------------------------------------
 * Add/Edit dialog for a monthly long-term-liability entry (Figma: "Ubah
 * Liabilitas Jangka Pendek" — same shell shared across liabilities/asset
 * modules). Uses the shared `AppModal` shell; Grand Total is read-only.
 */
export default function ModalFormLongTerm({ open, setOpen, typeModal = 'ADD', id }) {
  const dispatch = useDispatch()
  const { detailLongTerm, loadingDetailLongTerm, loadingAction } = useSelector(state => state.longTerm)

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  // Watch values for calculating total
  const watchedValues = watch(['shareholderLoans', 'longTermBankLoans', 'otherLongtermLiabilities'])

  // Calculate total automatically
  useEffect(() => {
    const [shareholders, bankLoans, otherLiabilities] = watchedValues
    const total = [shareholders, bankLoans, otherLiabilities].reduce((sum, value) => {
      const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value
      return sum + (isNaN(numericValue) ? 0 : numericValue)
    }, 0)
    setValue('totalLongtermLiabilities', total)
  }, [watchedValues, setValue])

  const handleClose = () => {
    reset()
    setOpen(false)
  }

  useEffect(() => {
    if (typeModal === 'ADD') {
      reset({
        date: null,
        shareholderLoans: '',
        longTermBankLoans: '',
        otherLongtermLiabilities: '',
        totalLongtermLiabilities: '',
        notes: ''
      })
    } else if (typeModal === 'EDIT' && id) {
      dispatch(fetchLongTermDetail(id))
    }
  }, [typeModal, id, dispatch, reset])

  useEffect(() => {
    if (typeModal === 'EDIT' && detailLongTerm) {
      const transformedData = transformDetailLongTerm(detailLongTerm)
      if (transformedData) {
        reset(transformedData)
      }
    }
  }, [detailLongTerm, typeModal, reset])

  const onSubmit = data => {
    // Format date to YYYY-MM-DD using local timezone
    const formattedData = {
      ...data,
      date: data.date
        ? `${data.date.getFullYear()}-${String(data.date.getMonth() + 1).padStart(2, '0')}-${String(
            data.date.getDate()
          ).padStart(2, '0')}`
        : '',
      shareHolderLoans: data.shareholderLoans, // Backend expects shareHolderLoans
      longTermBankLoans: data.longTermBankLoans,
      otherLongtermLiabilities: data.otherLongtermLiabilities,
      totalLongtermLiabilities: data.totalLongtermLiabilities,
      notes: data.notes
    }

    // Remove frontend-only fields
    delete formattedData.shareholderLoans

    if (typeModal === 'EDIT') {
      dispatch(editLongTerm({ id, data: formattedData }))
    } else {
      dispatch(addLongTerm(formattedData))
    }

    handleClose()
  }

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
      title={typeModal === 'ADD' ? 'Tambah Liabilitas Jangka Panjang' : 'Ubah Liabilitas Jangka Panjang'}
      size='md'
      loading={loadingAction}
      loadingPage={loadingDetailLongTerm && typeModal === 'EDIT'}
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
                placeholderText='Pilih bulan sebelum bulan ini'
                maxDate={new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)}
                filterDate={date => {
                  const now = new Date()
                  const currentMonth = now.getMonth()
                  const currentYear = now.getFullYear()
                  const dateMonth = date.getMonth()
                  const dateYear = date.getFullYear()

                  // Only allow previous months
                  return dateYear < currentYear || (dateYear === currentYear && dateMonth < currentMonth)
                }}
                customInput={
                  <PickersComponent
                    fullWidth
                    label='Periode'
                    error={Boolean(errors.date)}
                    helperText={errors.date?.message || 'Hanya dapat memilih bulan sebelum bulan ini'}
                  />
                }
              />
            )}
          />
          <DatePickerHighZIndexStyles />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name='shareholderLoans'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Pinjaman Kepada Pemegang Saham'
                onChange={e => {
                  const numericValue = e.target.value.replace(/[^\d]/g, '')
                  onChange(numericValue)
                }}
                error={Boolean(errors.shareholderLoans)}
                placeholder='Masukkan nilai pinjaman'
                helperText={errors.shareholderLoans?.message}
                InputProps={{
                  value: value ? priceFormat(value) : ''
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name='longTermBankLoans'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Hutang Bank Jangka Panjang'
                onChange={e => {
                  const numericValue = e.target.value.replace(/[^\d]/g, '')
                  onChange(numericValue)
                }}
                error={Boolean(errors.longTermBankLoans)}
                placeholder='Masukkan hutang bank'
                helperText={errors.longTermBankLoans?.message}
                InputProps={{
                  value: value ? priceFormat(value) : ''
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name='otherLongtermLiabilities'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                label='Kewajiban Jangka Panjang Lainnya'
                onChange={e => {
                  const numericValue = e.target.value.replace(/[^\d]/g, '')
                  onChange(numericValue)
                }}
                error={Boolean(errors.otherLongtermLiabilities)}
                placeholder='Masukkan kewajiban lainnya'
                helperText={errors.otherLongtermLiabilities?.message}
                InputProps={{
                  value: value ? priceFormat(value) : ''
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              p: 4,
              borderRadius: `${radii.lg}px`,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.background
            }}
          >
            <Typography sx={{ fontSize: '0.8125rem', color: colors.foreground, mb: 1 }}>Grand Total</Typography>
            <Controller
              name='totalLongtermLiabilities'
              control={control}
              render={({ field }) => (
                <Typography sx={{ fontSize: '1.375rem', fontWeight: 700, color: colors.foreground }}>
                  {field.value ? priceFormat(field.value) : 'Rp 0'}
                </Typography>
              )}
            />
          </Box>
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
