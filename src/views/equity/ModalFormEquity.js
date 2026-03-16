import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Box, Grid } from '@mui/material'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomTextField from 'src/@core/components/mui/text-field'
import { addEquity, editEquity, fetchEquityDetail } from 'src/store/apps/equity'
import { priceFormat } from 'src/helpers/priceFormatter'
import BaseModal from '../common/BaseModal'

// Global styles for DatePicker
const datePickerStyles = `
  .react-datepicker-popper {
    z-index: 1500 !important;
  }
  .react-datepicker {
    z-index: 1500 !important;
  }
  .high-z-index-popper {
    z-index: 1500 !important;
  }
  .react-datepicker__month-year-dropdown-container {
    display: flex;
    gap: 10px;
  }
  .react-datepicker__month-dropdown {
    min-width: 120px !important;
    width: 120px !important;
  }
  .react-datepicker__month-option {
    width: 100% !important;
    text-align: center;
    padding: 12px 16px !important;
    margin: 4px 0 !important;
    line-height: 1.6 !important;
    min-height: 40px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 4px !important;
  }
  .react-datepicker__month-option:hover {
    background-color: #e3f2fd !important;
  }
  .react-datepicker__month-year-dropdown {
    min-width: 120px !important;
    max-height: 200px !important;
    overflow-y: auto !important;
  }
  .react-datepicker__year-option {
    padding: 12px 16px !important;
    margin: 4px 0 !important;
    line-height: 1.6 !important;
    min-height: 40px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 4px !important;
  }
  .react-datepicker__year-option:hover {
    background-color: #e3f2fd !important;
  }
`

export default function ModalFormEquity({ open, setOpen, typeModal = 'ADD', id }) {
  const dispatch = useDispatch()
  const { detailEquity, loadingDetailEquity } = useSelector(state => state.equity)

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

  const handleClose = () => {
    reset()
    setOpen(false)
  }

  // Clear detail equity when modal opens to prevent stale data
  useEffect(() => {
    if (open && typeModal === 'ADD') {
      // Clear any existing detail equity data
      dispatch({ type: 'equity/clearDetailEquity' })
    }
  }, [open, typeModal, dispatch])

  // Format date transformation helper
  const transformDetailEquity = data => {
    if (!data) return null

    console.log('Raw detail equity data:', data) // Debug log

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

  useEffect(() => {
    if (typeModal === 'ADD') {
      reset({
        date: null,
        shareCapital: '',
        notes: ''
      })
    } else if ((typeModal === 'EDIT' || typeModal === 'VIEW') && id) {
      console.log('Fetching equity detail for ID:', id) // Debug log
      dispatch(fetchEquityDetail(id))
    }
  }, [typeModal, id, dispatch, reset, open]) // Add open to dependency

  useEffect(() => {
    console.log('DetailEquity changed:', detailEquity, 'Loading:', loadingDetailEquity) // Debug log
    if ((typeModal === 'EDIT' || typeModal === 'VIEW') && detailEquity && !loadingDetailEquity && id) {
      const transformedData = transformDetailEquity(detailEquity)
      if (transformedData) {
        console.log('Setting form data:', transformedData) // Debug log
        // Use reset instead of individual setValue calls
        reset({
          date: transformedData.date,
          shareCapital: transformedData.shareCapital,
          notes: transformedData.notes
        })
      }
    }
  }, [detailEquity, typeModal, loadingDetailEquity, id, reset]) // Use reset instead of setValue

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
    <>
      <style dangerouslySetInnerHTML={{ __html: datePickerStyles }} />
      <BaseModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit(onSubmit)}
        title={typeModal === 'ADD' ? 'Tambahkan Ekuitas' : typeModal === 'VIEW' ? 'Detail Ekuitas' : 'Ubah Ekuitas'}
        size='sm'
        showActions={typeModal !== 'VIEW'}
        loadingPage={loadingDetailEquity && typeModal !== 'ADD'}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Controller
              name='date'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <Box sx={{ overflow: 'visible', position: 'relative', zIndex: 1500 }}>
                  <DatePicker
                    selected={value}
                    onChange={onChange}
                    dateFormat='MMM yyyy'
                    showMonthYearPicker
                    showFullMonthYearPicker={false}
                    disabled={typeModal === 'VIEW'}
                    placeholderText='Pilih bulan & tahun'
                    maxDate={new Date(new Date().getFullYear(), new Date().getMonth(), 0)} // End of current month
                    filterDate={date => {
                      const currentDate = new Date()
                      const currentYear = currentDate.getFullYear()
                      const currentMonth = currentDate.getMonth()

                      // Allow dates up to and including current month
                      return date <= new Date(currentYear, currentMonth + 1, 0)
                    }}
                    customInput={
                      <CustomTextField
                        fullWidth
                        label='Pilih Bulan'
                        placeholder='Pilih bulan & tahun'
                        error={Boolean(errors.date)}
                        helperText={errors.date?.message}
                        InputProps={{
                          style: { cursor: 'pointer' }
                        }}
                      />
                    }
                    popperProps={{
                      strategy: 'fixed',
                      modifiers: [
                        {
                          name: 'preventOverflow',
                          options: {
                            boundary: 'viewport'
                          }
                        },
                        {
                          name: 'flip',
                          options: {
                            fallbackPlacements: ['top-start', 'bottom-start', 'top-end', 'bottom-end']
                          }
                        },
                        {
                          name: 'offset',
                          options: {
                            offset: [0, 8]
                          }
                        }
                      ]
                    }}
                    popperClassName='high-z-index-popper'
                  />
                </Box>
              )}
            />
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
                  disabled={typeModal === 'VIEW'}
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
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  rows={4}
                  multiline
                  fullWidth
                  label='Catatan'
                  disabled={typeModal === 'VIEW'}
                  placeholder='Masukkan catatan (opsional)'
                  error={Boolean(errors.notes)}
                  helperText={errors.notes?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </BaseModal>
    </>
  )
}
